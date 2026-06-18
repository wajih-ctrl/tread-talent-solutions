"use client"

import { useState } from "react"
import { useApp } from "../app-context"
import { useStore } from "../store"
import { Card, StatusBadge, Modal, Field, TextInput, TextArea, Select, Button, Toggle } from "../ui-kit"
import { Icon } from "../icons"

const INDUSTRIES = ["Technology", "Marketing", "Operations", "Healthcare", "Finance", "Other"]
const CLIENT_STATUSES = ["All", "Active", "Paused"]
const JOB_STATUSES = ["All", "Open", "On Hold", "Closed"]

type FormState = {
  name: string; industry: string; contactName: string; contactEmail: string;
  contactPhone: string; notes: string; status: string
}

const emptyForm: FormState = { name: "", industry: "Technology", contactName: "", contactEmail: "", contactPhone: "", notes: "", status: "Active" }

export function Clients() {
  const { nav, go, toast, role, clientIdFilter } = useApp()
  const { clients, setClients, jobs } = useStore()
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const readonly = role === "client"
  const clientView = nav.clientView || "clients"
  const clientStatus = nav.clientStatus || "All"
  const jobStatus = nav.jobStatus || "All"
  const displayClients = readonly ? clients.filter((c) => c.id === clientIdFilter) : clients
  const filteredClients = displayClients.filter((client) => clientStatus === "All" || client.status === clientStatus)
  const currentClient = readonly ? displayClients[0] : null
  const clientJobs = currentClient ? jobs[currentClient.id] || [] : []
  const filteredClientJobs = clientJobs.filter((job) => jobStatus === "All" || job.status === jobStatus)
  const adminJobs = clients.flatMap((client) =>
    (jobs[client.id] || []).map((job) => ({
      ...job,
      clientId: client.id,
      clientName: client.name,
      clientStatus: client.status,
    })),
  )
  const filteredAdminJobs = adminJobs.filter((job) => jobStatus === "All" || job.status === jobStatus)

  const openAdd = () => { setForm(emptyForm); setModal("add") }
  const openEdit = (c: any) => {
    setEditId(c.id)
    setForm({ name: c.name, industry: c.industry, contactName: c.contactName, contactEmail: c.contactEmail, contactPhone: c.contactPhone, notes: c.notes, status: c.status })
    setModal("edit")
  }

  const save = () => {
    if (!form.name || !form.contactName || !form.contactEmail) { toast("Please fill required fields"); return }
    if (modal === "add") {
      setClients((prev) => [...prev, {
        id: form.name.toLowerCase().replace(/\s+/g, "-"), name: form.name, industry: form.industry,
        jobs: 0, candidates: 0, status: form.status, lastActivity: "just now",
        contactName: form.contactName, contactEmail: form.contactEmail, contactPhone: form.contactPhone,
        notes: form.notes, pipeline: [0, 0, 0, 0, 0],
      }])
      toast("Client added")
    } else {
      setClients((prev) => prev.map((c) => c.id === editId ? { ...c, ...form } : c))
      toast("Client updated")
    }
    setModal(null)
  }

  const confirmDelete = () => {
    const name = clients.find((c) => c.id === deleteId)?.name
    setClients((prev) => prev.filter((c) => c.id !== deleteId))
    setDeleteId(null)
    toast(`${name} deleted`)
  }

  if (readonly) {
    if (!currentClient) {
      return (
        <Card className="p-6 text-sm text-muted-foreground">
          Client data not found.
        </Card>
      )
    }

    return (
      <div className="space-y-4 sm:space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground sm:text-[22px]">Jobs</h2>
            <p className="mt-1 text-sm text-muted-foreground">{currentClient.name} positions and screening status.</p>
          </div>
          <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">Read-only access</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Job positions</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{clientJobs.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Open jobs</p>
            <p className="mt-2 text-2xl font-semibold text-success">{clientJobs.filter((job) => job.status === "Open").length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Candidates</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{currentClient.candidates}</p>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex flex-col gap-2 sm:max-w-xs">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Filter by job status</label>
            <Select value={jobStatus} onChange={(e) => go("clients", { clientView: "jobs", jobStatus: e.target.value as any })}>
              {JOB_STATUSES.map((status) => <option key={status}>{status}</option>)}
            </Select>
          </div>
        </Card>

        <Card className="overflow-hidden">
          {filteredClientJobs.length === 0 ? (
            <div className="py-14 text-center text-sm text-muted-foreground">No jobs match this filter.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3">Job</th>
                    <th className="px-5 py-3">Department</th>
                    <th className="px-5 py-3">Location</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Candidates</th>
                    <th className="px-5 py-3 text-right">Assessments</th>
                    <th className="px-5 py-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClientJobs.map((job, index) => (
                    <tr key={job.id} className={`border-b border-border last:border-0 transition hover:bg-muted ${index % 2 ? "bg-muted/30" : ""}`}>
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => go("job-detail", { clientId: currentClient.id, jobId: job.id })}
                          className="font-medium text-primary hover:underline"
                        >
                          {job.title}
                        </button>
                        <p className="mt-0.5 text-xs text-muted-foreground">{job.type} - {job.created}</p>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{job.department}</td>
                      <td className="px-5 py-3 text-muted-foreground">{job.location}</td>
                      <td className="px-5 py-3"><StatusBadge status={job.status} /></td>
                      <td className="px-5 py-3 text-right tabular-nums">{job.candidates}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{job.analyzed || 0}</td>
                      <td className="px-5 py-3 text-right">
                        <Button variant="outline" className="px-3 py-1 text-xs" onClick={() => go("job-detail", { clientId: currentClient.id, jobId: job.id })}>
                          <Icon.Eye className="size-3.5" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-5">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-foreground sm:text-[22px]">{clientView === "jobs" ? "Jobs" : "Clients"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {clientView === "jobs"
              ? `${filteredAdminJobs.length} role${filteredAdminJobs.length === 1 ? "" : "s"} shown across clients.`
              : `${filteredClients.length} client${filteredClients.length === 1 ? "" : "s"} shown.`}
          </p>
        </div>
        {clientView === "clients" && <Button onClick={openAdd} className="w-full sm:w-auto"><Icon.Plus className="size-4" /> Add Client</Button>}
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[180px_220px_1fr] md:items-end">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Filter view</label>
            <Select value={clientView} onChange={(e) => go("clients", { clientView: e.target.value as any, clientStatus: "All", jobStatus: "All" })}>
              <option value="clients">Clients</option>
              <option value="jobs">Jobs</option>
            </Select>
          </div>
          {clientView === "clients" ? (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Filter by client status</label>
              <Select value={clientStatus} onChange={(e) => go("clients", { clientView: "clients", clientStatus: e.target.value as any })}>
                {CLIENT_STATUSES.map((status) => <option key={status}>{status}</option>)}
              </Select>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Filter by job status</label>
              <Select value={jobStatus} onChange={(e) => go("clients", { clientView: "jobs", jobStatus: e.target.value as any })}>
                {JOB_STATUSES.map((status) => <option key={status}>{status}</option>)}
              </Select>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Showing {clientView === "clients" ? clientStatus.toLowerCase() : jobStatus.toLowerCase()} {clientView}.
          </p>
        </div>
      </Card>

      {clientView === "jobs" ? (
        <Card className="overflow-x-auto">
          {filteredAdminJobs.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">No jobs match this filter.</div>
          ) : (
            <table className="w-full min-w-[880px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3">Job</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Candidates</th>
                  <th className="px-5 py-3 text-right">Assessments</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdminJobs.map((job, index) => (
                  <tr key={`${job.clientId}-${job.id}`} className={`border-b border-border transition-colors last:border-0 hover:bg-muted ${index % 2 ? "bg-muted/30" : ""}`}>
                    <td className="px-5 py-3">
                      <button onClick={() => go("job-detail", { clientId: job.clientId, jobId: job.id })} className="font-medium text-primary hover:underline">{job.title}</button>
                      <p className="mt-0.5 text-xs text-muted-foreground">{job.type} - {job.location}</p>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => go("client-folder", { clientId: job.clientId })} className="font-medium text-foreground hover:text-primary hover:underline">{job.clientName}</button>
                      <p className="mt-0.5 text-xs text-muted-foreground">{job.clientStatus}</p>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{job.department}</td>
                    <td className="px-5 py-3"><StatusBadge status={job.status} /></td>
                    <td className="px-5 py-3 text-right tabular-nums">{job.candidates}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{job.analyzed || 0}</td>
                    <td className="px-5 py-3 text-muted-foreground">{job.created}</td>
                    <td className="px-5 py-3 text-right">
                      <Button variant="outline" className="px-3 py-1 text-xs" onClick={() => go("job-detail", { clientId: job.clientId, jobId: job.id })}>
                        <Icon.Eye className="size-3.5" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          {filteredClients.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <p className="text-sm text-muted-foreground">No clients match this filter.</p>
              <Button onClick={openAdd}><Icon.Plus className="size-4" /> Add your first client</Button>
            </div>
          ) : (
            <table className="w-full min-w-max text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-3 sm:px-5">Client Name</th>
                  <th className="hidden px-3 py-3 sm:table-cell sm:px-5">Industry</th>
                  <th className="px-3 py-3 sm:px-5">Jobs</th>
                  <th className="hidden px-3 py-3 md:table-cell sm:px-5">Candidates</th>
                  <th className="hidden px-3 py-3 lg:table-cell sm:px-5">Last Activity</th>
                  <th className="px-3 py-3 sm:px-5">Status</th>
                  <th className="px-3 py-3 text-right sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((c, i) => (
                  <tr key={c.id} className={`border-b border-border transition-colors hover:bg-muted ${i % 2 ? "bg-muted/30" : ""}`}>
                    <td className="px-3 py-3 sm:px-5">
                      <button onClick={() => go("client-folder", { clientId: c.id })} className="block truncate font-medium text-primary hover:underline">{c.name}</button>
                    </td>
                    <td className="hidden px-3 py-3 text-muted-foreground sm:table-cell sm:px-5">{c.industry}</td>
                    <td className="px-3 py-3 tabular-nums sm:px-5">{c.jobs}</td>
                    <td className="hidden px-3 py-3 tabular-nums md:table-cell sm:px-5">{c.candidates}</td>
                    <td className="hidden px-3 py-3 text-muted-foreground lg:table-cell sm:px-5">{c.lastActivity}</td>
                    <td className="px-3 py-3 sm:px-5"><StatusBadge status={c.status} /></td>
                    <td className="px-3 py-3 sm:px-5">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button onClick={() => openEdit(c)} aria-label="Edit" className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-primary"><Icon.Edit className="size-3.5 sm:size-4" /></button>
                        <button onClick={() => setDeleteId(c.id)} aria-label="Delete" className="rounded-md p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger"><Icon.Trash className="size-3.5 sm:size-4" /></button>
                        <Button variant="outline" className="whitespace-nowrap px-2 py-1 text-[10px] sm:px-3 sm:text-xs" onClick={() => go("client-folder", { clientId: c.id })}><Icon.Eye className="mr-1 size-3" />View</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-sm p-6">
            <h3 className="text-base font-semibold text-foreground">Delete client</h3>
            <p className="mt-2 text-sm text-muted-foreground">Are you sure you want to delete {clients.find((c) => c.id === deleteId)?.name}? This cannot be undone.</p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete}>Delete</Button>
            </div>
          </Card>
        </div>
      )}

      <Modal open={modal !== null} onClose={() => setModal(null)} title={modal === "add" ? "Add Client" : "Edit Client"}>
        <div className="space-y-4">
          <Field label="Client Name" required><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Acme Inc." /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Industry">
              <div className="relative">
                <Icon.Building className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
                <Select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="pl-9">{INDUSTRIES.map((x) => <option key={x}>{x}</option>)}</Select>
              </div>
            </Field>
            <Field label="Primary Contact Name" required><TextInput value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Contact Email" required><TextInput type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} /></Field>
            <Field label="Contact Phone"><TextInput value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} /></Field>
          </div>
          <Field label="Notes"><TextArea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Status</span>
            <Toggle checked={form.status === "Active"} onChange={(v) => setForm({ ...form, status: v ? "Active" : "Paused" })} label={form.status} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={save}>Save Client</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
