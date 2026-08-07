# Client Portal

A professional web portal for custom software companies to manage client projects, track progress, handle payments, and share updates.

## Features

### Client Features
- **Dashboard**: Overview of all projects with status and budget tracking
- **Project Progress**: Real-time project status, milestones, and timeline visualization
- **Payment Tracking**: View payment schedule, payment status, and recurring costs
- **Recent Updates**: Stay informed with project updates from your team
- **Budget Monitoring**: Track project spending against budget with visual indicators

### Admin Features
- **Client Management**: Create and manage client accounts and companies
- **Project Management**: Create projects, assign to clients, track budget and spending
- **Milestone Tracking**: Define project milestones and track completion
- **Payment Management**: Create payment schedules, track payment status
- **Updates Publishing**: Share project updates with clients
- **Financial Dashboard**: Monitor overall revenue, spending, and profitability
- **Charts & Analytics**: Visual insights into project and financial performance

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React (ready to integrate)

## Project Structure

```
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx           # Login page
│   │   └── layout.tsx
│   ├── (protected)/
│   │   ├── client/
│   │   │   └── page.tsx           # Client dashboard
│   │   ├── admin/
│   │   │   └── page.tsx           # Admin dashboard
│   │   └── layout.tsx             # Protected route wrapper
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Root redirect
│   └── globals.css                # Global styles
├── lib/
│   ├── supabase.ts               # Supabase client & types
│   └── hooks.ts                  # Custom React hooks
├── components/
│   ├── admin/                    # Admin-specific components
│   └── client/                   # Client-specific components
├── database.sql                  # Database schema & RLS policies
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## Getting Started

### 1. Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### 2. Environment Setup

Create a `.env.local` file based on `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these from your [Supabase project settings](https://app.supabase.com).

### 3. Database Setup

1. In your Supabase dashboard, go to SQL Editor
2. Create a new query and paste the contents of `database.sql`
3. Run the query to create all tables, indexes, and RLS policies

### 4. Install Dependencies

```bash
npm install
# or
yarn install
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create Test Users

In Supabase, create test accounts:

1. **Admin Account**: Email: `admin@example.com`, Password: any secure password
2. **Client Account**: Email: `client@example.com`, Password: any secure password

Then in the `users` table, set:
- Admin: `role = 'admin'`
- Client: `role = 'client'`

## Database Schema

### Tables

- **users**: User accounts with roles
- **clients**: Client/company information
- **projects**: Projects with budget tracking
- **milestones**: Project milestones
- **payments**: Payment schedules and tracking
- **recurring_costs**: Ongoing costs for projects
- **updates**: Status updates for clients

All data access is protected with Row Level Security (RLS) policies ensuring:
- Clients only see their own data
- Admins see all client data
- Authors can edit their own updates

## API Routes (Future Expansion)

The following API routes are ready for implementation:

```
/api/clients         - Manage clients
/api/projects        - Manage projects
/api/milestones      - Manage milestones
/api/payments        - Manage payments
/api/recurring-costs - Manage recurring costs
/api/updates         - Manage updates
```

## Authentication Flow

1. User navigates to `/auth/login`
2. Enters credentials
3. Upon successful login, user is redirected to:
   - `/admin` if role is `admin`
   - `/client` if role is `client`
4. Protected routes use `(protected)` layout group which enforces authentication
5. Unauthenticated users are redirected to login

## Styling & UI

- **Tailwind CSS** for utility-first styling
- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Mode Ready**: Can be extended with Tailwind's dark mode
- **shadcn/ui Components**: For consistent, accessible UI elements
- **Professional Color Scheme**: Blue for primary actions, intuitive grays and accent colors

## Development Workflow

1. **Feature Development**: Create feature branches
2. **Component Creation**: Add reusable components in `/components`
3. **Testing**: Test authentication flows and RLS policies
4. **Deployment**: Build with `npm run build`, deploy to Vercel or your hosting

## Next Steps

### High Priority
- [ ] Implement create/edit modals for clients and projects
- [ ] Add payment status update functionality
- [ ] Create update publishing interface
- [ ] Add user profile/settings page
- [ ] Implement logout functionality throughout app

### Medium Priority
- [ ] Add email notifications for updates and payments
- [ ] Implement project document uploads
- [ ] Add milestone tracking dashboard
- [ ] Create financial reports and exports
- [ ] Add search and filtering across dashboards

### Future Enhancements
- [ ] Mobile app (React Native)
- [ ] Client invitation system
- [ ] Project templates
- [ ] Integrations (Slack, email, etc.)
- [ ] Advanced analytics and reporting
- [ ] Time tracking integration
- [ ] File attachment system

## Troubleshooting

### "Invalid login credentials"
- Ensure user exists in `users` table
- Check email is correctly set
- Verify password is correct

### "Session expired"
- User session expired, sign in again
- Check `NEXT_PUBLIC_SUPABASE_KEY` is correct

### "Permission denied" errors
- Verify RLS policies are applied correctly
- Check `users` table has correct role for user
- Ensure user is authenticated before accessing protected routes

## Support

For issues or questions, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is proprietary software for custom software companies.
