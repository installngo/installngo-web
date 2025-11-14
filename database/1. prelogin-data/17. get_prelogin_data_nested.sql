create or replace function public.get_prelogin_data_nested()
returns jsonb
set search_path = public
language plpgsql
as $$
declare
  result jsonb;
begin
  select jsonb_agg(
    jsonb_build_object(
      'continent_code', c.continent_code,
      'continent_name', c.continent_name,
      'subregions', (
        select jsonb_agg(
          jsonb_build_object(
            'subregion_code', s.subregion_code,
            'subregion_name', s.subregion_name,
            'countries', (
              select jsonb_agg(
                jsonb_build_object(
                  'country_code', co.country_code,
                  'country_name', co.country_name,
                  'flag_emoji', co.flag_emoji,
                  'phone_code', co.phone_code,
                  'currencies', (
                    select jsonb_agg(
                      jsonb_build_object(
                        'currency_code', cu.currency_code,
                        'currency_name', cu.currency_name,
                        'currency_symbol', cu.currency_symbol
                      )
                    )
                    from public.country_currencies cc
                    join public.currencies cu
                      on cc.currency_code = cu.currency_code
                    where cc.country_code = co.country_code
                      and cu.is_active = true
                  ),
                  'languages', (
                    select jsonb_agg(
                      jsonb_build_object(
                        'language_code', l.language_code,
                        'language_name', l.language_name,
                        'is_official', cl.is_official
                      )
                    )
                    from public.country_languages cl
                    join public.languages l
                      on cl.language_code = l.language_code
                    where cl.country_code = co.country_code
                      and l.is_active = true
                  )
                )
              )
              from public.countries co
              where co.subregion_code = s.subregion_code
                and co.is_active = true
            )
          )
        )
        from public.subregions s
        where s.continent_code = c.continent_code
          and s.is_active = true
      )
    )
  )
  into result
  from public.continents c
  where c.is_active = true;

  return result;
end;
$$;