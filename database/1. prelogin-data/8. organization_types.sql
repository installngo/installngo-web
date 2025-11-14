create table public.organization_types (
  organization_type_code text primary key,
  country_code text references countries(country_code) on delete cascade,

  type_name text not null,
  type_description text,

  display_order int default 0,

  is_active boolean default true,

  created_at timestamptz,
  updated_at timestamptz
);

-- Triggers
create trigger trigger_insert_organization_type
before insert on organization_types
for each row
execute function public.set_insert_date_triggers();

create trigger trigger_update_organization_type
before update on organization_types
for each row
execute function public.set_update_date_triggers();