"use client"

import { useState } from "react"
import { useApp } from "../app-context"
import { useStore } from "../store"
import { Card, Button, StatusBadge, ScoreBadge } from "../ui-kit"
import { Icon } from "../icons"
import { activityFeed, PIPELINE_STAGES } from "@/lib/data"

const ACTIVITY_ICONS: Record<string, keyof typeof Icon> = {
  upload: "Upload",
  ai: "Ai",
  calendar: "Calendar",
  email: "Email",
  advance: "Advance",
}

const TYPE_ICONS: Record<string, keyof typeof Icon> = {
  Phone: "Phone",
  Video: "Video",
  "In-Person": "Pin",
}

const statToneClasses = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  green: "bg-green-50 text-green-700 ring-green-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
}

const stageBars = ["bg-slate-400", "bg-blue-500", "bg-indigo-500", "bg-amber-500", "bg-green-500"]
const DATE_FILTERS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "all", label: "All time" },
] as const

type DateRange = (typeof DATE_FILTERS)[number]["key"]

function cleanActivityText(text: string) {
  return text.replace(/â†’/g, "->").replace(/â€”/g, "-")
}

function percent(value: number, total: number) {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

export function Dashboard() {
  const { go, role, clientIdFilter } = useApp()
  const { clients, jobs, candidates, interviews, analyzer } = useStore()
  const [dateRange, setDateRange] = useState<DateRange>("week")

  const readonly = role === "client"
  const currentClient = readonly ? clients.find((client) => client.id === clientIdFilter) : null
  const allJobs = Object.values(jobs).flat()
  const visibleJobs = currentClient ? jobs[currentClient.id] || [] : allJobs
  const visibleInterviews = currentClient ? interviews.filter((item) => item.client === currentClient.name) : interviews
  const visibleAnalyzer = currentClient ? analyzer.filter((row) => row.client === currentClient.name) : analyzer

  const activeClients = clients.filter((client) => client.status === "Active").length
  const totalJobPositions = visibleJobs.length
  const openJobs = visibleJobs.filter((job) => job.status === "Open")
  const onHoldJobs = visibleJobs.filter((job) => job.status === "On Hold")
  const candidateCount = currentClient ? currentClient.candidates : clients.reduce((sum, client) => sum + client.candidates, 0)
  const pendingAssessments = visibleAnalyzer.filter((row) => row.status === "Pending").length
  const strongMatches = visibleAnalyzer.filter((row) => row.score >= 80).length
  const flaggedCandidates = visibleAnalyzer.filter((row) => row.flag).length
  const scoreValues = visibleAnalyzer.map((row) => row.score).filter((score) => typeof score === "number")
  const averageScore = scoreValues.length
    ? Math.round(scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length)
    : 0
  const interviewsAwaiting = visibleInterviews.filter((item) => item.status !== "Confirmed").length
  const screeningBacklog = visibleJobs.filter((job) => job.status === "Open" && (job.analyzed || 0) < (job.candidates || 0)).length

  const pipelineValues = currentClient
    ? currentClient.pipeline
    : PIPELINE_STAGES.map((stage) => candidates.filter((candidate) => candidate.stage === stage).length)
  const pipelineTotal = pipelineValues.reduce((sum, value) => sum + value, 0)
  const maxPipelineValue = Math.max(...pipelineValues, 1)
  const placementRate = percent(pipelineValues[4] || 0, pipelineValues[0] || pipelineTotal)

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const compactToday = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const stats = readonly
    ? [
        {
          label: "Job positions",
          value: totalJobPositions,
          helper: `${onHoldJobs.length} on hold`,
          icon: "Briefcase" as const,
          tone: "blue" as const,
          action: () => go("clients"),
        },
        {
          label: "Open jobs",
          value: openJobs.length,
          helper: "Currently accepting candidates",
          icon: "Check" as const,
          tone: "green" as const,
          action: () => go("clients"),
        },
        {
          label: "Total candidates",
          value: candidateCount,
          helper: "Profiles in your pipeline",
          icon: "Users" as const,
          tone: "slate" as const,
          action: () => go("candidates"),
        },
        {
          label: "Total assessments",
          value: visibleAnalyzer.length,
          helper: `${strongMatches} strong match${strongMatches === 1 ? "" : "es"}`,
          icon: "Ai" as const,
          tone: "amber" as const,
          action: () => go("reports"),
        },
        {
          label: "Pending assessment",
          value: pendingAssessments,
          helper: "Awaiting review",
          icon: "Upload" as const,
          tone: "blue" as const,
          action: () => go("reports"),
        },
      ]
    : [
        {
          label: "Total clients",
          value: clients.length,
          helper: "All customer accounts",
          icon: "Building" as const,
          tone: "blue" as const,
          action: () => go("clients"),
        },
        {
          label: "Active clients",
          value: activeClients,
          helper: "Clients currently hiring",
          icon: "Users" as const,
          tone: "green" as const,
          action: () => go("clients"),
        },
        {
          label: "Job positions",
          value: allJobs.length,
          helper: "Roles across all clients",
          icon: "Briefcase" as const,
          tone: "slate" as const,
          action: () => go("clients"),
        },
        {
          label: "Open jobs",
          value: openJobs.length,
          helper: "Currently accepting candidates",
          icon: "Check" as const,
          tone: "green" as const,
          action: () => go("clients"),
        },
        {
          label: "Total candidates",
          value: candidateCount,
          helper: "Profiles in the pipeline",
          icon: "Users" as const,
          tone: "slate" as const,
          action: () => go("candidates"),
        },
        {
          label: "Total assessments",
          value: visibleAnalyzer.length,
          helper: "CVs scored by AI",
          icon: "Ai" as const,
          tone: "amber" as const,
          action: () => go("ai-analyzer"),
        },
        {
          label: "Pending assessment",
          value: pendingAssessments,
          helper: `${flaggedCandidates} flagged for review`,
          icon: "Upload" as const,
          tone: "blue" as const,
          action: () => go("ai-analyzer"),
        },
      ]

  const focusItems = [
    {
      label: "Pending AI reviews",
      value: pendingAssessments,
      detail: `${strongMatches} strong matches are ready for shortlisting`,
      icon: "Ai" as const,
      tone: "blue" as const,
      action: () => go(readonly ? "reports" : "ai-analyzer"),
    },
    {
      label: "Interview confirmations",
      value: interviewsAwaiting,
      detail: `${visibleInterviews.length} interviews on the calendar`,
      icon: "Calendar" as const,
      tone: "amber" as const,
      action: () => go(readonly ? "reports" : "interview-scheduling"),
    },
    {
      label: "Screening backlog",
      value: screeningBacklog,
      detail: "Open roles where candidates still need analysis",
      icon: "Upload" as const,
      tone: "green" as const,
      action: () => go(readonly ? "clients" : "ai-analyzer"),
    },
  ]

  const clientRows = readonly && currentClient ? [currentClient] : clients
  const recentActivity = readonly && currentClient
    ? activityFeed.filter((item) => item.text.includes(currentClient.name))
    : activityFeed
  const rangeLabel = DATE_FILTERS.find((filter) => filter.key === dateRange)?.label || "This week"
  const rangeLimit: Record<DateRange, number> = { today: 2, week: 4, month: 6, all: 999 }
  const visibleRecentActivity = recentActivity.slice(0, rangeLimit[dateRange])
  const filteredInterviews = visibleInterviews.slice(0, rangeLimit[dateRange])

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="space-y-4">
        <div className="space-y-4">
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              <Icon.Dashboard className="size-3.5 text-primary" />
              {readonly ? "Client view" : "Admin view"}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {currentClient ? `${currentClient.name} dashboard` : "Recruiting command center"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {currentClient
                ? `Pipeline visibility for ${currentClient.name}, including active roles, interview status, and candidate progress.`
                : "A focused view of client demand, candidate flow, AI review status, and the work that needs attention next."}
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-card text-primary shadow-sm">
                  <Icon.Calendar className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Dashboard date</p>
                  <p className="truncate text-sm font-semibold text-foreground" title={today}>{compactToday}</p>
                </div>
              </div>
              <div className="inline-flex w-full overflow-hidden rounded-lg border border-border bg-muted p-0.5 md:w-auto">
                {DATE_FILTERS.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setDateRange(filter.key)}
                    className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition md:flex-none ${
                      dateRange === filter.key
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <span className="rounded-lg bg-accent px-3 py-2 text-center text-xs font-semibold text-accent-foreground sm:text-left">
                Showing {rangeLabel.toLowerCase()}
              </span>
              {!readonly && (
                <Button variant="outline" onClick={() => go("interview-scheduling")} className="min-h-11 w-full sm:w-auto">
                  <Icon.Calendar className="size-4" />
                  Interviews
                </Button>
              )}
              {readonly && (
                <Button variant="outline" onClick={() => go("clients")} className="min-h-11 w-full sm:w-auto">
                  <Icon.Briefcase className="size-4" />
                  Jobs
                </Button>
              )}
              <Button onClick={() => go(readonly ? "reports" : "ai-analyzer")} className="min-h-11 w-full sm:w-auto">
                {readonly ? <Icon.Reports className="size-4" /> : <Icon.Upload className="size-4" />}
                {readonly ? "Reports" : "Review CVs"}
              </Button>
            </div>
          </div>
        </div>

        <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${readonly ? "xl:grid-cols-5" : "xl:grid-cols-4"}`}>
          {stats.map((stat) => {
            const IconComp = Icon[stat.icon]
            return (
              <button
                key={stat.label}
                type="button"
                onClick={stat.action}
                className="group min-h-[148px] rounded-lg border border-border bg-card p-4 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{stat.value}</p>
                  </div>
                  <span className={`grid size-10 shrink-0 place-items-center rounded-lg ring-1 ${statToneClasses[stat.tone]}`}>
                    <IconComp className="size-5" />
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <p className="text-sm leading-5 text-muted-foreground">{stat.helper}</p>
                  <Icon.ChevronRight className="mb-0.5 size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pipeline health</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Candidate stage distribution</h2>
            </div>
            <Button variant="outline" onClick={() => go("candidates")} className="w-full sm:w-auto">
              <Icon.Users className="size-4" />
              View pipeline
            </Button>
          </div>

          <div className="mt-5 space-y-4">
            {PIPELINE_STAGES.map((stage, index) => {
              const value = pipelineValues[index] || 0
              const width = percent(value, maxPipelineValue)
              return (
                <div key={stage} className="grid gap-2 sm:grid-cols-[112px_1fr_56px] sm:items-center">
                  <div className="flex items-center justify-between gap-3 sm:block">
                    <p className="text-sm font-medium text-foreground">{stage}</p>
                    <p className="text-xs text-muted-foreground sm:hidden">{value}</p>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${stageBars[index]}`} style={{ width: `${width}%` }} />
                  </div>
                  <p className="hidden text-right text-sm font-semibold tabular-nums text-foreground sm:block">{value}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-6 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total flow</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{pipelineTotal}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Placement rate</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{placementRate}%</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Offer stage</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{pipelineValues[3] || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Priority actions</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Today's focus</h2>
            </div>
            <span className="rounded-full bg-warning/15 px-2.5 py-1 text-xs font-medium text-[#9a6700]">Live</span>
          </div>

          <div className="mt-4 divide-y divide-border">
            {focusItems.map((item) => {
              const IconComp = Icon[item.icon]
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  className="group flex w-full items-start gap-3 py-4 text-left first:pt-0 last:pb-0"
                >
                  <span className={`grid size-9 shrink-0 place-items-center rounded-lg ring-1 ${statToneClasses[item.tone]}`}>
                    <IconComp className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-foreground">{item.label}</span>
                      <span className="text-sm font-semibold tabular-nums text-foreground">{item.value}</span>
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">{item.detail}</span>
                  </span>
                  <Icon.ChevronRight className="mt-2 size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                </button>
              )
            })}
          </div>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {currentClient ? "Open roles" : "Client workload"}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                {currentClient ? `${currentClient.name} hiring activity` : "Active account overview"}
              </h2>
            </div>
            <Button variant="outline" onClick={() => go("clients")} className="w-full sm:w-auto">
              <Icon.ExternalLink className="size-4" />
              {currentClient ? "Open jobs" : "Open clients"}
            </Button>
          </div>

          {currentClient ? (
            <div className="divide-y divide-border">
              {visibleJobs.filter((job) => job.status !== "Closed").map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => go("job-detail", { clientId: currentClient.id, jobId: job.id })}
                  className="group grid w-full gap-3 px-4 py-4 text-left transition hover:bg-muted/70 sm:grid-cols-[1fr_auto] sm:items-center sm:px-5"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-foreground">{job.title}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{job.department} - {job.location}</span>
                  </span>
                  <span className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <StatusBadge status={job.status} />
                    <span className="text-xs text-muted-foreground">
                      <span className="font-semibold tabular-nums text-foreground">{job.analyzed || 0}</span> of {job.candidates || 0} screened
                    </span>
                    <Icon.ChevronRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3">Client</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Jobs</th>
                    <th className="px-5 py-3 text-right">Candidates</th>
                    <th className="px-5 py-3">Last activity</th>
                    <th className="px-5 py-3 text-right">Pipeline</th>
                  </tr>
                </thead>
                <tbody>
                  {clientRows.map((client, index) => {
                    const clientJobs = jobs[client.id] || []
                    const clientOpenJobs = clientJobs.filter((job) => job.status === "Open").length
                    const clientPipelineTotal = client.pipeline.reduce((sum, value) => sum + value, 0)
                    return (
                      <tr
                        key={client.id}
                        className={`border-b border-border last:border-0 transition hover:bg-muted ${index % 2 ? "bg-muted/30" : ""}`}
                      >
                        <td className="px-5 py-3">
                          <button
                            type="button"
                            onClick={() => go("client-folder", { clientId: client.id })}
                            className="font-medium text-primary hover:underline"
                          >
                            {client.name}
                          </button>
                          <p className="mt-0.5 text-xs text-muted-foreground">{client.industry}</p>
                        </td>
                        <td className="px-5 py-3"><StatusBadge status={client.status} /></td>
                        <td className="px-5 py-3 text-right tabular-nums">{clientOpenJobs}</td>
                        <td className="px-5 py-3 text-right tabular-nums">{client.candidates}</td>
                        <td className="px-5 py-3 text-muted-foreground">{client.lastActivity}</td>
                        <td className="px-5 py-3">
                          <div className="ml-auto flex h-2 w-32 overflow-hidden rounded-full bg-muted">
                            {client.pipeline.map((value, stageIndex) => (
                              <span
                                key={PIPELINE_STAGES[stageIndex]}
                                className={stageBars[stageIndex]}
                                style={{ width: `${percent(value, clientPipelineTotal)}%` }}
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Upcoming interviews</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Next scheduled</h2>
            </div>
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
              {filteredInterviews.length} shown
            </span>
          </div>

          <div className="mt-4 divide-y divide-border">
            {filteredInterviews.map((interview) => {
              const IconComp = Icon[TYPE_ICONS[interview.type]]
              return (
                <div key={interview.id} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-green-50 text-green-700 ring-1 ring-green-100">
                    <IconComp className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate text-sm font-semibold text-foreground">{interview.name}</p>
                      <StatusBadge status={interview.status} />
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{interview.job} - {interview.client}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{interview.date} at {interview.time} ({interview.duration})</p>
                  </div>
                </div>
              )
            })}
            {filteredInterviews.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">No interviews for this date range.</div>
            )}
          </div>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">AI review</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Screening quality</h2>
            </div>
            <Button variant="outline" onClick={() => go(readonly ? "reports" : "ai-analyzer")} className="shrink-0">
              <Icon.Ai className="size-4" />
              Review
            </Button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Average</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{averageScore}%</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Strong matches</p>
              <p className="mt-2 text-2xl font-semibold text-success">{strongMatches}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Flagged</p>
              <p className="mt-2 text-2xl font-semibold text-[#9a6700]">{flaggedCandidates}</p>
            </div>
          </div>

          <div className="mt-4 divide-y divide-border">
            {visibleAnalyzer.slice(0, 4).map((row) => (
              <div key={row.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{row.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{row.job} - {row.client}</p>
                </div>
                <ScoreBadge score={row.score} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Recent activity</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Live updates</h2>
            </div>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">Latest</span>
          </div>

          <div className="mt-4 divide-y divide-border">
            {visibleRecentActivity.map((item, index) => {
              const IconComp = Icon[ACTIVITY_ICONS[item.type]]
              return (
                <div key={`${item.time}-${index}`} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                    <IconComp className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-5 text-foreground">{cleanActivityText(item.text)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </section>
    </div>
  )
}
