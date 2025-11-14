-- table
create table public.country_languages (
    country_code text references public.countries(country_code) on delete cascade,
    language_code text references public.languages(language_code) on delete cascade,
    
    is_official boolean default false,   

    display_order int default 0,

    is_active boolean default true,
    
    created_at timestamptz,
    updated_at timestamptz,
    
    primary key (country_code, language_code)
);

-- triggers
create trigger trigger_insert_country_language
before insert on public.country_languages
for each row
execute function public.set_insert_date_triggers();

create trigger trigger_update_country_language
before update on public.country_languages
for each row
execute function public.set_update_date_triggers();