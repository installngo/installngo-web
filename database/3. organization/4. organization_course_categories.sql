-- Table
create table public.organization_course_categories (
  course_category_id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(organization_id) on delete cascade,

  category_code text not null,
  display_name text not null,

  display_order int default 0,

  is_default boolean default false,

  is_active boolean default true,

  created_at timestamptz,
  updated_at timestamptz,

  unique (organization_id, category_code)
);

-- Insert trigger
create trigger trigger_insert_organization_course_category
before insert on organization_course_categories
for each row
execute function public.set_insert_date_triggers();

-- Update trigger
create trigger trigger_update_organization_course_category
before update on organization_course_categories
for each row
execute function public.set_update_date_triggers();