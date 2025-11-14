-- Main Coupon Courses table
create table organization_coupon_courses (
  coupon_course_id uuid primary key default gen_random_uuid(),
  coupon_id uuid references organization_coupons(coupon_id) on delete cascade,
  course_id uuid references organization_courses(course_id) on delete cascade,

  created_at timestamptz,
  updated_at timestamptz
);

-- Avoid duplicates
create unique index idx_coupon_course_unique on organization_coupon_courses (coupon_id, course_id);

-- Indexes for filtering
create index idx_coupon_courses_coupon on organization_coupon_courses (coupon_id);
create index idx_coupon_courses_course on organization_coupon_courses (course_id);

-- Insert trigger
create trigger trigger_insert_organization_coupon_course
before insert on organization_coupon_courses
for each row
execute function set_insert_date_triggers();

-- Update trigger
create trigger trigger_update_organization_coupon_course
before update on organization_coupon_courses
for each row
execute function set_update_date_triggers();