# API Documentation - Client Portal

## Authentication

### Login
```
POST /api/auth/login
Body: { email: string, password: string }
Response: { user: User, session: Session }
```

### Logout
```
POST /api/auth/logout
Response: { success: boolean }
```

---

## Clients API

### List Clients (Admin only)
```
GET /api/clients
Query: ?status=active|inactive|archived
Response: Client[]
```

### Create Client (Admin only)
```
POST /api/clients
Body: {
  company_name: string
  contact_email: string
  phone?: string
  user_id: string (client user's ID)
}
Response: Client
```

### Update Client (Admin only)
```
PUT /api/clients/:id
Body: Partial<Client>
Response: Client
```

### Delete Client (Admin only)
```
DELETE /api/clients/:id
Response: { success: boolean }
```

---

## Projects API

### List Projects
- Clients see only their projects
- Admins see all projects

```
GET /api/projects
Query: ?client_id=uuid&status=planning|in_progress|completed|on_hold
Response: Project[]
```

### Create Project (Admin only)
```
POST /api/projects
Body: {
  client_id: string
  name: string
  description?: string
  budget: number
  start_date: ISO string
  end_date?: ISO string
}
Response: Project
```

### Update Project (Admin only)
```
PUT /api/projects/:id
Body: Partial<Project>
Response: Project
```

### Get Project Details
```
GET /api/projects/:id
Response: Project with related milestones, payments, updates
```

---

## Milestones API

### List Project Milestones
```
GET /api/milestones?project_id=uuid
Query: ?status=pending|in_progress|completed
Response: Milestone[]
```

### Create Milestone (Admin only)
```
POST /api/milestones
Body: {
  project_id: string
  title: string
  description?: string
  due_date: ISO string
  status?: 'pending' | 'in_progress' | 'completed'
}
Response: Milestone
```

### Update Milestone (Admin only)
```
PUT /api/milestones/:id
Body: Partial<Milestone>
Response: Milestone
```

---

## Payments API

### List Project Payments
```
GET /api/payments?project_id=uuid
Query: ?status=pending|paid|overdue
Response: Payment[]
```

### Create Payment (Admin only)
```
POST /api/payments
Body: {
  project_id: string
  amount: number
  type: 'upfront' | 'milestone' | 'final'
  due_date: ISO string
  status?: 'pending'
}
Response: Payment
```

### Update Payment Status (Admin only)
```
PUT /api/payments/:id
Body: { status: 'pending' | 'paid' | 'overdue', paid_date?: ISO string }
Response: Payment
```

---

## Recurring Costs API

### List Project Recurring Costs
```
GET /api/recurring-costs?project_id=uuid
Query: ?active=true|false
Response: RecurringCost[]
```

### Create Recurring Cost (Admin only)
```
POST /api/recurring-costs
Body: {
  project_id: string
  name: string
  amount: number
  frequency: 'monthly' | 'quarterly' | 'yearly'
  active?: true
}
Response: RecurringCost
```

### Update Recurring Cost (Admin only)
```
PUT /api/recurring-costs/:id
Body: Partial<RecurringCost>
Response: RecurringCost
```

---

## Updates API

### List Project Updates
- Clients see only updates for their projects
- Admins see all updates

```
GET /api/updates?project_id=uuid
Query: ?limit=10&offset=0
Response: Update[]
```

### Create Update (Admin only)
```
POST /api/updates
Body: {
  project_id: string
  title: string
  content: string
}
Response: Update (with created_by = current user)
```

### Update Update (Author or Admin only)
```
PUT /api/updates/:id
Body: Partial<Update>
Response: Update
```

### Delete Update (Author or Admin only)
```
DELETE /api/updates/:id
Response: { success: boolean }
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

Common status codes:
- `400` - Bad request / validation error
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (no permission)
- `404` - Not found
- `500` - Server error

---

## Rate Limiting

API calls are rate limited to prevent abuse:
- 1000 requests per 15 minutes per IP
- 100 requests per 1 minute per authenticated user

Exceeding limits returns `429 Too Many Requests`

---

## Webhook Events (Future)

The following events will be available for webhook subscriptions:

- `project.created`
- `project.updated`
- `milestone.completed`
- `payment.due`
- `payment.received`
- `update.published`
