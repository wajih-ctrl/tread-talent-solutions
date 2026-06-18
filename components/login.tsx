"use client"

import React from 'react'
import { useApp } from "./app-context"
import { Icon } from "./icons"

export function Breadcrumbs({ items }: { items: { label: string; onClick?: () => void }[] }) {
  return (
    <nav className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <Icon.ChevronRight className="size-3.5 text-muted-foreground/60" />}
          {item.onClick ? (
            <button onClick={item.onClick} className="transition-colors hover:text-primary">{item.label}</button>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export function Login() {
  const { go, setRole } = useApp()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [roleSelect, setRoleSelect] = React.useState("admin")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // For demo purposes, allow empty credentials
    if (roleSelect === "admin") {
      setRole("admin")
    } else {
      setRole("client", "apex")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left side — Branding panel */}
          <div className="text-white space-y-8">
            <div>
              <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 text-slate-900 mb-4">
                <Icon.Briefcase className="size-7" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Tread Talent Solutions</h1>
              <p className="mt-2 text-lg text-slate-300">Recruiting Operations, Client Pipelines, and Candidate Intelligence in One Workspace.</p>
            </div>

            <p className="text-slate-400 text-sm">Built for solo RPO operators managing clients, roles, candidates, and hiring team visibility without double work.</p>

            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-300">
                <Icon.Check className="size-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Manage every client, job, and candidate in one structured workspace</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Icon.Check className="size-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Screen CVs with AI summaries and criteria checklists</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Icon.Check className="size-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Keep clients aligned with read only pipeline visibility</span>
              </li>
            </ul>

          </div>

          {/* Right side — Login form */}
          <div className="w-full">
            <div className="rounded-2xl bg-white p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Sign in to Tread Talent</h2>
              <p className="text-sm text-muted-foreground mb-8">For prototype demo, any credentials work.</p>

              <form onSubmit={handleLogin} className="space-y-5">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-foreground">Email</span>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="you@company.com"
                    className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30" 
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-foreground">Password</span>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30" 
                  />
                </label>

               

                <button 
                  type="submit" 
                  className="w-full mt-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.99]"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex-1 border-t border-border" />
                <span className="text-xs text-muted-foreground">Demo Access</span>
                <div className="flex-1 border-t border-border" />
              </div>

              <button 
                onClick={() => {
                  setEmail("demo@treadtalent.com")
                  setPassword("demo")
                  setRoleSelect("admin")
                }}
                className="mt-3 w-full rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 transition"
              >
                Admin Access
              </button>

              <button 
                onClick={() => {
                  setEmail("client@apexcorp.com")
                  setPassword("demo")
                  setRoleSelect("client")
                }}
                className="mt-2 w-full rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 px-4 py-2 text-sm font-medium text-purple-900 transition"
              >
              Client View
              </button>

              <p className="mt-6 text-center text-xs text-muted-foreground">© 2026 Tread Talent Solutions. Internal use only.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
