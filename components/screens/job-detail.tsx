"use client"

import { useEffect, useState } from "react"
import { useApp } from "../app-context"
import { useStore } from "../store"
import { Breadcrumbs } from "../login"
import { Card, CardLabel, StatusBadge, Button, Toggle, Modal } from "../ui-kit"
import { Icon } from "../icons"
import { defaultCriteria } from "@/lib/data"

const WEIGHT_COLORS: Record<string, string> = { Low: "bg-slate-100 text-slate-600", Medium: "bg-blue-100 text-blue-700", High: "bg-indigo-100 text-indigo-700" }

export function JobDetail() {
  const { nav, go, role, toast } = useApp()
  const { clients, jobs, setCandidates } = useStore()
  const [autoAnalyze, setAutoAnalyze] = useState(true)
  const [excelModal, setExcelModal] = useState(false)
  const [linkModal, setLinkModal] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [publicUrl, setPublicUrl] = useState("")

  const readonly = role === "client"
  const client = clients.find((c) => c.id === nav.clientId)
  const job = (jobs[nav.clientId || ""] || []).find((j) => j.id === nav.jobId)
  if (!client || !job) return <p className="text-sm text-muted-foreground">Job not found.</p>

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPublicUrl(`${window.location.origin}/apply/${job.id}`)
    }
  }, [job.id])

  const criteria = job.criteria || defaultCriteria
  const stats = { analyzed: 8, shortlisted: 3, rejected: 2, pending: 3 }

  const runAnalysis = () => {
    setAnalyzing(true)
    setTimeout(() => { setAnalyzing(false); toast("AI analysis complete — 8 candidates scored") }, 1500)
  }

  const uploadCv = () => {
    const id = `up${Date.now()}`
    setCandidates((prev) => [{ id, name: "New Upload (CV.pdf)", score: 0, stage: "Applied", summary: "Pending AI analysis", flag: null, added: "just now" }, ...prev])
    toast("CV uploaded — queued for analysis")
  }

  const importExcel = () => {
    const names = ["Aisha Khan", "Robert Hughes", "Mei Lin"]
    setCandidates((prev) => [...names.map((n, i) => ({ id: `xl${Date.now()}-${i}`, name: n, score: 65 + i * 5, stage: "Applied", summary: "Imported from Excel", flag: null, added: "just now" })), ...prev])
    setExcelModal(false)
    toast("3 candidates imported")
  }

  const viewCandidates = () => go("candidates", { clientId: client.id, jobId: job.id })
  const breadcrumbs = readonly
    ? [{ label: "Jobs", onClick: () => go("clients") }, { label: job.title }]
    : [{ label: "Clients", onClick: () => go("clients") }, { label: client.name, onClick: () => go("client-folder", { clientId: client.id }) }, { label: job.title }]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with breadcrumb + View Candidates action */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">{job.title}</h2>
            <StatusBadge status={job.status} />
            <span className="rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground whitespace-nowrap">{job.department}</span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto shrink-0">
          {readonly ? (
            <>
              <Button className="w-full lg:w-auto" onClick={viewCandidates}>
                <Icon.Clients className="size-4" /> View Candidates
                <span className="ml-1 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-semibold">{job.candidates}</span>
              </Button>
              <Button variant="outline" className="w-full lg:w-auto" onClick={() => go("clients")}>
                <Icon.Briefcase className="size-4" /> Back to Jobs
              </Button>
            </>
          ) : (
            <Button className="w-full lg:w-auto" onClick={viewCandidates}>
              <Icon.Clients className="size-4" /> View Candidates
              <span className="ml-1 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-semibold">{job.candidates}</span>
            </Button>
          )}
          {!readonly && (
            <Button variant="outline" className="w-full lg:w-auto" onClick={() => setLinkModal(true)}>
              <Icon.Link className="size-4" /> Get Application Link
            </Button>
          )}
        </div>
      </div>

      {/* Job Overview */}
      <Card className="p-4 sm:p-6">
        <CardLabel className="text-base font-semibold">Job Overview</CardLabel>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-4 text-sm">
          {[["Location", job.location], ["Type", job.type], ["Salary", job.salary], ["Target Start", job.targetStart], ["Created", job.created]].map(([l, v]) => (
            <div key={l} className="min-w-0">
              <CardLabel className="text-[11px]">{l}</CardLabel>
              <p className="mt-1 font-medium text-foreground break-words">{v}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Job Description */}
      <Card className="p-4 sm:p-6">
        <CardLabel className="text-base font-semibold">Job Description</CardLabel>
        <p className="mt-3 text-sm leading-relaxed text-foreground">{job.description}</p>
      </Card>

      {/* Qualifications & Screening Criteria */}
      <Card className="p-4 sm:p-6">
        <CardLabel className="text-base font-semibold">Qualifications</CardLabel>
        <div className="mt-4 flex flex-wrap gap-2">
          {criteria.map((c: any) => (
            <span key={c.id} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground">
              <span>{c.label}</span>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium shrink-0 ${WEIGHT_COLORS[c.weight]}`}>{c.weight}</span>
              {c.required && <span className="rounded bg-danger/10 px-1.5 py-0.5 text-[10px] font-medium text-danger shrink-0">Required</span>}
            </span>
          ))}
        </div>
      </Card>

      {/* Join Us / AI Analyzer + CV Intake - Only for Admin */}
      {!readonly && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4 sm:p-6">
            <h3 className="text-base font-semibold text-foreground">Join Us</h3>
            <div className="space-y-4 text-sm text-foreground">
              <div>
                <p className="font-medium mb-2">About This Role</p>
                <p className="leading-relaxed text-muted-foreground">We are looking for a talented {job.title} to join our growing team. You will play a key role in developing and maintaining our core systems, working closely with a diverse group of engineers and product specialists.</p>
              </div>
              <div>
                <p className="font-medium mb-2">What We Offer</p>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Competitive salary: {job.salary}</li>
                  <li>Remote-first working environment</li>
                  <li>Professional development opportunities</li>
                  <li>Collaborative and innovative team culture</li>
                  <li>Flexible working hours</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* CV Intake */}
          <Card className="p-4 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold text-foreground">CV Intake</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button onClick={uploadCv} className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border py-8 px-3 text-center transition-colors hover:border-primary hover:bg-accent/40">
                <Icon.Upload className="size-6 text-primary" />
                <span className="text-sm font-medium text-foreground">Upload CV (PDF)</span>
                <span className="text-xs text-muted-foreground">Drag & drop or click</span>
              </button>
              <button onClick={() => setExcelModal(true)} className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border py-8 px-3 text-center transition-colors hover:border-primary hover:bg-accent/40">
                <Icon.Inbox className="size-6 text-primary" />
                <span className="text-sm font-medium text-foreground">Import from Excel</span>
                <span className="text-xs text-muted-foreground">Bulk import records</span>
              </button>
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" onClick={viewCandidates}>View all candidates</Button>
            </div>
          </Card>
        </div>

        {/* AI Analyzer Sidebar */}
        <Card className="p-4 sm:p-6 h-fit">
          <h3 className="text-sm font-semibold text-foreground">AI CV Analyzer</h3>
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="text-sm text-foreground">Auto-Analyze New CVs</span>
            <Toggle checked={autoAnalyze} onChange={setAutoAnalyze} />
          </div>
          <Button className="mt-4 w-full" onClick={runAnalysis} disabled={analyzing}>
            <Icon.Ai className="size-4" /> {analyzing ? "Analyzing…" : "Run AI Analysis"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">Last analyzed: Today, 11:42 AM</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
            {[["Analyzed", stats.analyzed, "text-foreground"], ["Shortlisted", stats.shortlisted, "text-success"], ["Rejected", stats.rejected, "text-danger"], ["Pending", stats.pending, "text-[#9a6700]"]].map(([l, v, c]) => (
              <div key={l as string} className="rounded-lg border border-border p-3">
                <div className={`text-xl font-semibold ${c}`}>{v}</div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      )}

      {!readonly && (
      <>
      <Modal open={excelModal} onClose={() => setExcelModal(false)} title="Import Candidates from Excel">
        <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border py-10 text-center">
          <Icon.Inbox className="size-7 text-primary" />
          <span className="text-sm font-medium text-foreground">Drag & drop your .xlsx file</span>
          <button className="text-xs font-medium text-primary hover:underline" onClick={() => toast("Template downloaded")}>Download template</button>
        </div>
        <div className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button variant="outline" onClick={() => setExcelModal(false)}>Cancel</Button>
          <Button onClick={importExcel}>Import 3 Records</Button>
        </div>
      </Modal>

      <Modal open={linkModal} onClose={() => setLinkModal(false)} title="Share Application Link">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Share this link to accept applications for this position. The link can be posted on Indeed, LinkedIn, email, or your website.</p>
          
          <div className="rounded-lg bg-muted/50 border border-border p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">APPLICATION LINK</p>
            <div className="flex items-center gap-2">
              <input type="text" readOnly value={publicUrl} className="flex-1 rounded-lg border border-input bg-card px-3 py-2 text-sm font-mono text-foreground" />
              <Button variant="outline" className="shrink-0" onClick={() => { navigator.clipboard.writeText(publicUrl); toast("Link copied to clipboard") }}>
                <Icon.Copy className="size-4" />
              </Button>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-200">
            <p className="text-xs font-medium text-blue-900 mb-1">Preview</p>
            <p className="text-xs text-blue-800">Candidates will see the job posting and application form when they visit this link.</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => { window.open(publicUrl, "_blank"); toast("Link opened in new tab") }}><Icon.ExternalLink className="size-4" /> Open Link</Button>
            <Button className="flex-1" onClick={() => { setLinkModal(false); toast("Link shared") }}>Done</Button>
          </div>
        </div>
      </Modal>
      </>
      )}
    </div>
  )
}
