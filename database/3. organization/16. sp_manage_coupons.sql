create or replace function sp_manage_coupons(
  p_action text,
  p_coupon_id uuid default null,
  p_coupon_code text default null,
  p_organization_id uuid default null,

  p_coupon_title text default null,
  p_discount_type_code text default null,
  p_fixed_discount_value numeric(10) default null,
  p_percentage_discount_value numeric(3) default null,

  p_is_lifetime boolean default false,
  p_start_date timestamptz default null,
  p_end_date timestamptz default null,

  p_max_uses int default null,
  p_per_user_limit int default null,

  p_is_public boolean default true,
  p_is_visible boolean default true,
  p_is_active boolean default true,

  p_applicable_courses jsonb default '[]'::jsonb
)
returns json
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_org_id uuid;
  v_coupon_id uuid;
begin
  -- Resolve organization ID from JWT if not explicitly provided
  v_org_id := coalesce(
    p_organization_id,
    nullif(auth.jwt() ->> 'organization_id', '')::uuid
  );

  if v_org_id is null then
    return json_build_object('success', false, 'error', 'Organization ID missing or unauthorized');
  end if;

  -- Ensure p_applicable_courses is a JSON array
  if jsonb_typeof(p_applicable_courses) is distinct from 'array' then
    p_applicable_courses := '[]'::jsonb;
  end if;

  -- INSERT
  if p_action = 'insert' then
    insert into organization_coupons (
      coupon_id,
      organization_id,
      coupon_title,
      coupon_code,
      discount_type_code,
      fixed_discount_value,
      percentage_discount_value,
      is_lifetime,
      start_date,
      end_date,
      max_uses,
      per_user_limit,
      is_public,
      is_visible,
      is_active
    )
    values (
      coalesce(p_coupon_id, gen_random_uuid()),
      v_org_id,
      p_coupon_title,
      coalesce(p_coupon_code, upper(substring(md5(random()::text), 1, 8))),
      p_discount_type_code,
      p_fixed_discount_value,
      p_percentage_discount_value,
      coalesce(p_is_lifetime, false),
      p_start_date,
      p_end_date,
      p_max_uses,
      p_per_user_limit,
      coalesce(p_is_public, true),
      coalesce(p_is_visible, true),
      coalesce(p_is_active, true)
    )
    returning coupon_id into v_coupon_id;

    -- Manage applicable courses
    if jsonb_array_length(p_applicable_courses) > 0 then
      insert into organization_coupon_courses (coupon_id, course_id)
      select v_coupon_id, trim(both '"' from value::text)::uuid
      from jsonb_array_elements(p_applicable_courses)
      where not exists (
        select 1 from organization_coupon_courses
        where coupon_id = v_coupon_id and course_id = trim(both '"' from value::text)::uuid
      );
    end if;

    return json_build_object(
      'success', true,
      'coupon_id', v_coupon_id,
      'message', 'Coupon created successfully'
    );

  -- UPDATE
  elsif p_action = 'update' then
    update organization_coupons
    set
      coupon_title = coalesce(p_coupon_title, coupon_title),
      coupon_code = coalesce(p_coupon_code, coupon_code),
      discount_type_code = coalesce(p_discount_type_code, discount_type_code),
      fixed_discount_value = coalesce(p_fixed_discount_value, fixed_discount_value),
      percentage_discount_value = coalesce(p_percentage_discount_value, percentage_discount_value),
      is_lifetime = coalesce(p_is_lifetime, is_lifetime),
      start_date = coalesce(p_start_date, start_date),
      end_date = coalesce(p_end_date, end_date),
      max_uses = coalesce(p_max_uses, max_uses),
      per_user_limit = coalesce(p_per_user_limit, per_user_limit),
      is_public = coalesce(p_is_public, is_public),
      is_visible = coalesce(p_is_visible, is_visible),
      is_active = coalesce(p_is_active, is_active)
    where coupon_id = p_coupon_id
      and organization_id = v_org_id;

    if not found then
      return json_build_object('success', false, 'error', 'Coupon not found or unauthorized');
    end if;

    -- Refresh applicable courses if array provided
    if jsonb_typeof(p_applicable_courses) = 'array' then
      delete from organization_coupon_courses
      where coupon_id = p_coupon_id;

      if jsonb_array_length(p_applicable_courses) > 0 then
        insert into organization_coupon_courses (coupon_id, course_id)
        select p_coupon_id, trim(both '"' from value::text)::uuid
        from jsonb_array_elements(p_applicable_courses);
      end if;
    end if;

    return json_build_object(
      'success', true,
      'coupon_id', p_coupon_id,
      'message', 'Coupon updated successfully'
    );

  -- DELETE
  elsif p_action = 'delete' then
    delete from organization_coupon_courses where coupon_id = p_coupon_id;
    delete from organization_coupons
    where coupon_id = p_coupon_id
      and organization_id = v_org_id
    returning coupon_id into v_coupon_id;

    if v_coupon_id is null then
      return json_build_object('success', false, 'error', 'Coupon not found or unauthorized');
    end if;

    return json_build_object(
      'success', true,
      'coupon_id', v_coupon_id,
      'message', 'Coupon deleted successfully'
    );

  -- GET ALL
  elsif p_action = 'get_all' then
  return (
    select coalesce(json_agg(coupon_obj), '[]'::json)
    from (
      select
        c.*,
        coalesce(cc.applicable_courses, '[]'::jsonb) as applicable_courses
      from organization_coupons c
      left join (
        select coupon_id, jsonb_agg(course_id) as applicable_courses
        from organization_coupon_courses
        group by coupon_id
      ) cc on c.coupon_id = cc.coupon_id
      where c.organization_id = v_org_id
      order by c.created_at desc
    ) coupon_obj
  );

  -- GET ONE
  elsif p_action = 'get_one' then
    return (
      select row_to_json(c) || jsonb_build_object('applicable_courses', coalesce(cc.applicable_courses, '[]'::jsonb))
      from organization_coupons c
      left join (
        select coupon_id, jsonb_agg(course_id) as applicable_courses
        from organization_coupon_courses
        group by coupon_id
      ) cc on c.coupon_id = cc.coupon_id
      where c.coupon_id = p_coupon_id
        and c.organization_id = v_org_id
    );

  else
    return json_build_object('success', false, 'error', 'Invalid action provided');
  end if;
end;
$$;