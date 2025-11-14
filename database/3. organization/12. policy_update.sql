-- block update from authenticated users

-- organization_menus
create policy "block update on organization menus from authenticated users"
on public.organization_menus
for update
to authenticated
using (false);

-- organization_categories
create policy "allow update on organization categories from authenticated users"
on public.organization_course_categories
for update
using (
  auth.uid() in (
    select user_id
    from public.organization_users
    where organization_id = organization_course_categories.organization_id
  )
)
with check (
  auth.uid() in (
    select user_id
    from public.organization_users
    where organization_id = organization_course_categories.organization_id
  )
);

-- organization_subcategories
create policy "allow update on organization subcategories from authenticated users"
on public.organization_course_subcategories
for update
using (
  auth.uid() in (
    select user_id
    from public.organization_users
    where organization_id = organization_course_subcategories.organization_id
  )
)
with check (
  auth.uid() in (
    select user_id
    from public.organization_users
    where organization_id = organization_course_subcategories.organization_id
  )
);

-- organization_courses
create policy "allow update on organization courses from authenticated users"
on organization_courses
for update
using (
  organization_id = (auth.jwt() ->> 'organization_id')::uuid
)
with check (
  organization_id = (auth.jwt() ->> 'organization_id')::uuid
);

-- organization_coupons
create policy "allow update on organization coupons from authenticated users"
on organization_coupons
for update
using (
  organization_id = (auth.jwt() ->> 'organization_id')::uuid
)
with check (
  organization_id = (auth.jwt() ->> 'organization_id')::uuid
);

-- organization_coupon_courses
create policy "allow update on organization coupon courses from authenticated users"
on organization_coupon_courses
for update
using (
  exists (
    select 1
    from organization_coupons c
    where c.coupon_id = organization_coupon_courses.coupon_id
      and c.organization_id = (auth.jwt() ->> 'organization_id')::uuid
  )
)
with check (
  exists (
    select 1
    from organization_coupons c
    join organization_courses co on co.course_id = organization_coupon_courses.course_id
    where c.coupon_id = organization_coupon_courses.coupon_id
      and c.organization_id = (auth.jwt() ->> 'organization_id')::uuid
      and co.organization_id = (auth.jwt() ->> 'organization_id')::uuid
  )
);