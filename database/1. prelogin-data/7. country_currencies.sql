-- table
create table public.country_currencies (
    country_code text references public.countries(country_code) on delete cascade,
    currency_code text references public.currencies(currency_code) on delete cascade,

    is_default boolean default false,   

    display_order int default 0,

    is_active boolean default true,
    
    created_at timestamptz,
    updated_at timestamptz,

    primary key (country_code, currency_code)
);

-- triggers
create trigger trigger_insert_country_currency
before insert on country_currencies
for each row
execute function public.set_insert_date_triggers();

create trigger trigger_update_country_currency
before update on country_currencies
for each row
execute function public.set_update_date_triggers();