-- table
create table public.currencies (
    currency_code text primary key,

    currency_symbol text,
    currency_name text not null,

    display_order int default 0,

    is_active boolean default true,
    
    created_at timestamptz,
    updated_at timestamptz
);

-- triggers
create trigger trigger_insert_currency
before insert on currencies
for each row
execute function public.set_insert_date_triggers();

create trigger trigger_update_currency
before update on currencies
for each row
execute function public.set_update_date_triggers();