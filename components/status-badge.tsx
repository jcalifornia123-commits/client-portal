import type { DependencyStatus, ProjectStatus } from '@/lib/projects'

const styles: Record<ProjectStatus | DependencyStatus, string> = {
  'On Track': 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  'At Risk': 'bg-amber-50 text-amber-800 ring-amber-600/20',
  Blocked: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  Complete: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  Needed: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  'In Progress': 'bg-blue-50 text-blue-700 ring-blue-600/20',
  Resolved: 'bg-slate-100 text-slate-600 ring-slate-500/20',
}

export function StatusBadge({ status }: { status: ProjectStatus | DependencyStatus }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}>{status}</span>
}
