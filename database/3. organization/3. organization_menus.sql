-- Table
create table public.organization_menus (
  menu_id uuid primary key default gen_random_uuid(),
  menu_parent_id uuid references public.organization_menus(menu_id) on delete cascade,

  organization_type_code text not null,
  organization_category_code text not null,

  allowed_roles text[] default null,

  route_name text not null,
  path_name text not null unique,

  menu_order int default 0,
  
  is_premium boolean default false,  
  menu_status_code text not null default 'ACTIVE',

  created_at timestamptz,
  updated_at timestamptz
);

-- Insert trigger
create trigger trigger_insert_organization_menu
before insert on organization_menus
for each row
execute function public.set_insert_date_triggers();

-- Update trigger
create trigger trigger_update_organization_menu
before update on organization_menus
for each row
execute function public.set_update_date_triggers();