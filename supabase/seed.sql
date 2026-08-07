insert into tenants (id, name, slug, status)
values
  ('11111111-1111-4111-8111-111111111111', 'Acme Product Studio', 'acme-product-studio', 'active'),
  ('22222222-2222-4222-8222-222222222222', 'Northstar Operations', 'northstar-operations', 'active')
on conflict (id) do nothing;

insert into projects (id, tenant_id, name, description, status)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '11111111-1111-4111-8111-111111111111',
    'Acme Customer Portal',
    'A client-facing portal for onboarding, account management, and renewal visibility.',
    'in_progress'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '22222222-2222-4222-8222-222222222222',
    'Northstar Dispatch Console',
    'An internal operations console for scheduling, incident notes, and customer follow-up.',
    'planning'
  )
on conflict (id) do nothing;

insert into phases (project_id, tenant_id, title, description, order_index, status)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'Discovery', 'Requirements, risk map, and portal information architecture.', 1, 'done'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'Build', 'Tenant-scoped dashboard, vault, and billing tracker.', 2, 'in_progress'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'Launch', 'Production hardening and handoff.', 3, 'not_started'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '22222222-2222-4222-8222-222222222222', 'Planning', 'Workflow mapping and admin permissions design.', 1, 'in_progress')
on conflict (project_id, order_index) do nothing;

insert into subscriptions (tenant_id, vendor, plan, amount_cents, cadence, renews_on, status, notes)
values
  ('11111111-1111-4111-8111-111111111111', 'Vercel', 'Pro', 2000, 'monthly', current_date + 12, 'active', 'Frontend hosting'),
  ('11111111-1111-4111-8111-111111111111', 'Supabase', 'Pro', 2500, 'monthly', current_date + 20, 'active', 'Database, auth, and storage'),
  ('22222222-2222-4222-8222-222222222222', 'Linear', 'Business', 4900, 'annual', current_date + 45, 'active', 'Project tracking');
