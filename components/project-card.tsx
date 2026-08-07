import Link from 'next/link'
import type { Project } from '@/lib/projects'
import { ProgressBar } from './progress-bar'
import { StatusBadge } from './status-badge'

export function ProjectCard({ project }: { project: Project }) {
  const openDependencies = project.dependencies.filter((item) => item.status !== 'Resolved').length
  const clientActions = project.dependencies.filter((item) => item.ownerType === 'Client' && item.status !== 'Resolved').length

  return (
    <Link href={`/projects/${project.id}`} className="panel group flex min-h-[285px] flex-col p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0"><h2 className="text-lg font-semibold tracking-tight text-slate-950 group-hover:text-blue-700">{project.name}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{project.description}</p></div>
        <StatusBadge status={project.status} />
      </div>
      {clientActions > 0 && <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">Client action required · {clientActions} {clientActions === 1 ? 'item' : 'items'}</div>}
      <div className="mt-auto pt-6"><ProgressBar value={project.progress} /></div>
      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-xs">
        <div><dt className="text-slate-500">Owner</dt><dd className="mt-1 truncate font-medium text-slate-800">{project.owner.name}</dd></div>
        <div><dt className="text-slate-500">Target</dt><dd className="mt-1 font-medium text-slate-800">{project.targetDate.replace(', 2026', '')}</dd></div>
        <div><dt className="text-slate-500">Dependencies</dt><dd className="mt-1 font-medium text-slate-800">{openDependencies} open</dd></div>
      </dl>
      <p className="mt-4 text-xs text-slate-500">Latest update · {project.updates[0].date}</p>
    </Link>
  )
}
