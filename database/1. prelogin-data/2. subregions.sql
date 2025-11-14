-- table
create table public.subregions (
    subregion_code text primary key,
    continent_code text references public.continents(continent_code) on delete cascade,

    subregion_name text not null,    
    subregion_description text,

    display_order int default 0,
    
    is_active boolean default true,

    created_at timestamptz,
    updated_at timestamptz
);

-- triggers
create trigger trigger_insert_subregion
before insert on subregions
for each row
execute function public.set_insert_date_triggers();

create trigger trigger_update_subregion
before update on subregions
for each row
execute function public.set_update_date_triggers();