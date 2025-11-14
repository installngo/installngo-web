-- table
create table public.countries (
    country_code text primary key,
    continent_code text references public.continents(continent_code) on delete cascade,
    subregion_code text references public.subregions(subregion_code) on delete cascade,

    country_name text not null,
    native_name text,
    iso_alpha_3 text unique,

    numeric_code text,    
    time_zone text,

    phone_code text,
    phone_regex text,
    phone_format text,
    
    currency_name text,
    currency_symbol text,
    
    flag_url text,
    flag_emoji text,

    display_order int default 0,

    is_active boolean default true,
    
    created_at timestamptz,
    updated_at timestamptz
);

-- triggers
create trigger trigger_insert_country
before insert on countries
for each row
execute function public.set_insert_date_triggers();

create trigger trigger_update_country
before update on countries
for each row
execute function public.set_update_date_triggers();