"use client"

import { useState } from "react"
import { templatesSeed, variableTags, automationRulesSeed } from "@/lib/data"
import { Card, CategoryBadge, Button, Field, TextInput, TextArea, Toggle, Modal, Segmented } from "../ui-kit"
import { useApp } from "../app-context"

export function EmailAutomation() {
  const { toast } = useApp()
  const [tab, setTab] = useState("Templates")
  const [templates, setTemplates] = useState(templatesSeed)
  const [rules, setRules] = useState(automationRulesSeed)
  const [selectedId, setSelectedId] = useState(templatesSeed[0].id)
  const [editing, setEditing] = useState<{ subject: string; body: string } | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const selected = templates.find((t) => t.id === selectedId)!

  function startEdit() {
    setEditing({ subject: selected.subject, body: selected.body })
  }

  function saveEdit() {
    if (!editing) return
    setTemplates((prev) =>
      prev.map((t) => (t.id === selectedId ? { ...t, subject: editing.subject, body: editing.body, edited: "Just now" } : t)),
    )
    setEditing(null)
    toast("Template saved")
  }

  function insertVar(tag: string) {
    if (!editing) return
    setEditing({ ...editing, body: editing.body + `{{${tag}}}` })
  }

  function toggleRule(id: string) {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)))
    toast("Automation rule updated")
  }

  const sampleData: Record<string, string> = {
    candidate_first_name: "Sarah", candidate_last_name: "Chen", job_title: "Senior Engineer",
    company_name: "Apex Corp", interview_date: "13 Jun 2026", interview_time: "2:00 PM",
    duration: "60 min", interview_type: "Video", recruiter_name: "Matt", application_date: "10 Jun 2026",
  }

  function render(text: string) {
    return text.replace(/\{\{(\w+)\}\}/g, (_, k) => sampleData[k] ?? `{{${k}}}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Email Automation</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage templates and automated communication rules.</p>
        </div>
        <Segmented options={["Templates", "Automation Rules"]} value={tab} onChange={setTab} />
      </div>

      {tab === "Templates" ? (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Template list */}
          <Card className="overflow-hidden">
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Templates</p>
            </div>
            <ul>
              {templates.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => { setSelectedId(t.id); setEditing(null) }}
                    className={`flex w-full flex-col gap-1 border-b border-border px-4 py-3 text-left transition-colors hover:bg-secondary/50 ${selectedId === t.id ? "bg-accent/60" : ""}`}
                  >
                    <span className="text-sm font-medium text-foreground">{t.name}</span>
                    <span className="flex items-center gap-2">
                      <CategoryBadge category={t.category} />
                      <span className="text-[11px] text-muted-foreground">Edited {t.edited}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          {/* Editor */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{selected.name}</h2>
                <CategoryBadge category={selected.category} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPreviewOpen(true)}>Preview</Button>
                {editing ? (
                  <>
                    <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                    <Button onClick={saveEdit}>Save</Button>
                  </>
                ) : (
                  <Button onClick={startEdit}>Edit</Button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Field label="Subject">
                <TextInput
                  value={editing ? editing.subject : selected.subject}
                  readOnly={!editing}
                  onChange={(e) => editing && setEditing({ ...editing, subject: e.target.value })}
                />
              </Field>
              <Field label="Body">
                <TextArea
                  className="min-h-64 font-mono text-xs leading-relaxed"
                  value={editing ? editing.body : selected.body}
                  readOnly={!editing}
                  onChange={(e) => editing && setEditing({ ...editing, body: e.target.value })}
                />
              </Field>

              {editing && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Insert variable</p>
                  <div className="flex flex-wrap gap-2">
                    {variableTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => insertVar(tag)}
                        className="rounded-md border border-border bg-secondary px-2 py-1 font-mono text-[11px] text-foreground transition hover:bg-accent hover:text-accent-foreground"
                      >
                        {`{{${tag}}}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-left text-xs font-medium text-muted-foreground">
                  <th className="px-4 py-3">Rule</th>
                  <th className="px-4 py-3">Trigger</th>
                  <th className="px-4 py-3">Template</th>
                  <th className="px-4 py-3">Scope</th>
                  <th className="px-4 py-3 text-right">Active</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                    <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">{r.trigger}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.template}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.scope}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <Toggle checked={r.active} onChange={() => toggleRule(r.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Email Preview" maxWidth="max-w-xl">
        <div className="rounded-lg border border-border">
          <div className="border-b border-border bg-secondary/50 px-4 py-3">
            <p className="text-xs text-muted-foreground">Subject</p>
            <p className="text-sm font-medium text-foreground">{render(selected.subject)}</p>
          </div>
          <div className="whitespace-pre-wrap px-4 py-4 text-sm leading-relaxed text-foreground">{render(selected.body)}</div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Preview rendered with sample data for Sarah Chen / Apex Corp.</p>
      </Modal>
    </div>
  )
}
