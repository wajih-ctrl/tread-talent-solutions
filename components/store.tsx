"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import {
  clientsSeed, jobsSeed, candidatesSeed, upcomingInterviewsSeed,
  analyzerSeed, templatesSeed, automationRulesSeed,
} from "@/lib/data"

type StoreContextType = ReturnType<typeof useStoreState>

const StoreContext = createContext<StoreContextType | null>(null)

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}

function useStoreState() {
  const [clients, setClients] = useState(clientsSeed)
  const [jobs, setJobs] = useState<Record<string, any[]>>(jobsSeed)
  const [candidates, setCandidates] = useState(candidatesSeed)
  const [interviews, setInterviews] = useState(upcomingInterviewsSeed)
  const [analyzer, setAnalyzer] = useState(analyzerSeed)
  const [templates, setTemplates] = useState(templatesSeed)
  const [rules, setRules] = useState(automationRulesSeed)

  return {
    clients, setClients, jobs, setJobs, candidates, setCandidates,
    interviews, setInterviews, analyzer, setAnalyzer,
    templates, setTemplates, rules, setRules,
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const state = useStoreState()
  return <StoreContext.Provider value={state}>{children}</StoreContext.Provider>
}
