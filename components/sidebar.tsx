"use client"

import { useApp, type Screen } from "./app-context"
import { Icon } from "./icons"
import { cn } from "@/lib/utils"

const NAV: { key: Screen; label: string; icon: keyof typeof Icon; adminOnly?: boolean }[] = [
  { key: "dashboard", label: "Dashboard", icon: "Dashboard" },
  { key: "clients", label: "Clients", icon: "Clients" },
  { key: "candidates", label: "Candidates", icon: "Users" },
  { key: "ai-analyzer", label: "AI CV Analyzer", icon: "Ai", adminOnly: true },
  { key: "interview-scheduling", label: "Interview Scheduling", icon: "Calendar", adminOnly: true },
  { key: "email-automation", label: "Email Automation", icon: "Email", adminOnly: true },
  { key: "reports", label: "Reports", icon: "Reports" },
]

export function Sidebar() {
  const { nav, go, role, clientIdFilter, setRole, logout, sidebarCollapsed, toggleSidebar } = useApp()
  const readonly = role === "client"
  const filteredNav = NAV.filter((item) => !item.adminOnly || !readonly)
  const activeClient = readonly ? clientIdFilter === "apex" ? "Apex Corp" : clientIdFilter : "All access"

  return (
    <aside className={cn("flex min-h-screen flex-col border-r border-slate-800 bg-slate-950 text-slate-100 transition-all duration-300", sidebarCollapsed ? "w-20" : "w-72")}>
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className={cn("flex items-center gap-3 transition-opacity duration-200", sidebarCollapsed && "justify-center") }>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 shadow-lg shadow-cyan-500/20">
            <Icon.Briefcase className="size-5" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <p className="text-sm font-semibold text-white">Tread Talent</p>
              <p className="text-[11px] text-slate-400">Premium recruiting</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-slate-700 hover:bg-slate-800"
        >
          <Icon.ChevronLeft className={cn("size-4 transition-transform duration-200", sidebarCollapsed && "rotate-180")} />
        </button>
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-1 px-2">
        {filteredNav.map((item) => {
          const active = nav.screen === item.key || (item.key === "clients" && ["clients", "client-folder", "job-detail"].includes(nav.screen))
          const IconComp = readonly && item.key === "clients" ? Icon.Briefcase : Icon[item.icon]
          const label = readonly && item.key === "clients" ? "Jobs" : item.label
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => go(item.key)}
              title={label}
              className={cn(
                "flex items-center gap-3 rounded-3xl px-3 py-3 text-sm font-medium transition-colors duration-200",
                active
                  ? "bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "text-slate-300 hover:bg-slate-900/80 hover:text-white",
                sidebarCollapsed ? "justify-center px-0" : "justify-start",
              )}
            >
              <IconComp className="size-5" />
              {!sidebarCollapsed && label}
            </button>
          )
        })}
      </nav>

      <div className={cn("mt-auto border-t border-slate-800 px-3 py-4", sidebarCollapsed ? "text-center" : "") }>
        <div className={cn("flex items-center gap-3 rounded-3xl bg-slate-900/90 p-3 text-sm text-slate-200", sidebarCollapsed ? "justify-center" : "") }>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 text-slate-950 font-bold">
            {readonly ? "C" : "M"}
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{readonly ? "Client View" : "Matt (Admin)"}</p>
              <p className="truncate text-[11px] text-slate-400">{activeClient}</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => (readonly ? setRole("admin") : logout())}
          className={cn(
            "mt-3 flex w-full items-center justify-center gap-2 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800",
            sidebarCollapsed ? "px-0" : ""
          )}
        >
          <Icon.Settings className="size-4" />
          {!sidebarCollapsed && (readonly ? "Back to admin" : "Sign out")}
        </button>
      </div>
    </aside>
  )
}
