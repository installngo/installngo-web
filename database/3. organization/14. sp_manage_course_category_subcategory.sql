create or replace function sp_manage_course_category_subcategory(
  p_action text,
  p_type text, 

  p_id uuid default null,
  p_organization_id uuid default null,

  p_category_code text default null,
  p_subcategory_code text default null,
  p_display_name text default null,
  p_display_order int default null,
  p_is_default boolean default null,
  p_is_active boolean default null
)
returns json
language plpgsql
security invoker
as $$
declare
  v_org_id uuid;
  result json;
begin
  v_org_id := coalesce(
    p_organization_id,
    nullif(auth.jwt() ->> 'organization_id', '')::uuid
  );

  if v_org_id is null then
    return json_build_object('success', false, 'error', 'Organization ID missing or unauthorized');
  end if;

  if p_type = 'category' then
    if p_action = 'insert' then
      insert into organization_course_categories (
        organization_id,
        category_code,
        display_name,
        display_order,
        is_default,
        is_active
      )
      values (
        v_org_id,
        p_category_code,
        p_display_name,
        coalesce(p_display_order, 0),
        coalesce(p_is_default, false),
        coalesce(p_is_active, true)
      )
      returning json_build_object(
        'success', true,
        'course_category_id', course_category_id,
        'message', 'Category inserted successfully'
      )
      into result;

      return result;

    elsif p_action = 'update' then
      update organization_course_categories
      set
        display_name = coalesce(p_display_name, display_name),
        display_order = coalesce(p_display_order, display_order),
        is_default = coalesce(p_is_default, is_default),
        is_active = coalesce(p_is_active, is_active)
      where course_category_id = p_id
        and organization_id = v_org_id
      returning json_build_object(
        'success', true,
        'course_category_id', course_category_id,
        'message', 'Category updated successfully'
      )
      into result;

      if result is null then
        return json_build_object('success', false, 'error', 'Category not found or unauthorized');
      end if;

      return result;

    elsif p_action = 'delete' then
      delete from organization_course_categories
      where course_category_id = p_id
        and organization_id = v_org_id
      returning json_build_object(
        'success', true,
        'course_category_id', p_id,
        'message', 'Category deleted successfully'
      )
      into result;

      if result is null then
        return json_build_object('success', false, 'error', 'Category not found or unauthorized');
      end if;

      return result;

    elsif p_action = 'get_all' then
      return (
        select coalesce(json_agg(row_to_json(c)), '[]'::json)
        from (
          select *
          from organization_course_categories
          where organization_id = v_org_id
          order by display_order, created_at desc
        ) c
      );

    elsif p_action = 'get_one' then
      return (
        select row_to_json(c)
        from organization_course_categories c
        where c.course_category_id = p_id
          and c.organization_id = v_org_id
      );

    else
      return json_build_object('success', false, 'error', 'Invalid action for category');
    end if;
  end if;
  
  if p_type = 'subcategory' then
    if p_action = 'insert' then
      insert into organization_course_subcategories (
        organization_id,
        category_code,
        subcategory_code,
        display_name,
        display_order,
        is_default,
        is_active
      )
      values (
        v_org_id,
        p_category_code,
        p_subcategory_code,
        p_display_name,
        coalesce(p_display_order, 0),
        coalesce(p_is_default, false),
        coalesce(p_is_active, true)
      )
      returning json_build_object(
        'success', true,
        'course_subcategory_id', course_subcategory_id,
        'message', 'Subcategory inserted successfully'
      )
      into result;

      return result;

    elsif p_action = 'update' then
      update organization_course_subcategories
      set
        display_name = coalesce(p_display_name, display_name),
        display_order = coalesce(p_display_order, display_order),
        is_default = coalesce(p_is_default, is_default),
        is_active = coalesce(p_is_active, is_active)
      where course_subcategory_id = p_id
        and organization_id = v_org_id
      returning json_build_object(
        'success', true,
        'course_subcategory_id', course_subcategory_id,
        'message', 'Subcategory updated successfully'
      )
      into result;

      if result is null then
        return json_build_object('success', false, 'error', 'Subcategory not found or unauthorized');
      end if;

      return result;

    elsif p_action = 'delete' then
      delete from organization_course_subcategories
      where course_subcategory_id = p_id
        and organization_id = v_org_id
      returning json_build_object(
        'success', true,
        'course_subcategory_id', p_id,
        'message', 'Subcategory deleted successfully'
      )
      into result;

      if result is null then
        return json_build_object('success', false, 'error', 'Subcategory not found or unauthorized');
      end if;

      return result;

    elsif p_action = 'get_all' then
      return (
        select coalesce(json_agg(row_to_json(s)), '[]'::json)
        from (
          select *
          from organization_course_subcategories
          where organization_id = v_org_id
          order by display_order, created_at desc
        ) s
      );

    elsif p_action = 'get_by_category' then
      return (
        select coalesce(json_agg(row_to_json(s)), '[]'::json)
        from (
          select *
          from organization_course_subcategories
          where organization_id = v_org_id
            and category_code = p_category_code
          order by display_order, created_at desc
        ) s
      );

    elsif p_action = 'get_one' then
      return (
        select row_to_json(s)
        from organization_course_subcategories s
        where s.course_subcategory_id = p_id
          and s.organization_id = v_org_id
      );

    else
      return json_build_object('success', false, 'error', 'Invalid action for subcategory');
    end if;
  end if;

  return json_build_object('success', false, 'error', 'Invalid type provided');
end;
$$;