# Client Portal - Development Checklist

## Prerequisites ✅
- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] Supabase account created
- [ ] Git installed

## Initial Setup
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add Supabase credentials to `.env.local`

## Database Configuration
- [ ] Open Supabase dashboard
- [ ] Go to SQL Editor
- [ ] Create new query
- [ ] Paste `database.sql` contents
- [ ] Run the SQL query
- [ ] Verify all tables created in Table Editor:
  - [ ] `users`
  - [ ] `clients`
  - [ ] `projects`
  - [ ] `milestones`
  - [ ] `payments`
  - [ ] `recurring_costs`
  - [ ] `updates`

## Authentication Setup
- [ ] Enable Email/Password auth in Supabase
  - Go to Auth → Providers → Email
  - Ensure "Email Confirmed" is OFF (for testing)

## Create Test Users

### Admin User
- [ ] Email: `admin@example.com`
- [ ] Password: `TestPassword123!`
- [ ] Create in Supabase Auth
- [ ] Add to `users` table with `role = 'admin'`

### Client User  
- [ ] Email: `client@example.com`
- [ ] Password: `TestPassword123!`
- [ ] Create in Supabase Auth
- [ ] Add to `users` table with `role = 'client'`
- [ ] Create in `clients` table with matching `user_id`

## Development Workflow
- [ ] Start dev server: `npm run dev`
- [ ] Visit [http://localhost:3000](http://localhost:3000)
- [ ] Test login with admin account
- [ ] Test admin dashboard features
- [ ] Logout and test with client account
- [ ] Test client dashboard features

## Feature Testing

### Client Dashboard
- [ ] Projects display correctly
- [ ] Budget tracking displays
- [ ] Milestones show upcoming dates
- [ ] Recent updates display
- [ ] Charts render without errors

### Admin Dashboard
- [ ] Financial overview displays
- [ ] Charts render correctly
- [ ] Client list displays
- [ ] Project list displays
- [ ] Tab navigation works

### Authentication
- [ ] Login redirects to correct dashboard
- [ ] Logout works
- [ ] Protected routes redirect to login when unauthenticated
- [ ] Session persists across page refreshes

## Before Deployment
- [ ] Remove test users from production
- [ ] Set up proper environment variables
- [ ] Enable email confirmation (if needed)
- [ ] Test on production Supabase project
- [ ] Run `npm run build` successfully
- [ ] Test production build locally: `npm run start`

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for TypeScript errors
npx tsc --noEmit

# Format code (add prettier if needed)
npm run format
```

## Environment Variables

Ensure `.env.local` contains:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Useful Links

- [Supabase Dashboard](https://app.supabase.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Local Dev Server](http://localhost:3000)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 when accessing pages | Ensure app is running with `npm run dev` |
| Authentication errors | Check `.env.local` has correct Supabase URL/keys |
| Database errors | Verify `database.sql` was run successfully |
| Styling looks wrong | Clear `.next` folder and restart dev server |
| Cannot find module | Run `npm install` again |

---

**Last Updated**: July 9, 2026
