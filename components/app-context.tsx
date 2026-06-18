"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type Screen =
  | "login" | "dashboard" | "clients" | "client-folder" | "job-detail"
  | "candidates" | "candidate-profile" | "interview-scheduling" | "ai-analyzer"
  | "email-automation" | "reports"

type NavState = {
  screen: Screen
  clientId?: string
  jobId?: string
  candidateId?: string
}

export type UserRole = "admin" | "client"

type AppContextType = {
  nav: NavState
  go: (s: Screen, params?: Partial<Omit<NavState, "screen">>) => void
  toast: (msg: string) => void
  role: UserRole
  clientIdFilter?: string
  setRole: (r: UserRole, clientId?: string) => void
  logout: () => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

const AppContext = createContext<AppContextType | null>(null)
const CLIENT_ALLOWED_SCREENS: Screen[] = ["dashboard", "clients", "job-detail", "candidates", "candidate-profile", "reports"]

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [nav, setNav] = useState<NavState>({ screen: "login" })
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([])
  const [role, setRoleState] = useState<UserRole>("admin")
  const [clientIdFilter, setClientIdFilter] = useState<string | undefined>(undefined)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const go = useCallback((screen: Screen, params?: Partial<Omit<NavState, "screen">>) => {
    setNav((prev) => {
      if (role === "client") {
        const requestedClientId = params?.clientId ?? prev.clientId ?? clientIdFilter
        if (!CLIENT_ALLOWED_SCREENS.includes(screen)) {
          return { screen: "dashboard", clientId: clientIdFilter }
        }
        if ((screen === "job-detail" || screen === "candidates" || screen === "candidate-profile") && requestedClientId !== clientIdFilter) {
          return { screen: "clients", clientId: clientIdFilter }
        }
        const nextJobId = screen === "candidates"
          ? params?.jobId
          : screen === "job-detail" || screen === "candidate-profile"
            ? params?.jobId ?? prev.jobId
            : undefined
        return {
          screen,
          clientId: clientIdFilter,
          jobId: nextJobId,
          candidateId: params?.candidateId ?? prev.candidateId,
        }
      }

      return {
        screen,
        clientId: params?.clientId ?? prev.clientId,
        jobId: params?.jobId ?? prev.jobId,
        candidateId: params?.candidateId ?? prev.candidateId,
      }
    })
  }, [clientIdFilter, role])

  const setRole = useCallback((r: UserRole, clientId?: string) => {
    setRoleState(r)
    setClientIdFilter(r === "client" ? clientId : undefined)
    setNav({ screen: "dashboard" })
  }, [])

  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, msg }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
  }, [])

  const logout = useCallback(() => {
    setRoleState("admin")
    setClientIdFilter(undefined)
    setNav({ screen: "login" })
    toast("Signed out successfully")
  }, [toast])

  const toggleSidebar = useCallback(() => setSidebarCollapsed((value) => !value), [])

  return (
    <AppContext.Provider value={{ nav, go, toast, role, clientIdFilter, setRole, logout, sidebarCollapsed, toggleSidebar }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto flex items-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background shadow-lg">
            <svg className="size-4 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            {t.msg}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  )
}
