import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProgressBar } from '@/components/progress-bar'
import { StatusBadge } from '@/components/status-badge'
import { getProject, projects } from '@/lib/projects'

export function generateStaticParams() { return projects.map(({ id }) => ({ id })) }

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = getProject(params.id)
  if (!project) notFound()
  const clientActions = project.dependencies.filter((item) => item.ownerType === 'Client' && item.status !== 'Resolved')

  return (
    <main className="page-shell py-8 sm:py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950"><span aria-hidden>←</span> All projects</Link>

      <section className="mt-7 border-b border-slate-200 pb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl"><div className="flex flex-wrap items-center gap-3"><h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">{project.name}</h1><StatusBadge status={project.status} /></div><p className="mt-3 text-base leading-7 text-slate-600">{project.description}</p></div>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm sm:grid-cols-3 lg:min-w-[430px]">
            <div><dt className="text-xs text-slate-500">Project owner</dt><dd className="mt-1 font-semibold text-slate-900">{project.owner.name}</dd><dd className="text-xs text-slate-500">{project.owner.role}</dd></div>
            <div><dt className="text-xs text-slate-500">Target completion</dt><dd className="mt-1 font-semibold text-slate-900">{project.targetDate}</dd></div>
            <div className="col-span-2 sm:col-span-1"><dt className="mb-2 text-xs text-slate-500">Overall progress</dt><ProgressBar value={project.progress} /></div>
          </dl>
        </div>
      </section>

      {clientActions.length > 0 && (
        <section className="mt-7 flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 sm:p-5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-200 text-sm font-bold text-amber-900">!</span>
          <div><h2 className="font-semibold text-amber-950">Client action required</h2><p className="mt-1 text-sm leading-6 text-amber-900">Your team has {clientActions.length} open {clientActions.length === 1 ? 'item' : 'items'} to help keep this project moving: {clientActions.map((item) => item.title).join(' and ')}.</p></div>
        </section>
      )}

      <section className="panel mt-7 p-5 sm:p-6">
        <p className="eyebrow">Project summary</p>
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[['Current state', project.currentState], ['Happening now', project.happeningNow], ['Blocking progress', project.blocker], ['What happens next', project.nextStep]].map(([label, value]) => <div key={label}><h2 className="text-sm font-semibold text-slate-950">{label}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{value}</p></div>)}
        </div>
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <section>
          <div className="mb-4 flex items-end justify-between"><div><p className="eyebrow">Dependencies</p><h2 className="mt-1 text-xl font-semibold tracking-tight">What this project needs</h2></div><span className="text-xs text-slate-500">{project.dependencies.filter((item) => item.status !== 'Resolved').length} open</span></div>
          <div className="space-y-3">
            {project.dependencies.map((item) => (
              <article key={item.id} className={`rounded-xl border p-4 sm:p-5 ${item.ownerType === 'Client' && item.status !== 'Resolved' ? 'border-amber-300 bg-amber-50/60' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-start justify-between gap-3"><div>{item.ownerType === 'Client' && item.status !== 'Resolved' && <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-amber-800">Client action required</p>}<h3 className="font-semibold text-slate-950">{item.title}</h3></div><StatusBadge status={item.status} /></div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-slate-200/70 pt-3 text-xs text-slate-500"><span>Owner: <strong className="font-medium text-slate-800">{item.owner}</strong></span><span>Team: <strong className="font-medium text-slate-800">{item.ownerType}</strong></span>{item.dueDate && <span>Due: <strong className="font-medium text-slate-800">{item.dueDate}</strong></span>}</div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <p className="eyebrow">Latest updates</p><h2 className="mt-1 text-xl font-semibold tracking-tight">From the project owner</h2>
          <div className="mt-4 border-l border-slate-200 pl-5 sm:pl-6">
            {project.updates.map((update) => (
              <article key={update.id} className="relative pb-8 last:pb-0 before:absolute before:-left-[25px] before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-slate-400 sm:before:-left-[29px]">
                <div className="flex flex-wrap items-center gap-2"><time className="text-xs font-medium text-slate-500">{update.date}</time>{update.status && <StatusBadge status={update.status} />}</div>
                <h3 className="mt-2 font-semibold text-slate-950">{update.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{update.description}</p>
                <div className="mt-3 flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">{update.owner.initials}</span><div className="text-xs"><p className="font-medium text-slate-800">{update.owner.name}</p><p className="text-slate-500">{update.owner.role}</p></div></div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
