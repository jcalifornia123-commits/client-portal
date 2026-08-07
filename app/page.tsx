import { ProjectCard } from '@/components/project-card'
import { projects } from '@/lib/projects'

export default function ProjectsPage() {
  const clientActions = projects.reduce(
    (count, project) =>
      count + project.dependencies.filter((item) => item.ownerType === 'Client' && item.status !== 'Resolved').length,
    0,
  )

  return (
    <main className="page-shell py-10 sm:py-14">
      <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Project overview</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">Projects</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            A clear view of active work, upcoming milestones, and anything your team needs to unblock.
          </p>
        </div>
        <div className="w-fit rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Client attention</p>
          <p className="mt-1 text-sm text-amber-950"><span className="font-semibold">{clientActions} items</span> need your team</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </main>
  )
}
