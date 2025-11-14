-- enable row level security
alter table public.continents enable row level security;
alter table public.subregions enable row level security;
alter table public.countries enable row level security;
alter table public.languages enable row level security;
alter table public.country_languages enable row level security;
alter table public.currencies enable row level security;
alter table public.country_currencies enable row level security;
alter table public.organization_types enable row level security;
alter table public.organization_categories enable row level security;