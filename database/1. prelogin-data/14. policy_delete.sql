-- block delete from authenticated users

-- continents
create policy "block delete on continents from authenticated users"
on public.continents
for delete
to authenticated
using (false);

-- subregions
create policy "block delete on subregions from authenticated users"
on public.subregions
for delete
to authenticated
using (false);

-- countries
create policy "block delete on countries from authenticated users"
on public.countries
for delete
to authenticated
using (false);

-- languages
create policy "block delete on languages from authenticated users"
on public.languages
for delete
to authenticated
using (false);

-- country_languages
create policy "block delete on country languages from authenticated users"
on public.country_languages
for delete
to authenticated
using (false);

-- currencies
create policy "block delete on currencies from authenticated users"
on public.currencies
for delete
to authenticated
using (false);

-- country_currencies
create policy "block delete on country currencies from authenticated users"
on public.country_currencies
for delete
to authenticated
using (false);

-- organization_types
create policy "block delete on organization types from authenticated users"
on public.organization_types
for delete
to authenticated
using (false);

-- organization_categories
create policy "block delete on organization categories from authenticated users"
on public.organization_categories
for delete
to authenticated
using (false);