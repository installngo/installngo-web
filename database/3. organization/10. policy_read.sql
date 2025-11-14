-- allow read-only access to authenticated users

-- organization_users
create policy "allow authenticated users to read organization users"
on organization_users
for select
using ((select auth.uid()) = user_id);

-- organization_menus
create policy "allow authenticated users to read organization menus"
on public.organization_menus
for select
to authenticated
using (true);

-- organization_categories
create policy "allow read on organization categories from authenticated users"
on public.organization_course_categories
for select
using (
  auth.uid() in (
    select user_id
    from public.organization_users
    where organization_id = organization_course_categories.organization_id
  )
);

-- organization_subcategories
create policy "allow read on organization subcategories from authenticated users"
on public.organization_course_subcategories
for select
using (
  auth.uid() in (
    select user_id
    from public.organization_users
    where organization_id = organization_course_subcategories.organization_id
  )
);

-- organization_courses
create policy "allow read on organization courses from authenticated users"
on organization_courses
for select
using (
  organization_id = (auth.jwt() ->> 'organization_id')::uuid
);

-- organization_coupons
create policy "allow read on organization coupons from authenticated users"
on organization_coupons
for select
using (
  organization_id = (auth.jwt() ->> 'organization_id')::uuid
);

-- organization_coupon_courses
create policy "allow read on organization coupon courses from authenticated users"
on organization_coupon_courses
for select
using (
  exists (
    select 1
    from organization_coupons c
    where c.coupon_id = organization_coupon_courses.coupon_id
      and c.organization_id = (auth.jwt() ->> 'organization_id')::uuid
  )
);