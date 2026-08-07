# Client Portal - Project Overview

## 🎯 Product Vision

A professional, secure web portal enabling custom software companies to:
- **Empower Clients**: Real-time visibility into project progress, budgets, and payment status
- **Streamline Admin**: Central hub for managing projects, payments, milestones, and client communications
- **Build Trust**: Transparent communication with professional, data-driven dashboards

---

## 📊 Core Features

### Client Dashboard (Authenticated Users with `role = 'client'`)

**Homepage**: `/client`

Dashboard displays:
- **Summary Cards**: Active projects count, total budget, amount spent, pending payments
- **Budget Breakdown Chart**: Visual pie chart showing budget vs. actual spend
- **Project Status Tracker**: Progress bars for each project
- **Projects Table**: Full project list with status, budget, and timeline
- **Upcoming Milestones**: Next 5 milestones across all projects
- **Recent Updates**: Latest 5 updates from the team

**Data Visible to Clients**:
- Only their own projects
- Only milestones linked to their projects
- Only payments for their projects
- Only updates for their projects

---

### Admin Dashboard (Authenticated Users with `role = 'admin'`)

**Homepage**: `/admin`

Dashboard displays:
- **Summary Cards**: Active clients, active projects, total revenue, amount spent
- **Tabs**: Overview → Clients → Projects → Payments

#### Overview Tab
- **Revenue vs Spending Chart**: 7-day trend line chart
- **Financial Summary**: Total revenue, total spent, net profit, profit margin

#### Clients Tab
- **Client List Table**: Company name, contact email, status, actions
- **New Client Button**: Add new client (modal form)

#### Projects Tab
- **Projects Table**: Name, status, budget, spent amount, margin percentage
- **New Project Button**: Create new project (modal form)

#### Payments Tab
- **Payment Management**: Coming soon (scaffold prepared)

---

## 🔐 Authentication & Security

### Login Flow
```
User → /auth/login → Enters credentials → Supabase Auth
              ↓
         Validates credentials
              ↓
         ✅ Success → Check user role in `users` table
              ↓
         Admin → /admin | Client → /client
```

### Authorization (Row Level Security - RLS)
All database tables have RLS policies:
- **Clients**: Can only see their own data
- **Admins**: Can see all data
- **Projects/Milestones/Payments**: Access based on client ownership
- **Updates**: Authors can edit own updates, admins edit all

---

## 📁 Project Structure

```
📦 Client Portal
├── 📄 package.json                   # Dependencies & scripts
├── 📄 tsconfig.json                  # TypeScript config
├── 📄 tailwind.config.ts            # Tailwind CSS config
├── 📄 next.config.js                # Next.js config
├── 📄 postcss.config.js             # PostCSS config
├── 📄 database.sql                  # Database schema & RLS
├── 📄 .env.example                  # Environment variables template
├── 📄 README.md                     # Full documentation
├── 📄 SETUP.md                      # Quick start guide
├── 📄 DEVELOPMENT.md                # Development checklist
├── 📄 API.md                        # API documentation
├── 📄 env.d.ts                      # TypeScript env types
│
├── 📁 app                           # Next.js App Router
│   ├── 📁 auth
│   │   ├── 📁 login
│   │   │   └── 📄 page.tsx          # Login page
│   │   └── 📄 layout.tsx
│   ├── 📁 (protected)               # Protected route group
│   │   ├── 📁 client
│   │   │   └── 📄 page.tsx          # Client dashboard
│   │   ├── 📁 admin
│   │   │   └── 📄 page.tsx          # Admin dashboard
│   │   └── 📄 layout.tsx            # Auth wrapper layout
│   ├── 📄 page.tsx                  # Root redirect
│   ├── 📄 layout.tsx                # Root layout
│   └── 📄 globals.css               # Global styles
│
├── 📁 lib                           # Utilities & helpers
│   ├── 📄 supabase.ts              # Supabase client & types
│   └── 📄 hooks.ts                 # Custom React hooks
│
├── 📁 components                    # Reusable components
│   ├── 📁 ui
│   │   ├── 📄 card.tsx             # Card component
│   │   ├── 📄 button.tsx           # Button component
│   │   └── 📄 input.tsx            # Input component
│   ├── 📁 admin                    # Admin-specific components
│   ├── 📁 client                   # Client-specific components
│   └── 📄 navbar.tsx               # Navigation bar

└── 📁 public                       # Static assets
```

---

## 🗄️ Database Schema

### Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | User accounts with roles | id, email, role (admin/client), full_name |
| `clients` | Company information | id, user_id, company_name, contact_email, phone, status |
| `projects` | Projects with financials | id, client_id, name, status, budget, spent, start_date, end_date |
| `milestones` | Project milestones | id, project_id, title, status, due_date |
| `payments` | Payment schedules | id, project_id, amount, type, status, due_date, paid_date |
| `recurring_costs` | Ongoing costs | id, project_id, name, amount, frequency, active |
| `updates` | Project updates | id, project_id, title, content, created_by, created_at |

### Status Types

**Project Status**: `planning`, `in_progress`, `completed`, `on_hold`
**Milestone Status**: `pending`, `in_progress`, `completed`
**Payment Status**: `pending`, `paid`, `overdue`
**Payment Type**: `upfront`, `milestone`, `final`
**Client Status**: `active`, `inactive`, `archived`
**Recurring Frequency**: `monthly`, `quarterly`, `yearly`

---

## 🚀 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 13+ | React framework with App Router |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **UI Components** | shadcn/ui | Pre-built accessible components |
| **Charts** | Recharts | Data visualization |
| **Backend** | Supabase | PostgreSQL database + Auth |
| **Auth** | Supabase Auth | Email/password authentication |
| **Database** | PostgreSQL | Relational database |
| **Security** | Row Level Security (RLS) | Data access policies |

---

## 🔄 Data Flow

### Client Viewing Dashboard
```
1. User logs in with email/password
2. Supabase Auth validates credentials
3. User data fetched from `users` table
4. Role = 'client' → Redirect to /client
5. Client dashboard fetches:
   - Client record from `clients` table (user_id = current user)
   - Projects from `projects` table (client_id = user's client_id)
   - Milestones, payments, updates filtered by projects
6. Dashboard renders with client-only data (RLS enforced)
```

### Admin Creating Project
```
1. Admin clicks "New Project" button
2. Modal form appears
3. Admin submits form with client + project details
4. API call to POST /api/projects (ready for implementation)
5. New project inserted into `projects` table
6. RLS ensures only admins can insert
7. Success notification
8. Projects list refreshes
```

---

## 🎨 User Experience

### Design Principles
- **Clean & Professional**: Light color palette with blue accent
- **Data-Driven**: Charts and metrics for informed decisions
- **Mobile-Responsive**: Works on desktop, tablet, mobile
- **Accessibility**: WCAG compliant semantic HTML
- **Fast**: Optimized images, code splitting, lazy loading

### Color Scheme
- **Primary**: Blue (#3b82f6) - Actions, links, highlights
- **Success**: Green (#10b981) - Completed items, profit
- **Warning**: Yellow (#f59e0b) - Pending, on_hold
- **Error**: Red (#ef4444) - Overdue, issues
- **Neutral**: Gray (#6b7280) - Secondary text, borders

---

## 🔒 Security Features

### Authentication
✅ Email/password authentication via Supabase
✅ Secure session management
✅ Automatic logout on session expiry
✅ Protected routes (redirect to login if unauthorized)

### Authorization
✅ Role-based access control (client vs admin)
✅ Row Level Security (RLS) on all tables
✅ Users can only access their own data (clients)
✅ Admins have full access

### Data Protection
✅ HTTPS in production (automatic with Vercel)
✅ No sensitive data in client-side code
✅ Environment variables for credentials
✅ SQL injection prevention (Supabase handles)
✅ XSS protection with Next.js defaults

---

## 📈 Future Enhancements

### Phase 2 - Core Functionality
- [ ] Create/edit modals for all entities
- [ ] File uploads for projects/updates
- [ ] Email notifications
- [ ] User profile pages
- [ ] Admin settings panel

### Phase 3 - Advanced Features
- [ ] Time tracking integration
- [ ] Document management
- [ ] Automated reports & exports
- [ ] Slack/email integration
- [ ] Mobile app (React Native)

### Phase 4 - Analytics
- [ ] Advanced financial reports
- [ ] Project profitability analysis
- [ ] Client lifetime value tracking
- [ ] Predictive analytics
- [ ] Custom report builder

---

## 🚢 Deployment

### Vercel (Recommended for Next.js)
1. Push to GitHub repository
2. Connect to Vercel
3. Import project
4. Set environment variables
5. Deploy with one click

### Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

### Self-Hosted
1. Build: `npm run build`
2. Deploy: `npm start`
3. Ensure Node.js 18+ on server

---

## 📞 Support & Maintenance

### Common Issues
See `DEVELOPMENT.md` for troubleshooting guide

### Documentation
- `README.md` - Full project documentation
- `SETUP.md` - Quick start guide
- `API.md` - API endpoint reference
- `DEVELOPMENT.md` - Development checklist

### Performance Optimization
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Database query optimization with indexes
- CDN for static assets

---

## 📋 Getting Started

1. **Clone & Setup**: See `SETUP.md`
2. **Configure Database**: Follow SQL schema in `database.sql`
3. **Create Test Users**: Follow authentication setup steps
4. **Run Locally**: `npm run dev`
5. **Start Building**: Implement additional features

---

**Created**: July 9, 2026
**Current Version**: 0.1.0
**Status**: Scaffold complete, ready for feature development
