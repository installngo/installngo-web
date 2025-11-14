-- Main Coupons table
create table organization_coupons (
  coupon_id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(organization_id) on delete cascade,

  coupon_title text not null,
  coupon_code text not null,

  discount_type_code text not null,
  fixed_discount_value numeric(10),
  percentage_discount_value numeric(3),

  is_lifetime boolean default false,

  start_date timestamptz,
  end_date timestamptz,

  max_uses int default null,

  per_user_limit int default null,

  used_count int not null default 0,  

  is_public boolean default true,
  is_visible boolean default true,
  is_active boolean default true,

  created_at timestamptz,
  updated_at timestamptz
);

-- Indexes for faster lookups
create index idx_coupons_org on organization_coupons (organization_id);

-- Insert trigger
create trigger trigger_insert_organization_coupon
before insert on organization_coupons
for each row
execute function set_insert_date_triggers();

-- Update trigger
create trigger trigger_update_organization_coupon
before update on organization_coupons
for each row
execute function set_update_date_triggers();