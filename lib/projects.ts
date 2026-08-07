export type ProjectStatus = 'On Track' | 'At Risk' | 'Blocked' | 'Complete'
export type DependencyStatus = 'Needed' | 'In Progress' | 'Resolved'
export type OwnerType = 'Client' | 'Our Team'

export interface Owner { name: string; role: string; initials: string }
export interface Dependency { id: string; title: string; description: string; owner: string; ownerType: OwnerType; status: DependencyStatus; dueDate?: string }
export interface ProjectUpdate { id: string; owner: Owner; date: string; title: string; description: string; status?: ProjectStatus }
export interface Project {
  id: string; name: string; description: string; owner: Owner; status: ProjectStatus; progress: number;
  targetDate: string; currentState: string; happeningNow: string; blocker: string; nextStep: string;
  dependencies: Dependency[]; updates: ProjectUpdate[]
}

const maya: Owner = { name: 'Maya Chen', role: 'Product Lead', initials: 'MC' }
const jonah: Owner = { name: 'Jonah Reed', role: 'Engineering Lead', initials: 'JR' }
const nina: Owner = { name: 'Nina Patel', role: 'Project Lead', initials: 'NP' }
const leo: Owner = { name: 'Leo Martins', role: 'Technical Lead', initials: 'LM' }

export const projects: Project[] = [
  {
    id: 'customer-dashboard', name: 'Customer Dashboard', description: 'A redesigned workspace for customers to manage accounts, usage, and team access.', owner: maya, status: 'On Track', progress: 68, targetDate: 'September 18, 2026',
    currentState: 'The core dashboard experience is built and tracking to plan.', happeningNow: 'We are finishing account settings and validating responsive layouts.', blocker: 'No active blockers. Final copy review is scheduled with your team.', nextStep: 'Complete accessibility QA, then prepare the dashboard for stakeholder review.',
    dependencies: [
      { id: 'final-copy', title: 'Approve account settings copy', description: 'Review labels and help text for the new account settings screens.', owner: 'Avery Brooks', ownerType: 'Client', status: 'In Progress', dueDate: 'August 14, 2026' },
      { id: 'a11y', title: 'Accessibility review', description: 'Complete keyboard and screen reader testing across the dashboard.', owner: 'Northstar QA', ownerType: 'Our Team', status: 'In Progress', dueDate: 'August 21, 2026' },
    ],
    updates: [
      { id: 'dashboard-responsive', owner: maya, date: 'August 6, 2026', title: 'Responsive dashboard layouts complete', description: 'The overview, usage, and team screens now work across desktop, tablet, and mobile. We are moving into the final settings screens.', status: 'On Track' },
      { id: 'dashboard-testing', owner: maya, date: 'July 30, 2026', title: 'First usability round completed', description: 'Testing confirmed the new navigation is easier to scan. We incorporated the two highest-impact findings into this sprint.' },
    ],
  },
  {
    id: 'payment-integration', name: 'Payment Integration', description: 'Stripe-powered subscriptions, invoices, and self-serve billing management.', owner: jonah, status: 'At Risk', progress: 46, targetDate: 'October 2, 2026',
    currentState: 'The checkout frontend is complete, but integration work cannot finish yet.', happeningNow: 'We are testing error states with a temporary Stripe sandbox.', blocker: 'Production API credentials and final pricing IDs are still needed from your team.', nextStep: 'Connect the production account and run end-to-end payment validation.',
    dependencies: [
      { id: 'stripe-keys', title: 'Provide Stripe API credentials', description: 'Share restricted production keys through the approved secure channel.', owner: 'Client Finance Team', ownerType: 'Client', status: 'Needed', dueDate: 'August 12, 2026' },
      { id: 'price-ids', title: 'Confirm subscription price IDs', description: 'Confirm the monthly and annual Stripe price IDs for each plan.', owner: 'Client Product Team', ownerType: 'Client', status: 'Needed', dueDate: 'August 12, 2026' },
      { id: 'webhooks', title: 'Implement webhook handling', description: 'Handle successful payments, renewals, and failed charge events.', owner: 'Northstar Engineering', ownerType: 'Our Team', status: 'In Progress' },
    ],
    updates: [
      { id: 'checkout', owner: jonah, date: 'August 5, 2026', title: 'Checkout flow completed', description: 'The new checkout frontend and all major states are working. The next step is connecting Stripe once credentials are provided.', status: 'At Risk' },
      { id: 'billing', owner: jonah, date: 'July 29, 2026', title: 'Billing portal approved', description: 'The billing portal review is complete, including invoice history and payment method management.' },
    ],
  },
  {
    id: 'ai-support-assistant', name: 'AI Support Assistant', description: 'An in-product assistant that answers common support questions from approved content.', owner: nina, status: 'Blocked', progress: 34, targetDate: 'October 23, 2026',
    currentState: 'The conversation interface and content pipeline are ready for integration.', happeningNow: 'The team is isolating a retrieval quality issue found in internal testing.', blocker: 'Our content indexing service is returning inconsistent results for long documents.', nextStep: 'Deploy the indexing fix, rerun the benchmark, and resume assistant integration.',
    dependencies: [
      { id: 'indexing', title: 'Resolve content indexing issue', description: 'Improve long-document chunking and verify retrieval quality against the benchmark set.', owner: 'Northstar AI Team', ownerType: 'Our Team', status: 'Needed', dueDate: 'August 17, 2026' },
      { id: 'articles', title: 'Approved support article set', description: 'Initial set of 120 approved help-center articles for grounding.', owner: 'Client Support Team', ownerType: 'Client', status: 'Resolved' },
    ],
    updates: [
      { id: 'quality-blocker', owner: nina, date: 'August 7, 2026', title: 'Retrieval quality issue identified', description: 'Testing revealed inconsistent answers from longer source documents. The assistant remains paused while we correct indexing.', status: 'Blocked' },
      { id: 'content-import', owner: nina, date: 'August 1, 2026', title: 'Support content imported', description: 'All approved help-center content has been cleaned, tagged, and loaded into the staging environment.' },
    ],
  },
  {
    id: 'analytics-platform', name: 'Analytics Platform', description: 'A reporting workspace for product adoption, retention, and account health.', owner: leo, status: 'Complete', progress: 100, targetDate: 'August 1, 2026',
    currentState: 'The platform is live and available to all approved client users.', happeningNow: 'We are monitoring usage and documenting minor post-launch observations.', blocker: 'There are no blockers or outstanding client actions.', nextStep: 'Hold the 30-day review and prioritize any follow-up improvements.',
    dependencies: [
      { id: 'tracking', title: 'Validate production tracking', description: 'Confirmed critical events are arriving with the expected attributes.', owner: 'Northstar Data Team', ownerType: 'Our Team', status: 'Resolved' },
      { id: 'access-list', title: 'Confirm launch access list', description: 'Approved the initial group of reporting users.', owner: 'Client Operations', ownerType: 'Client', status: 'Resolved' },
    ],
    updates: [
      { id: 'launched', owner: leo, date: 'August 1, 2026', title: 'Analytics platform launched', description: 'The reporting workspace is live with adoption, retention, and account health views. All launch checks passed.', status: 'Complete' },
      { id: 'training', owner: leo, date: 'July 28, 2026', title: 'Team training completed', description: 'We completed two enablement sessions and shared the reporting guide with all launch users.' },
    ],
  },
]

export function getProject(id: string) { return projects.find((project) => project.id === id) }
