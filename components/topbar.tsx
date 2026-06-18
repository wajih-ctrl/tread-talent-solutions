"use client"

import { useState } from "react"
import { useApp } from "./app-context"
import { useStore } from "./store"
import { MobileNav } from "./mobile-nav"
import { Icon } from "./icons"

const TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  clients: "Clients",
  "client-folder": "Client Folder",
  "job-detail": "Position Detail",
  candidates: "Candidates",
  "candidate-profile": "Candidate Profile",
  "interview-scheduling": "Interview Scheduling",
  "ai-analyzer": "AI CV Analyzer",
  "email-automation": "Email Automation",
  reports: "Reports",
}

const NOTIFS = [
  "New CV uploaded for Senior Engineer @ Apex Corp",
  "AI Analysis complete for Marketing Manager @ BlueSky",
  "Interview confirmed: Sarah Chen – Tomorrow 2PM",
]

export function Topbar() {
  const { nav, role, clientIdFilter, sidebarCollapsed, toggleSidebar } = useApp()
  const { clients } = useStore()
  const [open, setOpen] = useState(false)
  const title = role === "client" && nav.screen === "clients" ? "Jobs" : TITLES[nav.screen] || "Tread Talent"
  const currentClient = role === "client" ? clients.find((client) => client.id === clientIdFilter) : null
  const notifications = currentClient ? NOTIFS.filter((item) => item.includes(currentClient.name)) : NOTIFS

  return (
    <header className="relative flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-3 sm:px-6 gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden md:inline-flex rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Icon.ChevronLeft className={`${sidebarCollapsed ? "rotate-180" : ""} size-5 transition-transform duration-200`} />
        </button>
        <MobileNav />
      </div>
      <h1 className="text-sm sm:text-base font-semibold text-foreground truncate flex-1">{title}</h1>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Notifications"
            className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Icon.Bell className="size-5" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-danger ring-2 ring-card" />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-11 z-40 w-80 max-w-[calc(100vw-1rem)] rounded-xl border border-border bg-card shadow-lg">
                <div className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">Notifications</div>
                <ul className="max-h-80 overflow-y-auto py-1">
                  {notifications.map((n, i) => (
                    <li key={i} className="flex gap-3 px-4 py-3 text-xs sm:text-sm text-foreground transition-colors hover:bg-muted">
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                      <span className="leading-snug">{n}</span>
                    </li>
                  ))}
                  {notifications.length === 0 && (
                    <li className="px-4 py-6 text-center text-xs text-muted-foreground">No notifications</li>
                  )}
                </ul>
              </div>
            </>
          )}
        </div>

        <span className="hidden sm:inline-block rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground whitespace-nowrap">
          Tread Talent
        </span>
      </div>
    </header>
  )
}
