// Role-based data filtering for Tread Talent Solutions

import type { UserRole } from "@/components/app-context"

export function filterDataByRole(
  clients: any[],
  jobs: Record<string, any[]>,
  candidates: any[],
  role: UserRole,
  clientIdFilter?: string
) {
  if (role === "admin") {
    // Admin sees everything
    return { clients, jobs, candidates }
  }

  // Client role sees only their own data
  if (!clientIdFilter) {
    return { clients: [], jobs: {}, candidates: [] }
  }

  const filteredClients = clients.filter((c) => c.id === clientIdFilter)
  const filteredJobs = {
    [clientIdFilter]: jobs[clientIdFilter] || [],
  }

  // For client view, we'll show all candidates but in the real app,
  // we'd filter by which job they applied to
  return {
    clients: filteredClients,
    jobs: filteredJobs,
    candidates, // In real app, filter by job
  }
}

export function isReadOnly(role: UserRole): boolean {
  return role === "client"
}
