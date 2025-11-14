-- Main Courses table
create table organization_courses (
  course_id uuid primary key,
  organization_id uuid references organizations(organization_id) on delete cascade,

  course_code text not null unique,

  is_paid boolean default false,

  course_title text not null,
  course_description text,

  thumbnail_url text,

  category_code text not null,
  subcategory_code text,

  original_price numeric(10,2),
  discount_price numeric(10,2),
  effective_price numeric(10,2),

  validity_code text not null,
  single_validity_code text,

  expiry_date timestamptz,

  mark_new boolean default false,
  mark_featured boolean default false,
  has_offline_material boolean default false,

  status_code text default 'ACTIVE',

  created_at timestamptz,
  updated_at timestamptz
);

-- Indexes for faster lookups
create index idx_courses_org on organization_courses (organization_id);
create index idx_courses_category on organization_courses (category_code);
create index idx_courses_status on organization_courses (status_code);

-- Insert trigger
create trigger trigger_insert_organization_course
before insert on organization_courses
for each row
execute function set_insert_date_triggers();

-- Update trigger
create trigger trigger_update_organization_course
before update on organization_courses
for each row
execute function set_update_date_triggers();