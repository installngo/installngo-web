-- block insert from authenticated users

-- continents
create policy "block insert on continents from authenticated users"
on public.continents
for insert
to authenticated
with check (false);

-- subregions
create policy "block insert on subregions from authenticated users"
on public.subregions
for insert
to authenticated
with check (false);

-- countries
create policy "block insert on countries from authenticated users"
on public.countries
for insert
to authenticated
with check (false);

-- languages
create policy "block insert on languages from authenticated users"
on public.languages
for insert
to authenticated
with check (false);

-- country_languages
create policy "block insert on country languages from authenticated users"
on public.country_languages
for insert
to authenticated
with check (false);

-- currencies
create policy "block insert on currencies from authenticated users"
on public.currencies
for insert
to authenticated
with check (false);

-- country_currencies
create policy "block insert on country currencies from authenticated users"
on public.country_currencies
for insert
to authenticated
with check (false);

-- organization_types
create policy "block insert on organization types from authenticated users"
on public.organization_types
for insert
to authenticated
with check (false);

-- organization_categories
create policy "block insert on organization categories from authenticated users"
on public.organization_categories
for insert
to authenticated
with check (false);