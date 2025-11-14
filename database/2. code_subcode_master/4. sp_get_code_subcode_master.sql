create or replace function public.sp_get_code_subcode_master(p_code_types text[])
returns jsonb
language sql
security definer
set search_path = public, pg_temp
as $$
  select jsonb_agg(
    jsonb_build_object(
      'code_master_id', cm.code_master_id,
      'code_type', cm.code_type,
      'code_code', cm.code_code,
      'display_name', cm.display_name,
      'is_default', cm.is_default,
      'display_sequence', cm.display_sequence,
      'sub_codes', coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'subcode_master_id', scm.subcode_master_id,
              'subcode_code', scm.subcode_code,
              'display_name', scm.display_name,
              'is_default', scm.is_default,
              'display_sequence', scm.display_sequence
            ) order by scm.display_sequence
          )
          from subcode_master scm
          where scm.code_master_id = cm.code_master_id
            and scm.is_active = true
        ), '[]'::jsonb
      )
    )
    order by cm.display_sequence
  )
  from code_master cm
  where cm.code_type = any(p_code_types)
    and cm.is_active = true;
$$;