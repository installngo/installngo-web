-- function
create or replace function public.get_prelogin_data()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  continents_json jsonb;
  subregions_json jsonb;
  countries_json jsonb;
  languages_json jsonb;
  country_languages_json jsonb;
  currencies_json jsonb;
  country_currencies_json jsonb;
begin
  -- Continents
  select jsonb_agg(row_to_json(c)) into continents_json
  from public.continents c
  where c.is_active = true;

  -- Subregions
  select jsonb_agg(row_to_json(s)) into subregions_json
  from public.subregions s
  where s.is_active = true;

  -- Countries
  select jsonb_agg(row_to_json(ct)) into countries_json
  from public.countries ct
  where ct.is_active = true;

  -- Languages
  select jsonb_agg(row_to_json(l)) into languages_json
  from public.languages l
  where l.is_active = true;

  -- Country Languages
  select jsonb_agg(row_to_json(cl)) into country_languages_json
  from public.country_languages cl
  where cl.is_active = true;

  -- Currencies
  select jsonb_agg(row_to_json(cr)) into currencies_json
  from public.currencies cr
  where cr.is_active = true;

  -- Country Currencies
  select jsonb_agg(row_to_json(cc)) into country_currencies_json
  from public.country_currencies cc
  where cc.is_active = true;

  -- Combine all JSON blocks
  return jsonb_build_object(
    'continents', coalesce(continents_json, '[]'::jsonb),
    'subregions', coalesce(subregions_json, '[]'::jsonb),
    'countries', coalesce(countries_json, '[]'::jsonb),
    'languages', coalesce(languages_json, '[]'::jsonb),
    'country_languages', coalesce(country_languages_json, '[]'::jsonb),
    'currencies', coalesce(currencies_json, '[]'::jsonb),
    'country_currencies', coalesce(country_currencies_json, '[]'::jsonb)
  );
end;
$$;