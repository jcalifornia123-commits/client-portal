import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Northstar Client Portal',
  description: 'Project status, dependencies, and owner updates.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="page-shell flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 text-slate-950">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-950 text-xs font-bold text-white">N</span>
              <span className="text-sm font-semibold tracking-tight">Northstar <span className="font-normal text-slate-500">/ Client portal</span></span>
            </Link>
            <nav aria-label="Primary navigation">
              <Link href="/" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950">Projects</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
