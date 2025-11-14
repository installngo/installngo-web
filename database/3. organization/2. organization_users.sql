create table public.organization_users (
  organization_id uuid references public.organizations(organization_id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,

  user_role text default 'ADMIN',
  is_primary boolean default false,

  created_at timestamptz,
  updated_at timestamptz,

  primary key (organization_id, user_id)
);

-- Insert trigger
create trigger trigger_insert_organization_user
before insert on organization_users
for each row
execute function public.set_insert_date_triggers();

-- Update trigger
create trigger trigger_update_organization_user
before update on organization_users
for each row
execute function public.set_update_date_triggers();