"use client"

import { useState } from "react"
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

export function MobileNav() {
  const { nav, go, role, logout } = useApp()
  const [open, setOpen] = useState(false)
  const readonly = role === "client"
  const filteredNav = NAV.filter((item) => !item.adminOnly || !readonly)
  const clientScreens: Screen[] = ["clients", "client-folder", "job-detail"]

  const handleNavigate = (screen: Screen) => {
    go(screen)
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        className="md:hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {open ? <Icon.X className="size-5" /> : <Icon.Menu className="size-5" />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30 bg-black/40" onClick={() => setOpen(false)} />
          <nav className="absolute left-0 right-0 top-14 z-40 border-b border-border bg-card shadow-lg md:hidden">
            <div className="flex flex-col gap-1 p-3 max-h-[calc(100vh-56px)] overflow-y-auto">
              {filteredNav.map((item) => {
                const active = nav.screen === item.key || (item.key === "clients" && clientScreens.includes(nav.screen))
                const IconComp = readonly && item.key === "clients" ? Icon.Briefcase : Icon[item.icon]
                const label = readonly && item.key === "clients" ? "Jobs" : item.label
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavigate(item.key)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    <IconComp className="size-5" />
                    {label}
                  </button>
                )
              })}

              <div className="my-2 border-t border-border pt-2">
                <button
                  onClick={() => { logout(); setOpen(false) }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors w-full"
                >
                  <Icon.Settings className="size-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  )
}
