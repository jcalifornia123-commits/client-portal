# 🚀 Getting Started - First 30 Minutes

## Welcome! 👋

Your professional client portal is ready. Follow this guide to see it running in your browser within 30 minutes.

---

## Step 1: Prerequisites Check (2 minutes)

Before starting, ensure you have:

- ✅ Node.js 18 or higher (`node --version`)
- ✅ npm or yarn (`npm --version`)
- ✅ Supabase account (free at [supabase.com](https://supabase.com))
- ✅ Terminal/Command prompt
- ✅ Text editor (VS Code recommended)

**Don't have Node.js?** Download from [nodejs.org](https://nodejs.org)

---

## Step 2: Get Supabase Credentials (5 minutes)

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create new project or select existing
3. Navigate to **Settings → API**
4. Copy these values:
   - `Project URL` → Save as `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` (under Project API keys) → Save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Keep these ready for the next step.

---

## Step 3: Configure Environment (3 minutes)

1. In your project folder, create a file named `.env.local`
2. Add these lines (replace with your values from Step 2):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_KEY_HERE
```

3. Save the file

✅ **Environment configured!**

---

## Step 4: Initialize Database (5 minutes)

1. Go back to Supabase dashboard
2. Click on **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of [database.sql](database.sql)
5. Paste into the Supabase SQL editor
6. Click **Run** (blue button)

Wait for success message...

✅ **Database created with all tables, indexes, and security policies!**

---

## Step 5: Create Test Users (5 minutes)

### Create Admin Account

1. In Supabase, go to **Auth → Users** (left sidebar)
2. Click **Invite** → Create new user with:
   - Email: `admin@example.com`
   - Password: `Test123!@` (any strong password)
   - Leave other fields empty
   - Click **Send invite** (or **Create user**)

3. Now add them to the users table:
   - Go to **SQL Editor** → **New Query**
   - Copy and modify the SQL query below (insert actual user ID):

```sql
INSERT INTO users (id, email, role, full_name) 
VALUES (
  'USER_ID_FROM_AUTH', 
  'admin@example.com',
  'admin',
  'Admin User'
);
```

4. Replace `USER_ID_FROM_AUTH` with the actual ID from auth and Run

### Create Client User

Repeat the process for client:
1. Create user: `client@example.com` with password
2. Insert into users table with `role = 'client'`
3. Create client record in `clients` table:

```sql
INSERT INTO clients (user_id, company_name, contact_email, status)
VALUES (
  'CLIENT_USER_ID',
  'Acme Corporation',
  'contact@acme.com',
  'active'
);
```

✅ **Test users created!**

---

## Step 6: Install & Run (3 minutes)

1. Open terminal in your project folder
2. Run:

```bash
npm install
npm run dev
```

3. Wait for server to start
4. Open browser to [http://localhost:3000](http://localhost:3000)

✅ **Portal is running!**

---

## Step 7: Test Login (2 minutes)

1. You should see the login page
2. Enter credentials for **admin@example.com** with your password
3. Click **Sign In**
4. If successful, you'll see the **Admin Dashboard** with charts and data

---

## 8: Explore Admin Dashboard (3 minutes)

Once logged in as admin, you'll see:

- **Overview Tab**: Revenue vs spending charts, financial summary
- **Clients Tab**: List of clients (currently empty, ready to add more)
- **Projects Tab**: List of projects (empty, ready to create)
- **Payments Tab**: Placeholder for payment management

Click through each tab to explore the interface.

---

## Step 9: Test Client View (3 minutes)

1. Click **Sign Out** button (top right)
2. Login as `client@example.com` with your password
3. You'll see the **Client Dashboard** showing:
   - Active projects
   - Budget tracking
   - Upcoming milestones
   - Recent updates

---

## 🎉 Success!

You now have a running client portal! The admin can manage projects and payments, while clients can track progress.

---

## 📋 Troubleshooting Quick Fix

### Can't login?
- Check `.env.local` has correct URL and keys
- Verify user created in Supabase Auth
- Check user table has correct role

### Don't see dashboard?
- Check network tab for errors
- Verify database.sql ran without errors
- Restart dev server: `Ctrl+C` then `npm run dev`

### Charts not showing?
- Open browser console (F12) for errors
- Check that projects have budget data
- Reload page

**Need more help?** See [SETUP.md](SETUP.md) or [DEVELOPMENT.md](DEVELOPMENT.md)

---

## 🚀 Next Steps

Now that it's running, try:

1. **Add sample data** via SQL in Supabase
   - Add projects to the projects table
   - Add milestones to test milestone tracking

2. **Explore the code**
   - Look at [app/(protected)/client/page.tsx](app/%28protected%29/client/page.tsx) for client dashboard
   - Look at [app/(protected)/admin/page.tsx](app/%28protected%29/admin/page.tsx) for admin dashboard
   - Review [database.sql](database.sql) for schema

3. **Implement features**
   - See [API.md](API.md) for available endpoints to build
   - Check [PROJECT.md](PROJECT.md) for feature roadmap

4. **Deploy to production**
   - Push to GitHub
   - Connect to Vercel
   - Set environment variables
   - Deploy with one click

---

## 📚 Documentation Map

| Document | Purpose | Time |
|----------|---------|------|
| **[SETUP.md](SETUP.md)** | Extended setup guide | 5 min |
| **[README.md](README.md)** | Full documentation | 15 min |
| **[API.md](API.md)** | Build APIs | 10 min |
| **[PROJECT.md](PROJECT.md)** | Understand architecture | 15 min |
| **[DEVELOPMENT.md](DEVELOPMENT.md)** | Development workflow | 5 min |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System design | 10 min |

---

## 💡 Pro Tips

1. **Use TypeScript**: Full type safety for custom code
2. **Check browser console**: Errors show up there
3. **Inspect database**: Supabase UI lets you browser tables
4. **Read comments**: Code is well-commented for guidance
5. **Check .env.local**: Most issues are env variable related

---

## 🎓 Learning Path

📈 **Beginner**
1. Run setup (this guide)
2. Explore dashboards
3. Review code structure
4. Read comments in code

📚 **Intermediate**
1. Review [API.md](API.md)
2. Understand database schema
3. Implement one API route
4. Add form for creating data

🚀 **Advanced**
1. Build complete CRUD features
2. Add email notifications
3. Implement file uploads
4. Deploy to production

---

## 🔐 Security Reminders

✅ Never commit `.env.local` to Git
✅ Use strong passwords for test accounts
✅ Change credentials before production
✅ Enable email verification in production
✅ Set up proper HTTPS in production

---

## 🆘 Getting Help

### Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` |
| "Port 3000 in use" | Close other apps or use `npm run dev -- -p 3001` |
| "Invalid credentials" | Verify user in Supabase Auth |
| "Permission denied" | Check RLS policies in database.sql |
| "Database connection error" | Verify `.env.local` has correct URL |

### Get More Help
- See [DEVELOPMENT.md](DEVELOPMENT.md) for checklist
- See [README.md](README.md) for troubleshooting section
- Read [ARCHITECTURE.md](ARCHITECTURE.md) for system design

---

## ✉️ Feedback

Once you've explored the portal:
- What features would you add first?
- What could be clearer in the code?
- Any performance improvements?

Share feedback to improve the next iteration!

---

## ✨ You're All Set!

Your professional client portal is:
- ✅ Running locally
- ✅ Fully functional
- ✅ Ready to customize
- ✅ Ready to deploy

**Next step**: Read [README.md](README.md) for the full feature roadmap or start building from [API.md](API.md)

---

**Happy coding! 🎉**

*Portal scaffold created: July 9, 2026*
*Setup time: 30 minutes*
*Ready to deploy: Today*
