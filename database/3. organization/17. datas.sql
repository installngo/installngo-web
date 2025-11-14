-- Main Menus
insert into public.organization_menus 
  (organization_type_code, organization_category_code, allowed_roles, route_name, path_name, menu_order)
values
 ('ACADEMY', 'COACHING', '{ADMIN}', 'Dashboard', '/dashboard', 1),
 ('ACADEMY', 'COACHING', '{ADMIN}', 'Courses', '/courses', 2);

-- Sub Menus for "Courses"
insert into public.organization_menus 
  (menu_parent_id, organization_type_code, organization_category_code, route_name, path_name, menu_order)
values
  (
    (select menu_id from public.organization_menus where path_name = '/courses'),
    'ACADEMY', 'FASHION', 'My Courses', '/courses/my-courses', 1
  ),
  (
    (select menu_id from public.organization_menus where path_name = '/courses'),
    'ACADEMY', 'FASHION', 'My Coupons', '/courses/my-coupons', 2
  );


-- organization course categories sample data
insert into organization_course_categories
  (organization_id, category_code, display_name, display_order, is_default, is_active)
values
  ('ae9212f6-ce79-4ddf-8297-27c213995584', 'PROGRAMMING', 'Programming', 1, true, true),
  ('ae9212f6-ce79-4ddf-8297-27c213995584', 'DESIGN', 'Design & UI', 2, false, true),
  ('ae9212f6-ce79-4ddf-8297-27c213995584', 'MARKETING', 'Marketing', 3, false, true);

-- organization course subcategories sample data
  insert into organization_course_subcategories
  (organization_id, category_code, subcategory_code, display_name, display_order, is_default, is_active)
values
  ('ae9212f6-ce79-4ddf-8297-27c213995584', 'PROGRAMMING', 'JAVASCRIPT', 'JavaScript', 1, true, true),
  ('ae9212f6-ce79-4ddf-8297-27c213995584', 'PROGRAMMING', 'PYTHON', 'Python', 2, false, true),
  ('ae9212f6-ce79-4ddf-8297-27c213995584', 'PROGRAMMING', 'REACT', 'ReactJS', 3, false, true),
  ('ae9212f6-ce79-4ddf-8297-27c213995584', 'DESIGN', 'UIUX', 'UI/UX Design', 1, true, true),
  ('ae9212f6-ce79-4ddf-8297-27c213995584', 'DESIGN', 'GRAPHICS', 'Graphic Design', 2, false, true),
  ('ae9212f6-ce79-4ddf-8297-27c213995584', 'MARKETING', 'SEO', 'Search Engine Optimization', 1, false, true),
  ('ae9212f6-ce79-4ddf-8297-27c213995584', 'MARKETING', 'CONTENT', 'Content Marketing', 2, false, true);


--Sample Data
insert into organization_coupons (
  organization_id, coupon_title, coupon_code, discount_type_code, fixed_discount_value, percentage_discount_value, is_lifetime, start_date, end_date, max_uses, per_user_limit, used_count, is_public, is_visible, is_active) 
values
('ae9212f6-ce79-4ddf-8297-27c213995584', 'New Year Discount', 'NY2025', 'FIXED', 50, null, false, '2025-01-01T00:00:00Z', '2025-12-31T23:59:59Z', 100, 1, 0, true, true, true),
('ae9212f6-ce79-4ddf-8297-27c213995584', 'Summer Sale', 'SUMMER25', 'PERCENTAGE', null, 25, false, '2025-06-01T00:00:00Z', '2025-08-31T23:59:59Z', 200, 2, 0, true, true, true),
('ae9212f6-ce79-4ddf-8297-27c213995584', 'Lifetime Offer', 'LIFETIME', 'FIXED', 100, null, true, null, null, null, null, 0, true, true, true);