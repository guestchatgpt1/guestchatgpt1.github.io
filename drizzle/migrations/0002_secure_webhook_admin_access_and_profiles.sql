-- Private admin profile data ---------------------------------------------
create table if not exists public.profiles (
  user_id uuid primary key,
  display_name text not null default '',
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles for select to authenticated using (user_id = auth.uid());

drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile"
on public.profiles for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.touch_profile()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
for each row execute function public.touch_profile();

-- Only the named administrator may claim the admin role. ------------------
create or replace function public.claim_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare uid uuid := auth.uid();
begin
  if uid is null or lower(coalesce(auth.jwt() ->> 'email', '')) <> 'quantumailab2@gmail.com' then
    return false;
  end if;
  insert into public.user_roles (user_id, role) values (uid, 'admin')
  on conflict do nothing;
  return public.has_role(uid, 'admin');
end $$;

-- Settings are server-side only; the public website must not read them. ----
revoke select on public.webhook_settings from anon;
drop policy if exists "Anyone can read webhook settings" on public.webhook_settings;
drop policy if exists "Admins can read webhook settings" on public.webhook_settings;
create policy "Admins can read webhook settings"
on public.webhook_settings for select to authenticated
using (public.has_role(auth.uid(), 'admin'));

revoke insert, update, delete on public.webhook_settings from anon;