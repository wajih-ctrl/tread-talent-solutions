"use client"

import { useEffect, useState } from "react"
import { Card, ScoreBadge, Flag, Select, Button } from "../ui-kit"
import { useApp } from "../app-context"
import { useStore } from "../store"
import { Icon } from "../icons"

export function AIAnalyzer() {
  const { nav, toast } = useApp()
  const { analyzer, setAnalyzer } = useStore()
  const [jobFilter, setJobFilter] = useState("All")
  const [clientFilter, setClientFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState<string>(nav.aiStatus || "All")
  const [minScore, setMinScore] = useState(0)
  const [reanalyzing, setReanalyzing] = useState(false)

  useEffect(() => {
    setStatusFilter(nav.aiStatus || "All")
  }, [nav.aiStatus])

  const jobs = ["All", ...Array.from(new Set(analyzer.map((r) => r.job)))]
  const clients = ["All", ...Array.from(new Set(analyzer.map((r) => r.client)))]
  const statuses = ["All", ...Array.from(new Set(analyzer.map((r) => r.status)))]

  const filtered = analyzer.filter(
    (r) =>
      (jobFilter === "All" || r.job === jobFilter) &&
      (clientFilter === "All" || r.client === clientFilter) &&
      (statusFilter === "All" || r.status === statusFilter) &&
      r.score >= minScore,
  )

  function setStatus(id: string, status: string) {
    setAnalyzer((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    toast(`Candidate ${status.toLowerCase()}`)
  }

  function reanalyze() {
    setReanalyzing(true)
    setTimeout(() => {
      setReanalyzing(false)
      toast("Re-analysis complete — scores updated")
    }, 1400)
  }

  const avg = Math.round(filtered.reduce((s, r) => s + r.score, 0) / (filtered.length || 1))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">AI CV Analyzer</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Automated scoring across all active jobs against screening criteria.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => document.getElementById('resume-upload')?.click()}>
            <Icon.Upload className="size-4" />
            Upload Resume
          </Button>
          <input id="resume-upload" type="file" accept=".pdf,.doc,.docx" hidden onChange={(e) => { if (e.target.files?.[0]) toast(`Resume "${e.target.files[0].name}" uploaded and queued for analysis`) }} />
          <Button onClick={reanalyze} disabled={reanalyzing}>
            {reanalyzing ? "Analyzing…" : "Re-run Analysis"}
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total Analyzed</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{filtered.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Average Score</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{avg}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Strong Matches (80+)</p>
          <p className="mt-1 text-2xl font-semibold text-success">{filtered.filter((r) => r.score >= 80).length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Flagged</p>
          <p className="mt-1 text-2xl font-semibold text-warning">{filtered.filter((r) => r.flag).length}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="flex flex-wrap items-end gap-4 p-4">
        <div className="w-full rounded-lg bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground">
          Current filter: status is {statusFilter}, job is {jobFilter}, client is {clientFilter}, minimum score is {minScore}.
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Filter by job</label>
          <Select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)} className="w-48">
            {jobs.map((j) => (
              <option key={j}>{j}</option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Filter by client</label>
          <Select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)} className="w-48">
            {clients.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Filter by assessment status</label>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </div>
        <div className="min-w-[220px] flex-1">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Filter by minimum score: {minScore}</label>
          <input
            type="range"
            min={0}
            max={100}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
          />
        </div>
      </Card>

      {/* Results table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Job</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">AI Reasoning</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Flag</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-foreground">{r.job}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.client}</td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={r.score} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.reason}</td>
                  <td className="px-4 py-3 text-foreground font-medium">{r.status}</td>
                  <td className="px-4 py-3">
                    <Flag flag={r.flag} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setStatus(r.id, "Accepted")}
                        className="rounded-md border border-success/40 px-2 py-1 text-xs font-medium text-success transition hover:bg-success/10"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setStatus(r.id, "Rejected")}
                        className="rounded-md border border-danger/40 px-2 py-1 text-xs font-medium text-danger transition hover:bg-danger/10"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">No candidates match your filters. Try lowering the minimum score.</div>
        )}
      </Card>
    </div>
  )
}
