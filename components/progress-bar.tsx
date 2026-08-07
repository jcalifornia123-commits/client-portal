export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={`${value}% complete`}>
        <div className="h-full rounded-full bg-slate-900" style={{ width: `${value}%` }} />
      </div>
      <span className="w-9 text-right text-xs font-semibold tabular-nums text-slate-600">{value}%</span>
    </div>
  )
}
