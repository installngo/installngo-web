-- enable row level security
alter table public.code_master enable row level security;
alter table public.subcode_master enable row level security;

-- allow read-only access to authenticated users
create policy "allow authenticated users to read code master"
on public.code_master
for select
to authenticated
using (is_active = true);

-- block insert from authenticated users
create policy "block insert from authenticated users"
on public.code_master
for insert
to authenticated
with check (false);

-- block update from authenticated users
create policy "block update from authenticated users"
on public.code_master
for update
to authenticated
using (false);

-- block delete from authenticated users
create policy "block delete from authenticated users"
on public.code_master
for delete
to authenticated
using (false);

-- allow read-only access to authenticated users
create policy "allow authenticated users to read subcode master"
on public.subcode_master
for select
to authenticated
using (is_active = true);

-- block insert from authenticated users
create policy "block insert from authenticated users"
on public.subcode_master
for insert
to authenticated
with check (false);

-- block update from authenticated users
create policy "block update from authenticated users"
on public.subcode_master
for update
to authenticated
using (false);

-- block delete from authenticated users
create policy "block delete from authenticated users"
on public.subcode_master
for delete
to authenticated
using (false);