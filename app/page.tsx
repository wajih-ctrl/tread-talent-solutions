"use client"

import { AppProvider, useApp } from "@/components/app-context"
import { StoreProvider } from "@/components/store"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Login } from "@/components/login"
import { Dashboard } from "@/components/screens/dashboard"
import { Clients } from "@/components/screens/clients"
import { ClientFolder } from "@/components/screens/client-folder"
import { JobDetail } from "@/components/screens/job-detail"
import { Candidates } from "@/components/screens/candidates"
import { CandidateProfile } from "@/components/screens/candidate-profile"
import { InterviewScheduling } from "@/components/screens/interview-scheduling"
import { AIAnalyzer } from "@/components/screens/ai-analyzer"
import { EmailAutomation } from "@/components/screens/email-automation"
import { Reports } from "@/components/screens/reports"

function Shell() {
  const { nav } = useApp()

  if (nav.screen === "login") return <Login />

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex md:shrink-0"><Sidebar /></div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {nav.screen === "dashboard" && <Dashboard />}
          {nav.screen === "clients" && <Clients />}
          {nav.screen === "client-folder" && <ClientFolder />}
          {nav.screen === "job-detail" && <JobDetail />}
          {nav.screen === "candidates" && <Candidates />}
          {nav.screen === "candidate-profile" && <CandidateProfile />}
          {nav.screen === "interview-scheduling" && <InterviewScheduling />}
          {nav.screen === "ai-analyzer" && <AIAnalyzer />}
          {nav.screen === "email-automation" && <EmailAutomation />}
          {nav.screen === "reports" && <Reports />}
        </main>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </AppProvider>
  )
}
