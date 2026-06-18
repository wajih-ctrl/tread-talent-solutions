"use client"

import { useState } from "react"
import { useApp } from "../app-context"
import { useStore } from "../store"
import { Breadcrumbs } from "../login"
import { Card, StatusBadge, Button, Modal, Field, TextInput, Select, Toggle } from "../ui-kit"
import { Icon } from "../icons"
import { JobModal } from "./job-modal"

const TABS = ["Overview", "Jobs", "Email Rules"] as const

export function ClientFolder() {
  const { nav, go, toast } = useApp()
  const { clients, jobs, setJobs, rules, setRules } = useStore()
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview")
  const [jobModal, setJobModal] = useState(false)
  const [editJob, setEditJob] = useState<any>(null)
  const [ruleModal, setRuleModal] = useState(false)
  const [ruleForm, setRuleForm] = useState({ name: "", trigger: "Candidate Added", template: "Application Received Confirmation", active: true })

  const client = clients.find((c) => c.id === nav.clientId)
  if (!client) return <p className="text-sm text-muted-foreground">Client not found.</p>

  const clientJobs = jobs[client.id] || []
  const clientRules = rules.filter((r) => r.scope === client.name || r.scope === "All Clients")

  const saveJob = (data: any) => {
    if (editJob) {
      setJobs((prev) => ({ ...prev, [client.id]: prev[client.id].map((j) => j.id === editJob.id ? { ...j, ...data } : j) }))
      toast("Job updated")
    } else {
      const id = `${client.id}-${Date.now()}`
      setJobs((prev) => ({ ...prev, [client.id]: [...(prev[client.id] || []), { id, ...data, candidates: 0, analyzed: 0, created: "just now" }] }))
      toast("Job added")
    }
    setJobModal(false); setEditJob(null)
  }

  const deleteJob = (id: string) => {
    setJobs((prev) => ({ ...prev, [client.id]: prev[client.id].filter((j) => j.id !== id) }))
    toast("Job deleted")
  }

  return (
    <div className="space-y-3 sm:space-y-5">
      <div>
        <Breadcrumbs items={[{ label: "Clients", onClick: () => go("clients") }, { label: client.name }]} />
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <h2 className="text-xl sm:text-[22px] font-semibold text-foreground truncate">{client.name}</h2>
          <div className="flex gap-2 flex-wrap">
            <span className="rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground whitespace-nowrap">{client.industry}</span>
            <StatusBadge status={client.status} />
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`border-b-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-5">
            <h3 className="mb-3 text-xs sm:text-sm font-semibold text-foreground">Primary Contact</h3>
            <dl className="space-y-2 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between"><dt className="text-muted-foreground">Name</dt><dd className="font-medium text-foreground">{client.contactName}</dd></div>
              <div className="flex flex-col sm:flex-row sm:justify-between"><dt className="text-muted-foreground">Email</dt><dd><a href={`mailto:${client.contactEmail}`} className="font-medium text-primary hover:underline truncate">{client.contactEmail}</a></dd></div>
              <div className="flex flex-col sm:flex-row sm:justify-between"><dt className="text-muted-foreground">Phone</dt><dd className="font-medium text-foreground">{client.contactPhone}</dd></div>
              <div className="pt-2"><dt className="mb-1 text-muted-foreground">Notes</dt><dd className="text-foreground text-xs sm:text-sm">{client.notes}</dd></div>
            </dl>
            <Button variant="outline" className="mt-4 w-full sm:w-auto" onClick={() => toast("Edit info — open from Clients list")}><Icon.Edit className="size-3.5 sm:size-4" /> Edit Info</Button>
          </Card>
          <Card className="p-4 sm:p-5">
            <h3 className="mb-3 text-xs sm:text-sm font-semibold text-foreground">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {[["Active Jobs", client.jobs], ["Total Candidates", client.candidates], ["CVs This Month", 18], ["Placements", client.pipeline[4]], ["Avg Time to Fill", "21 days"]].map(([l, v]) => (
                <div key={l as string} className="rounded-lg border border-border p-2 sm:p-3">
                  <div className="text-lg sm:text-xl font-semibold text-foreground">{v}</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "Jobs" && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setEditJob(null); setJobModal(true) }} className="w-full sm:w-auto"><Icon.Plus className="size-4" /> Add Job</Button>
          </div>
          <Card className="overflow-x-auto">
            {clientJobs.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-14 text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">No jobs for this client yet.</p>
                <Button onClick={() => { setEditJob(null); setJobModal(true) }}><Icon.Plus className="size-4" /> Add a job</Button>
              </div>
            ) : (
              <table className="w-full text-xs sm:text-sm min-w-max">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 sm:px-5 py-3">Job</th><th className="px-3 sm:px-5 py-3 hidden sm:table-cell">Department</th><th className="px-3 sm:px-5 py-3">Status</th>
                    <th className="px-3 sm:px-5 py-3">Candidates</th><th className="px-3 sm:px-5 py-3 hidden md:table-cell">AI Analyzed</th><th className="px-3 sm:px-5 py-3 hidden lg:table-cell">Created</th><th className="px-3 sm:px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clientJobs.map((j, i) => (
                    <tr key={j.id} className={`border-b border-border transition-colors hover:bg-muted ${i % 2 ? "bg-muted/30" : ""}`}>
                      <td className="px-3 sm:px-5 py-3"><button onClick={() => go("job-detail", { clientId: client.id, jobId: j.id })} className="font-medium text-primary hover:underline truncate">{j.title}</button></td>
                      <td className="px-3 sm:px-5 py-3 text-muted-foreground hidden sm:table-cell">{j.department}</td>
                      <td className="px-3 sm:px-5 py-3"><StatusBadge status={j.status} /></td>
                      <td className="px-3 sm:px-5 py-3 tabular-nums">{j.candidates}</td>
                      <td className="px-3 sm:px-5 py-3 tabular-nums hidden md:table-cell">{j.analyzed}</td>
                      <td className="px-3 sm:px-5 py-3 text-muted-foreground hidden lg:table-cell">{j.created}</td>
                      <td className="px-3 sm:px-5 py-3">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button onClick={() => { setEditJob(j); setJobModal(true) }} aria-label="Edit" className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-primary"><Icon.Edit className="size-3.5 sm:size-4" /></button>
                          <button onClick={() => deleteJob(j.id)} aria-label="Delete" className="rounded-md p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger"><Icon.Trash className="size-3.5 sm:size-4" /></button>
                          <Button variant="outline" className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs whitespace-nowrap" onClick={() => go("job-detail", { clientId: client.id, jobId: j.id })}>View</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      )}

      {tab === "Email Rules" && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setRuleModal(true)} className="w-full sm:w-auto"><Icon.Plus className="size-4" /> Add Rule</Button>
          </div>
          <Card className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-max">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 sm:px-5 py-3">Rule Name</th><th className="px-3 sm:px-5 py-3 hidden sm:table-cell">Trigger Stage</th><th className="px-3 sm:px-5 py-3">Template Used</th><th className="px-3 sm:px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {clientRules.map((r, i) => (
                  <tr key={r.id} className={`border-b border-border hover:bg-muted ${i % 2 ? "bg-muted/30" : ""}`}>
                    <td className="px-5 py-3 font-medium text-foreground">{r.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.trigger}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.template}</td>
                    <td className="px-5 py-3"><div className="flex justify-end"><Toggle checked={r.active} onChange={(v) => setRules((prev) => prev.map((x) => x.id === r.id ? { ...x, active: v } : x))} /></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      <JobModal open={jobModal} onClose={() => { setJobModal(false); setEditJob(null) }} onSave={saveJob} initial={editJob} />

      <Modal open={ruleModal} onClose={() => setRuleModal(false)} title="Add Email Rule">
        <div className="space-y-4">
          <Field label="Rule Name" required><TextInput value={ruleForm.name} onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })} /></Field>
          <Field label="Trigger Stage"><Select value={ruleForm.trigger} onChange={(e) => setRuleForm({ ...ruleForm, trigger: e.target.value })}><option>Candidate Added</option><option>Moved to Screened</option><option>Interview Scheduled</option><option>Moved to Offer</option><option>Candidate Rejected</option></Select></Field>
          <Field label="Template"><Select value={ruleForm.template} onChange={(e) => setRuleForm({ ...ruleForm, template: e.target.value })}><option>Application Received Confirmation</option><option>Phone Screen Invitation</option><option>Interview Confirmation</option><option>Candidate Rejection (Post-Screen)</option><option>Offer Stage Notification</option></Select></Field>
          <div className="flex items-center justify-between"><span className="text-sm font-medium text-foreground">Active</span><Toggle checked={ruleForm.active} onChange={(v) => setRuleForm({ ...ruleForm, active: v })} /></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setRuleModal(false)}>Cancel</Button>
            <Button onClick={() => { if (!ruleForm.name) { toast("Enter a rule name"); return } setRules((prev) => [...prev, { id: `r${Date.now()}`, name: ruleForm.name, trigger: ruleForm.trigger, template: ruleForm.template, scope: client.name, active: ruleForm.active }]); setRuleModal(false); setRuleForm({ name: "", trigger: "Candidate Added", template: "Application Received Confirmation", active: true }); toast("Rule added") }}>Save Rule</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
