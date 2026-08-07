'use client'

import Link from 'next/link'
import { FormEvent, ReactNode, useEffect, useState } from 'react'

const DEMO_EMAIL = 'client@northstar.demo'
const DEMO_PASSWORD = 'Northstar2026!'
const SESSION_KEY = 'northstar-portal-session'

export function PortalGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setSignedIn(window.sessionStorage.getItem(SESSION_KEY) === 'active')
    setReady(true)
  }, [])

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('Those details do not match. Check the demo credentials and try again.')
      return
    }
    window.sessionStorage.setItem(SESSION_KEY, 'active')
    setError('')
    setSignedIn(true)
  }

  function signOut() {
    window.sessionStorage.removeItem(SESSION_KEY)
    setEmail('')
    setPassword('')
    setSignedIn(false)
  }

  if (!ready) return <div className="min-h-screen bg-slate-950" />

  if (!signedIn) {
    return (
      <main className="login-canvas min-h-screen px-5 py-8 sm:grid sm:place-items-center sm:py-12">
        <div className="relative z-10 mx-auto grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl shadow-slate-950/40 lg:grid-cols-[1.08fr_.92fr]">
          <section className="hidden min-h-[640px] flex-col justify-between bg-slate-950 p-12 text-white lg:flex">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-sm font-black text-slate-950">N</span>
              <span className="font-semibold tracking-tight">Northstar</span>
            </div>
            <div>
              <div className="mb-7 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300"><span className="h-px w-8 bg-cyan-400" /> Client workspace</div>
              <h1 className="max-w-md text-4xl font-semibold leading-[1.12] tracking-[-0.04em]">Clarity on every project, from kickoff to launch.</h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">One focused place for progress, dependencies, client actions, and the latest updates from your delivery team.</p>
            </div>
            <div className="flex gap-8 border-t border-white/10 pt-7 text-xs text-slate-400"><span><strong className="block text-lg font-semibold text-white">4</strong>Projects</span><span><strong className="block text-lg font-semibold text-white">Live</strong>Status</span><span><strong className="block text-lg font-semibold text-white">24/7</strong>Visibility</span></div>
          </section>

          <section className="flex min-h-[600px] items-center p-7 sm:p-12 lg:min-h-[640px]">
            <div className="mx-auto w-full max-w-sm">
              <div className="mb-10 flex items-center gap-3 lg:hidden"><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white">N</span><span className="font-semibold tracking-tight">Northstar</span></div>
              <p className="eyebrow text-cyan-700">Private client portal</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-slate-950">Welcome back</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">Sign in to review current projects and action items.</p>
              <form className="mt-8 space-y-5" onSubmit={signIn}>
                <label className="block"><span className="text-sm font-medium text-slate-700">Email address</span><input autoComplete="username" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:bg-white focus:ring-4 focus:ring-cyan-600/10" onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" type="email" value={email} /></label>
                <label className="block"><span className="text-sm font-medium text-slate-700">Password</span><input autoComplete="current-password" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:bg-white focus:ring-4 focus:ring-cyan-600/10" onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" type="password" value={password} /></label>
                {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-700" role="alert">{error}</p>}
                <button className="w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-950/15" type="submit">Sign in to portal <span className="ml-1" aria-hidden>→</span></button>
              </form>
              <p className="mt-7 text-center text-xs leading-5 text-slate-400">Demo access only · Contact your project owner if you need help.</p>
            </div>
          </section>
        </div>
      </main>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="page-shell flex h-[68px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-slate-950"><span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-xs font-black text-white shadow-md shadow-slate-900/15">N</span><span className="text-sm font-semibold tracking-tight">Northstar <span className="font-normal text-slate-400">/ Client portal</span></span></Link>
          <div className="flex items-center gap-2"><Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950">Projects</Link><span className="mx-1 h-5 w-px bg-slate-200" /><button className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-950" onClick={signOut} type="button">Sign out</button></div>
        </div>
      </header>
      {children}
    </>
  )
}
