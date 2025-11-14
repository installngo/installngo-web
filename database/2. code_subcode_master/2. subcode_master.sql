--Table
create table if not exists subcode_master (
  subcode_master_id uuid primary key default gen_random_uuid(),
  code_master_id uuid references code_master(code_master_id) on delete cascade,  
  
  subcode_code text not null,

  display_name text not null,

  is_default boolean,
  display_sequence int not null default 0,

  is_active boolean default true,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

--Insert Trigger
create trigger trigger_insert_subcode_master
before insert on subcode_master
for each row
execute function set_insert_date_triggers();

--Update Trigger
create trigger trigger_update_subcode_master
before update on subcode_master
for each row
execute function set_update_date_triggers();