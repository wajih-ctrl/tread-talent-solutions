"use client"

import { useState } from "react"
import { useApp } from "../app-context"
import { useStore } from "../store"
import { Breadcrumbs } from "../login"
import { Card, StageBadge, ScoreBadge, Flag, Button, Modal, Select, TextInput, Field } from "../ui-kit"
import { Icon } from "../icons"

function emailFor(name: string) {
  const parts = name.toLowerCase().replace(/[^a-z ]/g, "").split(" ")
  return `${parts[0]}.${parts[1] || "candidate"}@email.com`
}

// Deterministic-ish date label from the "added" string
function dateFor(added: string) {
  const map: Record<string, string> = {
    "just now": "Today",
    "1 day ago": "11 Jun 2026",
    "2 days ago": "10 Jun 2026",
    "3 days ago": "09 Jun 2026",
    "4 days ago": "08 Jun 2026",
    "5 days ago": "07 Jun 2026",
  }
  return map[added] || added
}

// AI auto-decision based on score
function aiDecision(score: number) {
  if (score === 0) return { label: "Analyzing", cls: "bg-muted text-muted-foreground" }
  if (score >= 80) return { label: "Accept", cls: "bg-success/15 text-success" }
  if (score >= 60) return { label: "Review", cls: "bg-warning/15 text-[#9a6700]" }
  return { label: "Reject", cls: "bg-danger/15 text-danger" }
}

export function Candidates() {
  const { nav, go, role, clientIdFilter, toast } = useApp()
  const { clients, jobs, candidates, setCandidates, analyzer } = useStore()
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState("All")
  const [scoreFilter, setScoreFilter] = useState("All")
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", email: "", stage: "Applied" })

  const readonly = role === "client"
  const effectiveClientId = readonly ? clientIdFilter : nav.clientId
  const client = clients.find((c) => c.id === effectiveClientId)
  const job = (jobs[effectiveClientId || ""] || []).find((j) => j.id === nav.jobId)
  const clientAnalyzerRows = readonly && client
    ? analyzer.filter((row) => row.client === client.name && (!job || row.job === job.title))
    : []
  const clientCandidateNames = new Set(clientAnalyzerRows.map((row) => row.name))
  const clientCandidates = readonly
    ? candidates.filter((candidate) => clientCandidateNames.has(candidate.name))
    : candidates
  const analyzerOnlyCandidates = readonly
    ? clientAnalyzerRows
        .filter((row) => !clientCandidates.some((candidate) => candidate.name === row.name))
        .map((row) => ({
          id: `analyzer-${row.id}`,
          name: row.name,
          score: row.score,
          stage: row.status === "Rejected" ? "Rejected" : row.status === "Accepted" ? "Screened" : "Applied",
          summary: row.reason,
          flag: row.flag,
          added: "2 days ago",
        }))
    : []
  const visibleCandidates = readonly ? [...clientCandidates, ...analyzerOnlyCandidates] : candidates

  const filtered = visibleCandidates.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    if (stageFilter !== "All" && c.stage !== stageFilter) return false
    if (scoreFilter === "80%+" && c.score < 80) return false
    if (scoreFilter === "60-79%" && (c.score < 60 || c.score >= 80)) return false
    if (scoreFilter === "Below 60%" && c.score >= 60) return false
    return true
  })

  const setStage = (id: string, stage: string) =>
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, stage } : c)))

  const removeCandidate = (id: string, name: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id))
    toast(`${name} removed`)
  }

  const addCandidate = () => {
    if (!form.name.trim()) {
      toast("Please enter a candidate name")
      return
    }
    if (editId) {
      setCandidates((prev) => prev.map((c) => c.id === editId ? { ...c, name: form.name.trim() } : c))
      toast(`${form.name.trim()} updated`)
      setEditId(null)
    } else {
      const id = `new${Date.now()}`
      setCandidates((prev) => [
        { id, name: form.name.trim(), score: 0, stage: form.stage, summary: "Pending AI analysis", flag: null, added: "just now" },
        ...prev,
      ])
      toast(`${form.name.trim()} added`)
    }
    setForm({ name: "", email: "", stage: "Applied" })
    setAddOpen(false)
  }

  const uploadResume = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return

    const nameFromFile = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
    const candidateName = nameFromFile || "Uploaded Resume"

    setCandidates((prev) => [
      {
        id: `resume-${Date.now()}`,
        name: candidateName,
        score: 0,
        stage: "Applied",
        summary: "Resume uploaded and queued for AI analysis",
        flag: null,
        added: "just now",
      },
      ...prev,
    ])
    toast(`Resume "${file.name}" uploaded and queued for analysis`)
  }

  const openEdit = (c: any) => {
    setEditId(c.id)
    setForm({ name: c.name, email: emailFor(c.name), stage: c.stage })
    setAddOpen(true)
  }

  const crumbs = client && job
    ? [
        { label: readonly ? "Jobs" : "Clients", onClick: () => go("clients") },
        ...(readonly ? [] : [{ label: client.name, onClick: () => go("client-folder", { clientId: client.id }) }]),
        { label: job.title, onClick: () => go("job-detail", { clientId: client.id, jobId: job.id }) },
        { label: "Candidates" },
      ]
    : readonly && client
      ? [{ label: "Jobs", onClick: () => go("clients") }, { label: `${client.name} candidates` }]
      : [{ label: "Candidates" }]

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <Breadcrumbs items={crumbs} />
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground truncate">
            {job ? `${job.title} — Candidates` : "Candidates"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {filtered.length} candidate{filtered.length === 1 ? "" : "s"}
            {job ? ` for this position` : readonly && client ? ` for ${client.name}` : ""}
          </p>
        </div>
        {!readonly && (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button variant="outline" className="w-full shrink-0 sm:w-auto" onClick={() => document.getElementById("candidate-resume-upload")?.click()}>
              <Icon.Upload className="size-4" /> Upload Resume
            </Button>
            <input
              id="candidate-resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              hidden
              onChange={(e) => {
                uploadResume(e.target.files)
                e.target.value = ""
              }}
            />
            <Button className="w-full shrink-0 sm:w-auto" onClick={() => setAddOpen(true)}>
              <Icon.Plus className="size-4" /> Add Candidate
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="flex flex-1 flex-col gap-2 sm:max-w-xs">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Filter by candidate name</label>
            <div className="relative">
              <Icon.Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidates" className="w-full pl-8 text-sm" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Filter by stage</label>
            <Select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="sm:w-40 text-sm">
              <option>All</option><option>Applied</option><option>Screened</option><option>Interview</option><option>Offer</option><option>Placed</option><option>Rejected</option>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Filter by score</label>
            <Select value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value)} className="sm:w-40 text-sm">
              <option>All</option><option>80%+</option><option>60-79%</option><option>Below 60%</option>
            </Select>
          </div>
          <button onClick={() => { setSearch(""); setStageFilter("All"); setScoreFilter("All") }} className="whitespace-nowrap text-sm font-medium text-primary hover:underline sm:ml-auto">Clear filters</button>
        </div>
      </Card>

      {/* Candidates: table on desktop, cards on mobile */}
      {filtered.length === 0 ? (
        <Card className="py-16 text-center text-sm text-muted-foreground">No candidates match your filters.</Card>
      ) : (
        <>
          {/* Desktop / tablet table */}
          <Card className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3">Candidate</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Score</th>
                  <th className="px-5 py-3">AI Check</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const ai = aiDecision(c.score)
                  return (
                    <tr key={c.id} className={`border-b border-border last:border-0 hover:bg-muted ${i % 2 ? "bg-muted/30" : ""}`}>
                      <td className="px-5 py-3">
                        <button onClick={() => go("candidate-profile", { candidateId: c.id })} className="font-medium text-primary hover:underline">{c.name}</button>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{emailFor(c.name)}</td>
                      <td className="px-5 py-3"><StageBadge stage={c.stage} /></td>
                      <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{dateFor(c.added)}</td>
                      <td className="px-5 py-3">{c.score > 0 ? <ScoreBadge score={c.score} /> : <span className="text-xs text-muted-foreground">—</span>}</td>
                      <td className="px-5 py-3"><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ai.cls}`}>{ai.label}</span></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => go("candidate-profile", { candidateId: c.id })} aria-label="View" title="View" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Icon.Eye className="size-4" /></button>
                          {!readonly && (
                            <>
                              <button onClick={() => openEdit(c)} aria-label="Edit" title="Edit" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Icon.Edit className="size-4" /></button>
                              <button onClick={() => removeCandidate(c.id, c.name)} aria-label="Delete" title="Delete" className="rounded-md p-1.5 text-danger hover:bg-danger/10"><Icon.Trash className="size-4" /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>

          {/* Mobile cards */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filtered.map((c) => {
              const ai = aiDecision(c.score)
              return (
                <Card key={c.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <button onClick={() => go("candidate-profile", { candidateId: c.id })} className="font-medium text-primary hover:underline truncate block max-w-full text-left">{c.name}</button>
                      <p className="text-xs text-muted-foreground truncate">{emailFor(c.name)}</p>
                    </div>
                    {c.score > 0 ? <ScoreBadge score={c.score} /> : <span className="text-xs text-muted-foreground">—</span>}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StageBadge stage={c.stage} />
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ai.cls}`}>AI: {ai.label}</span>
                    <span className="text-xs text-muted-foreground">{dateFor(c.added)}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                    <Button variant="outline" className="flex-1 py-1.5 text-xs" onClick={() => go("candidate-profile", { candidateId: c.id })}><Icon.Eye className="size-3.5" /> View</Button>
                    {!readonly && (
                      <>
                        <Button variant="outline" className="flex-1 py-1.5 text-xs" onClick={() => openEdit(c)}><Icon.Edit className="size-3.5" /> Edit</Button>
                        <Button variant="outline" className="py-1.5 text-xs text-danger" onClick={() => removeCandidate(c.id, c.name)} aria-label="Delete"><Icon.Trash className="size-3.5" /></Button>
                      </>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* Add candidate modal - Admin only */}
      {!readonly && (
      <Modal open={addOpen} onClose={() => { setAddOpen(false); setEditId(null); setForm({ name: "", email: "", stage: "Applied" }) }} title={editId ? "Edit Candidate" : "Add Candidate"}>
        <div className="space-y-4">
          <Field label="Full Name" required>
            <TextInput value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Jordan Avery" />
          </Field>
          <Field label="Email">
            <TextInput type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="name@email.com" />
          </Field>
          <Field label="Initial Stage">
            <Select value={form.stage} onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value }))}>
              <option>Applied</option><option>Screened</option><option>Interview</option><option>Offer</option>
            </Select>
          </Field>
          <p className="text-xs text-muted-foreground">The candidate will be queued for AI analysis, which will auto-recommend Accept or Reject based on the screening criteria.</p>
        </div>
        <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button variant="outline" onClick={() => { setAddOpen(false); setEditId(null); setForm({ name: "", email: "", stage: "Applied" }) }}>Cancel</Button>
          <Button onClick={addCandidate}>{editId ? "Update Candidate" : "Add Candidate"}</Button>
        </div>
      </Modal>
      )}
    </div>
  )
}
