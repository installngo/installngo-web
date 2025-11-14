-- block update from authenticated users

-- continents
create policy "block update on continents from authenticated users"
on public.continents
for update
to authenticated
using (false);

-- subregions
create policy "block update on subregions from authenticated users"
on public.subregions
for update
to authenticated
using (false);

-- countries
create policy "block update on countries from authenticated users"
on public.countries
for update
to authenticated
using (false);

-- languages
create policy "block update on languages from authenticated users"
on public.languages
for update
to authenticated
using (false);

-- country_languages
create policy "block update on country languages from authenticated users"
on public.country_languages
for update
to authenticated
using (false);

-- currencies
create policy "block update on currencies from authenticated users"
on public.currencies
for update
to authenticated
using (false);

-- country_currencies
create policy "block update on country currencies from authenticated users"
on public.country_currencies
for update
to authenticated
using (false);

-- organization_types
create policy "block update on organization types from authenticated users"
on public.organization_types
for update
to authenticated
using (false);

-- organization_categories
create policy "block update on organization categories from authenticated users"
on public.organization_categories
for update
to authenticated
using (false);