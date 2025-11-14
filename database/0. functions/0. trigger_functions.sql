-- Insert function
create or replace function public.set_insert_date_triggers()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.created_at := now();
  new.updated_at := now();
  return new;
end;
$$;

-- Update function
create or replace function public.set_update_date_triggers()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;