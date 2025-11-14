-- languages
create table public.languages (
    language_code text primary key,

    language_name text not null,
    native_name text,

    display_order int default 0,

    is_active boolean default true,
    
    created_at timestamptz,
    updated_at timestamptz
);

-- triggers
create trigger trigger_insert_language
before insert on languages
for each row
execute function public.set_insert_date_triggers();

create trigger trigger_update_language
before update on languages
for each row
execute function public.set_update_date_triggers();