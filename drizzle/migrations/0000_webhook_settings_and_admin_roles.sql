-- Roles ------------------------------------------------------------------
do $$ begin
  create type public.app_role as enum ('admin','moderator','user');
exception when duplicate_object then null; end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

drop policy if exists "Users can read their own roles" on public.user_roles;
create policy "Users can read their own roles"
on public.user_roles for select to authenticated
using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Webhook settings ---------------------------------------------------------
create table if not exists public.webhook_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  url text not null,
  method text not null default 'POST' check (method in ('GET','POST')),
  enabled boolean not null default true,
  notes text,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

grant select on public.webhook_settings to anon;
grant select on public.webhook_settings to authenticated;
grant insert, update, delete on public.webhook_settings to authenticated;
grant all on public.webhook_settings to service_role;

alter table public.webhook_settings enable row level security;

drop policy if exists "Anyone can read webhook settings" on public.webhook_settings;
create policy "Anyone can read webhook settings"
on public.webhook_settings for select to anon, authenticated using (true);

drop policy if exists "Admins can insert webhook settings" on public.webhook_settings;
create policy "Admins can insert webhook settings"
on public.webhook_settings for insert to authenticated
with check (public.has_role(auth.uid(),'admin'));

drop policy if exists "Admins can update webhook settings" on public.webhook_settings;
create policy "Admins can update webhook settings"
on public.webhook_settings for update to authenticated
using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

drop policy if exists "Admins can delete webhook settings" on public.webhook_settings;
create policy "Admins can delete webhook settings"
on public.webhook_settings for delete to authenticated
using (public.has_role(auth.uid(),'admin'));

create or replace function public.touch_webhook_settings()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists webhook_settings_touch on public.webhook_settings;
create trigger webhook_settings_touch before update on public.webhook_settings
for each row execute function public.touch_webhook_settings();

insert into public.webhook_settings (key, label, url, method, notes) values
  ('newsletter','Newsletter subscribe / unsubscribe','https://wewefom.app.n8n.cloud/webhook/QuantumAILabNewsletter','GET','Used by the newsletter and unsubscribe forms'),
  ('contact','Contact us form','https://wewefom.app.n8n.cloud/webhook/QuantumAILab-contact-us','POST','Used by the contact page'),
  ('chat','AI chat assistant','https://wewefom.app.n8n.cloud/webhook/chat-assistant','GET','Called server-side by the chat function'),
  ('feedback','Feedback form','https://xacade.app.n8n.cloud/webhook/feedback','POST','Called server-side by the feedback function'),
  ('feedback_fallback_form','Feedback fallback form link','https://xacade.app.n8n.cloud/form/cfcf4fd4-dba8-417c-ba04-19438a58409a','GET','Shown when the feedback form cannot submit')
on conflict (key) do nothing;