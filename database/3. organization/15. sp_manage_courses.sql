create or replace function sp_manage_courses(
  p_action text,
  p_course_id uuid default null,
  p_course_code text default null,
  p_organization_id uuid default null,

  p_is_paid boolean default false,

  p_course_title text default null,
  p_course_description text default null,
  p_thumbnail_url text default null,

  p_category_code text default null,
  p_sub_category_code text default null,

  p_original_price numeric(10,2) default null,
  p_discount_price numeric(10,2) default null,
  p_effective_price numeric(10,2) default null,

  p_validity_code text default null,
  p_single_validity_code text default null,
  p_expiry_date timestamptz default null,

  p_mark_new boolean default false,
  p_mark_featured boolean default false,
  p_has_offline_material boolean default false,

  p_status_code text default null 
)
returns json
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_org_id uuid;
  result json;
begin
  -- Determine organization_id
  v_org_id := coalesce(
    p_organization_id,
    nullif(auth.jwt() ->> 'organization_id', '')::uuid
  );

  if v_org_id is null then
    return json_build_object('success', false, 'error', 'Organization ID missing or unauthorized');
  end if;

  -- INSERT
  if p_action = 'insert' then
    insert into organization_courses (
      course_id,
      course_code,
      organization_id,
      is_paid,
      course_title,
      course_description,
      thumbnail_url,
      category_code,
      subcategory_code,
      original_price,
      discount_price,
      effective_price,
      validity_code,
      single_validity_code,
      expiry_date,
      mark_new,
      mark_featured,
      has_offline_material,
      status_code
    )
    values (
      coalesce(p_course_id, gen_random_uuid()),
      coalesce(p_course_code, upper(substring(md5(random()::text),1,8))),
      v_org_id,
      coalesce(p_is_paid, false),
      p_course_title,
      p_course_description,
      p_thumbnail_url,
      p_category_code,
      p_sub_category_code,
      p_original_price,
      p_discount_price,
      p_effective_price,
      p_validity_code,
      p_single_validity_code,
      p_expiry_date,
      coalesce(p_mark_new, false),
      coalesce(p_mark_featured, false),
      coalesce(p_has_offline_material, false),
      coalesce(p_status_code, 'ACTIVE')
    )
    returning json_build_object(
      'success', true,
      'course_id', course_id,
      'course_code', course_code,
      'message', 'Course inserted successfully'
    )
    into result;

    return result;

  -- UPDATE
  elsif p_action = 'update' then
    update organization_courses
    set
      course_code = coalesce(p_course_code, course_code),
      is_paid = coalesce(p_is_paid, is_paid),
      course_title = coalesce(p_course_title, course_title),
      course_description = coalesce(p_course_description, course_description),
      thumbnail_url = coalesce(p_thumbnail_url, thumbnail_url),
      category_code = coalesce(p_category_code, category_code),
      subcategory_code = coalesce(p_sub_category_code, subcategory_code),
      original_price = coalesce(p_original_price, original_price),
      discount_price = coalesce(p_discount_price, discount_price),
      effective_price = coalesce(p_effective_price, effective_price),
      validity_code = coalesce(p_validity_code, validity_code),
      single_validity_code = case when p_single_validity_code is null then null else coalesce(p_single_validity_code, single_validity_code) end,
      expiry_date = case when p_expiry_date is null then null else coalesce(p_expiry_date, expiry_date) end,
      mark_new = coalesce(p_mark_new, mark_new),
      mark_featured = coalesce(p_mark_featured, mark_featured),
      has_offline_material = coalesce(p_has_offline_material, has_offline_material),
      status_code = coalesce(p_status_code, status_code),
      updated_at = now()
    where (course_id = p_course_id or course_code = p_course_code)
      and organization_id = v_org_id
    returning json_build_object(
      'success', true,
      'course_id', course_id,
      'course_code', course_code,
      'message', 'Course updated successfully'
    )
    into result;

    if result is null then
      return json_build_object('success', false, 'error', 'Course not found or unauthorized');
    end if;

    return result;

  -- DELETE
  elsif p_action = 'delete' then
    delete from organization_courses
    where (course_id = p_course_id or course_code = p_course_code)
      and organization_id = v_org_id
    returning json_build_object(
      'success', true,
      'course_id', course_id,
      'course_code', course_code,
      'message', 'Course deleted successfully'
    )
    into result;

    if result is null then
      return json_build_object('success', false, 'error', 'Course not found or unauthorized');
    end if;

    return result;

  -- GET ALL
  elsif p_action = 'get_all' then
    return (
      select coalesce(json_agg(row_to_json(c)), '[]'::json)
      from (
        select *
        from organization_courses
        where organization_id = v_org_id
        order by created_at desc
      ) c
    );

  -- GET ONE
  elsif p_action = 'get_one' then
    return (
      select row_to_json(c)
      from organization_courses c
      where (c.course_id = p_course_id or c.course_code = p_course_code)
        and c.organization_id = v_org_id
    );

  else
    return json_build_object('success', false, 'error', 'Invalid action provided');
  end if;
end;
$$;