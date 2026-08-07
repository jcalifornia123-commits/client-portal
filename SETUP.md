# Setup Guide - Client Portal

## Quick Start (5 minutes)

### Step 1: Get Supabase Credentials

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project or select existing
3. Go to **Settings → API**
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Create Environment File

Create `.env.local` in project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Initialize Database

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy entire contents of `database.sql` from project root
4. Paste into SQL editor
5. Click **Run**

✅ Database schema created with all tables and Row Level Security policies!

### Step 4: Install & Run

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Create Test Users

### Admin Account

1. In Supabase Auth, create user:
   - Email: `admin@example.com`
   - Password: `TestPassword123!`

2. In the `users` table, create manual entry:
   - `id`: (auto)
   - `email`: `admin@example.com`
   - `full_name`: `Admin User`
   - `role`: `admin` ✅

3. Log in with `admin@example.com`
4. Access admin dashboard at `/admin`

### Client Account

1. In Supabase Auth, create user:
   - Email: `client@example.com`
   - Password: `TestPassword123!`

2. In the `users` table, add entry:
   - `id`: (auto)
   - `email`: `client@example.com`
   - `full_name`: `Acme Corp`
   - `role`: `client` ✅

3. In the `clients` table, add entry:
   - `user_id`: (ID from users table)
   - `company_name`: `Acme Corporation`
   - `contact_email`: `contact@acme.com`
   - `status`: `active`

4. Log in with `client@example.com`
5. Access client dashboard at `/client`

---

## Testing the Full Flow

### As Admin:

1. Create a new project
2. Create milestones
3. Create payments
4. Publish updates

### As Client:

1. View projects and budget
2. Track milestones
3. Review payments
4. Read updates

---

## Troubleshooting

### "Cannot read property 'from' of undefined"
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart dev server after updating `.env.local`

### "Invalid login credentials"
- Verify user created in Supabase Auth
- Check `users` table has matching entry with correct role

### "Permission denied" on queries
- Verify RLS policies in `database.sql` ran successfully
- Check user role in `users` table
- Ensure user is authenticated

### "Cannot find module '@/lib/supabase'"
- Run `npm install`
- Verify `tsconfig.json` has path aliases set up

---

## Next: Implement Features

See README.md for feature implementation roadmap.
