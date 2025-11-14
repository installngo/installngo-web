-- Enable the Row Level Security
alter table public.organizations enable row level security;
alter table public.organization_users enable row level security;
alter table public.organization_menus enable row level security;
alter table public.organization_course_categories enable row level security;
alter table public.organization_course_subcategories enable row level security;
alter table organization_courses enable row level security;
alter table organization_coupons enable row level security;
alter table organization_coupon_courses enable row level security;

-- RLS Policy for CRUD operation on Organization table
create policy "Org users can manage their organization"
on public.organizations
for all
using (
  exists (
    select 1 from public.organization_users ou
    where ou.organization_id = organizations.organization_id
    and ou.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.organization_users ou
    where ou.organization_id = organizations.organization_id
    and ou.user_id = (select auth.uid())
  )
);