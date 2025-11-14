create table code_master (
  code_master_id uuid primary key default gen_random_uuid(),

  code_type text not null,
  code_code text not null,

  display_name text not null,

  is_default boolean,
  display_sequence int not null default 0,

  is_active boolean default true,

  created_at timestamptz,
  updated_at timestamptz
);

-- Indexes for quick lookup
create index idx_code_master_type_code on code_master(code_type, code_code);

--Insert trigger
create trigger trigger_insert_code_master
before insert on code_master
for each row
execute function set_insert_date_triggers();

--Update trigger
create trigger trigger_update_code_master
before update on code_master
for each row
execute function set_update_date_triggers();