-- block delete from authenticated users

-- organization_menus
create policy "block delete on organization menus from authenticated users"
on public.organization_menus
for delete
to authenticated
using (false);

-- organization_categories
create policy "allow delete on organization categories from authenticated users"
on public.organization_course_categories
for delete
using (
  auth.uid() in (
    select user_id
    from public.organization_users
    where organization_id = organization_course_categories.organization_id
  )
);

-- organization_subcategories
create policy "allow delete on organization subcategories from authenticated users"
on public.organization_course_subcategories
for delete
using (
  auth.uid() in (
    select user_id
    from public.organization_users
    where organization_id = organization_course_subcategories.organization_id
  )
);

-- organization_courses
create policy "allow delete on organization courses from authenticated users"
on organization_courses
for delete
using (
  organization_id = (auth.jwt() ->> 'organization_id')::uuid
  and auth.jwt() ->> 'role' = 'ADMIN'
);

-- organization_coupons
create policy "allow delete on organization coupons from authenticated users"
on organization_coupons
for delete
using (
  organization_id = (auth.jwt() ->> 'organization_id')::uuid
  and auth.jwt() ->> 'role' = 'ADMIN'
);

-- organization_coupon_courses
create policy "allow delete on organization coupon courses from authenticated users"
on organization_coupon_courses
for delete
using (
  exists (
    select 1
    from organization_coupons c
    where c.coupon_id = organization_coupon_courses.coupon_id
      and c.organization_id = (auth.jwt() ->> 'organization_id')::uuid
  )
);