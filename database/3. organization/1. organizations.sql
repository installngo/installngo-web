-- Table
create table public.organizations (
  organization_id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,

  organization_code text not null unique,
  full_name text not null,
  email_id text not null unique,

  type_code text not null,
  category_code text not null,

  country_code text not null,

  status_code text not null default 'ACTIVE',

  created_at timestamptz,
  updated_at timestamptz
);

-- Insert trigger
create trigger trigger_insert_organization
before insert on organizations
for each row
execute function public.set_insert_date_triggers();

-- Update trigger
create trigger trigger_update_organization
before update on organizations
for each row
execute function public.set_update_date_triggers();