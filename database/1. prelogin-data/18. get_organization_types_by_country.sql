create or replace function public.get_organization_types_by_country()
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_agg(
    jsonb_build_object(
      'organization_type_code', t.organization_type_code,
      'type_name', t.type_name,
      'type_description', t.type_description,
      'country_code', t.country_code,
      'categories', (
        select coalesce(jsonb_agg(jsonb_build_object(
          'organization_category_code', c.organization_category_code,
          'category_name', c.category_name,
          'category_description', c.category_description
        )), '[]'::jsonb)
        from public.organization_categories c
        where c.organization_type_code = t.organization_type_code
        and c.is_active = true
      )
    )
  )
  from public.organization_types t
  where t.is_active = true;
$$;