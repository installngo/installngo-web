-- table
create table public.continents (
    continent_code text primary key,
    continent_code_iso text unique,
    continent_abbrevation text,

    continent_name text not null,
    continent_description text,
    
    display_order int default 0,
    
    is_active boolean default true,

    created_at timestamptz,
    updated_at timestamptz
);

-- triggers
create trigger trigger_insert_continent
before insert on continents
for each row
execute function public.set_insert_date_triggers();

create trigger trigger_update_continent
before update on continents
for each row
execute function public.set_update_date_triggers();