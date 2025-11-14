-- block insert from authenticated users

-- organization_users
create policy "block insert on organization users from authenticated users"
on organization_users
for insert
with check ((select auth.uid()) = user_id);

-- organization_menus
create policy "block insert on organization menus from authenticated users"
on public.organization_menus
for insert
to authenticated
with check (false);

-- organization_categories
create policy "allow insert on organization categories from authenticated users"
on public.organization_course_categories
for insert
with check (
  auth.uid() in (
    select user_id
    from public.organization_users
    where organization_id = organization_course_categories.organization_id
  )
);

-- organization_subcategories
create policy "allow insert on organization subcategories from authenticated users"
on public.organization_course_subcategories
for insert
with check (
  auth.uid() in (
    select user_id
    from public.organization_users
    where organization_id = organization_course_subcategories.organization_id
  )
);

-- organization_courses
create policy "allow insert on organization courses from authenticated users"
on organization_courses
for insert
with check (
  organization_id = (auth.jwt() ->> 'organization_id')::uuid
);

-- organization_coupons
create policy "allow insert on organization coupons from authenticated users"
on organization_coupons
for insert
with check (
  organization_id = (auth.jwt() ->> 'organization_id')::uuid
);

-- organization_coupon_courses
create policy "allow insert on organization coupon courses from authenticated users"
on organization_coupon_courses
for insert
with check (
  exists (
    select 1
    from organization_coupons c
    where c.coupon_id = organization_coupon_courses.coupon_id
      and c.organization_id = (auth.jwt() ->> 'organization_id')::uuid
  )
);