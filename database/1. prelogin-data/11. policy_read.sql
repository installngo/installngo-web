-- allow read-only access to authenticated users

-- continents
create policy "allow authenticated users to read continents"
on public.continents
for select
to authenticated
using (is_active = true);

-- subregions
create policy "allow authenticated users to read subregions"
on public.subregions
for select
to authenticated
using (is_active = true);

-- countries
create policy "allow authenticated users to read countries"
on public.countries
for select
to authenticated
using (is_active = true);

-- languages
create policy "allow authenticated users to read languages"
on public.languages
for select
to authenticated
using (is_active = true);

-- country_languages
create policy "allow authenticated users to read country languages"
on public.country_languages
for select
to authenticated
using (is_active = true);

-- currencies
create policy "allow authenticated users to read currencies"
on public.currencies
for select
to authenticated
using (is_active = true);

-- country_currencies
create policy "allow authenticated users to read country currencies"
on public.country_currencies
for select
to authenticated
using (is_active = true);

-- organization_types
create policy "allow authenticated users to read organization types"
on public.organization_types
for select
to authenticated
using (is_active = true);

-- organization_categories
create policy "allow authenticated users to read organization categories"
on public.organization_categories
for select
to authenticated
using (is_active = true);