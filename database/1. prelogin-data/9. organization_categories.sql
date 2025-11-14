-- table
create table public.organization_categories (
  organization_category_code text primary key,
  organization_type_code text references public.organization_types(organization_type_code) on delete cascade,

  category_name text not null,
  category_description text,

  display_order int default 0,

  is_active boolean default true,

  created_at timestamptz,
  updated_at timestamptz
);

-- triggers
create trigger trigger_insert_organization_category
before insert on organization_categories
for each row
execute function public.set_insert_date_triggers();

create trigger trigger_update_organization_category
before update on organization_categories
for each row
execute function public.set_update_date_triggers();