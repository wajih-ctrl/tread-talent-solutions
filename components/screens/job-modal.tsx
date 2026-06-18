"use client"

import { useState, useEffect } from "react"
import { Modal, Field, TextInput, TextArea, Select, Button, Segmented, Toggle } from "../ui-kit"
import { Icon } from "../icons"
import { defaultCriteria } from "@/lib/data"

type Criterion = { id: string; label: string; weight: string; required: boolean }

export function JobModal({ open, onClose, onSave, initial }: {
  open: boolean
  onClose: () => void
  onSave: (job: any) => void
  initial?: any
}) {
  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [location, setLocation] = useState("")
  const [type, setType] = useState("Full-Time")
  const [status, setStatus] = useState("Open")
  const [targetStart, setTargetStart] = useState("")
  const [salary, setSalary] = useState("")
  const [description, setDescription] = useState("")
  const [criteria, setCriteria] = useState<Criterion[]>(defaultCriteria.slice(0, 3))

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || "")
      setDepartment(initial?.department || "")
      setLocation(initial?.location || "")
      setType(initial?.type || "Full-Time")
      setStatus(initial?.status || "Open")
      setTargetStart(initial?.targetStart || "")
      setSalary(initial?.salary || "")
      setDescription(initial?.description || "")
      setCriteria(initial?.criteria || defaultCriteria.slice(0, 3))
    }
  }, [open, initial])

  const addCriterion = () => {
    if (criteria.length >= 6) return
    setCriteria((c) => [...c, { id: `c${Date.now()}`, label: "", weight: "Medium", required: false }])
  }
  const removeCriterion = (id: string) => setCriteria((c) => c.filter((x) => x.id !== id))
  const updateCriterion = (id: string, patch: Partial<Criterion>) => setCriteria((c) => c.map((x) => x.id === id ? { ...x, ...patch } : x))

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Job" : "Add Job"} maxWidth="max-w-2xl">
      <div className="space-y-4">
        <Field label="Job Title" required><TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Senior Engineer" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Department"><TextInput value={department} onChange={(e) => setDepartment(e.target.value)} /></Field>
          <Field label="Location"><TextInput value={location} onChange={(e) => setLocation(e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Job Type"><Select value={type} onChange={(e) => setType(e.target.value)}><option>Full-Time</option><option>Part-Time</option><option>Contract</option></Select></Field>
          <Field label="Status"><Select value={status} onChange={(e) => setStatus(e.target.value)}><option>Open</option><option>On Hold</option><option>Closed</option></Select></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Target Start Date"><TextInput type="date" value={targetStart} onChange={(e) => setTargetStart(e.target.value)} /></Field>
          <Field label="Salary Range"><TextInput value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="£60k–£75k" /></Field>
        </div>
        <Field label="Job Description"><TextArea value={description} onChange={(e) => setDescription(e.target.value)} /></Field>

        <div className="rounded-lg border border-border bg-muted/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">AI Screening Criteria</span>
            <span className="text-xs text-muted-foreground">{criteria.length}/6</span>
          </div>
          <div className="space-y-2">
            {criteria.map((c) => (
              <div key={c.id} className="flex items-center gap-2 rounded-lg bg-card p-2">
                <TextInput value={c.label} onChange={(e) => updateCriterion(c.id, { label: e.target.value })} placeholder="5+ years Python experience" className="flex-1" />
                <Segmented options={["Low", "Medium", "High"]} value={c.weight} onChange={(v) => updateCriterion(c.id, { weight: v })} />
                <Toggle checked={c.required} onChange={(v) => updateCriterion(c.id, { required: v })} label={c.required ? "Req" : "Opt"} />
                <button onClick={() => removeCriterion(c.id)} aria-label="Remove criterion" className="rounded-md p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger"><Icon.Trash className="size-4" /></button>
              </div>
            ))}
          </div>
          {criteria.length < 6 && (
            <button onClick={addCriterion} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"><Icon.Plus className="size-4" /> Add Criterion</button>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave({ title, department, location, type, status, targetStart, salary, description, criteria })}>Save Job</Button>
        </div>
      </div>
    </Modal>
  )
}
