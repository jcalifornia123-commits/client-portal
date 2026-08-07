create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  tenant_id uuid references tenants(id) on delete restrict,
  role text not null check (role in ('admin', 'client')),
  full_name text,
  email text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_role_tenant_shape check (
    (role = 'admin' and tenant_id is null) or
    (role = 'client' and tenant_id is not null)
  )
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  description text not null default '',
  status text not null default 'planning' check (status in ('planning', 'in_progress', 'on_hold', 'delivered')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id)
);

create table if not exists phases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  title text not null,
  description text not null default '',
  order_index integer not null,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, order_index)
);

create table if not exists updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  author_user_id uuid not null references users(id) on delete restrict,
  body text not null,
  kind text not null default 'update' check (kind in ('update', 'milestone')),
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  folder text not null default '',
  storage_path text not null unique,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  uploaded_by_user_id uuid not null references users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  vendor text not null,
  plan text not null,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'usd',
  cadence text not null check (cadence in ('monthly', 'annual')),
  renews_on date not null,
  status text not null default 'active' check (status in ('active', 'canceled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete set null,
  actor_user_id uuid references users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists users_auth_user_id_idx on users(auth_user_id);
create index if not exists users_tenant_id_idx on users(tenant_id);
create index if not exists projects_tenant_id_idx on projects(tenant_id);
create index if not exists phases_tenant_id_idx on phases(tenant_id);
create index if not exists phases_project_order_idx on phases(project_id, order_index);
create index if not exists updates_tenant_created_idx on updates(tenant_id, created_at desc);
create index if not exists documents_tenant_folder_idx on documents(tenant_id, folder);
create index if not exists subscriptions_tenant_renews_idx on subscriptions(tenant_id, renews_on);
create index if not exists audit_log_tenant_created_idx on audit_log(tenant_id, created_at desc);

create trigger tenants_updated_at before update on tenants for each row execute function set_updated_at();
create trigger users_updated_at before update on users for each row execute function set_updated_at();
create trigger projects_updated_at before update on projects for each row execute function set_updated_at();
create trigger phases_updated_at before update on phases for each row execute function set_updated_at();
create trigger updates_updated_at before update on updates for each row execute function set_updated_at();
create trigger documents_updated_at before update on documents for each row execute function set_updated_at();
create trigger subscriptions_updated_at before update on subscriptions for each row execute function set_updated_at();

create or replace function app_current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from users where auth_user_id = auth.uid()
$$;

create or replace function app_current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select tenant_id from users where auth_user_id = auth.uid()
$$;

create or replace function app_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(app_current_user_role() = 'admin', false)
$$;

create or replace function app_can_access_tenant(target_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select app_is_admin() or app_current_tenant_id() = target_tenant_id
$$;

alter table tenants enable row level security;
alter table users enable row level security;
alter table projects enable row level security;
alter table phases enable row level security;
alter table updates enable row level security;
alter table documents enable row level security;
alter table subscriptions enable row level security;
alter table audit_log enable row level security;

create policy tenants_select on tenants for select using (app_is_admin() or id = app_current_tenant_id());
create policy tenants_admin_insert on tenants for insert with check (app_is_admin());
create policy tenants_admin_update on tenants for update using (app_is_admin()) with check (app_is_admin());

create policy users_select on users for select using (app_is_admin() or auth_user_id = auth.uid());
create policy users_admin_insert on users for insert with check (app_is_admin());
create policy users_admin_update on users for update using (app_is_admin()) with check (app_is_admin());

create policy projects_select on projects for select using (app_can_access_tenant(tenant_id));
create policy projects_admin_insert on projects for insert with check (app_is_admin());
create policy projects_admin_update on projects for update using (app_is_admin()) with check (app_is_admin());

create policy phases_select on phases for select using (app_can_access_tenant(tenant_id));
create policy phases_admin_insert on phases for insert with check (app_is_admin());
create policy phases_admin_update on phases for update using (app_is_admin()) with check (app_is_admin());

create policy updates_select on updates for select using (app_can_access_tenant(tenant_id));
create policy updates_admin_insert on updates for insert with check (app_is_admin());
create policy updates_admin_update on updates for update using (app_is_admin()) with check (app_is_admin());

create policy documents_select on documents for select using (app_can_access_tenant(tenant_id));
create policy documents_admin_insert on documents for insert with check (app_is_admin());
create policy documents_admin_update on documents for update using (app_is_admin()) with check (app_is_admin());

create policy subscriptions_select on subscriptions for select using (app_can_access_tenant(tenant_id));
create policy subscriptions_admin_insert on subscriptions for insert with check (app_is_admin());
create policy subscriptions_admin_update on subscriptions for update using (app_is_admin()) with check (app_is_admin());

create policy audit_log_admin_select on audit_log for select using (app_is_admin());
create policy audit_log_admin_insert on audit_log for insert with check (app_is_admin());

insert into storage.buckets (id, name, public)
values ('client-vault', 'client-vault', false)
on conflict (id) do update set public = false;

create policy client_vault_select on storage.objects
for select
using (
  bucket_id = 'client-vault'
  and (
    app_is_admin()
    or (storage.foldername(name))[1] = 'tenant_' || app_current_tenant_id()::text
  )
);

create policy client_vault_admin_insert on storage.objects
for insert
with check (
  bucket_id = 'client-vault'
  and app_is_admin()
);
