"use client"

import { useState } from "react"
import { useApp } from "../app-context"
import { useStore } from "../store"
import { Breadcrumbs } from "../login"
import { Card, CardLabel, StageBadge, ScoreBadge, Button, Modal, TextArea, Select } from "../ui-kit"
import { Icon } from "../icons"
import { evaluationCriteria } from "@/lib/data"

const TABS = ["CV & AI Evaluation", "Recruiter Remarks", "Call Transcript & Notes", "Status History"] as const

const STATUS_ICON: Record<string, string> = { pass: "✓", warn: "!", fail: "✕" }
const STATUS_STYLE: Record<string, string> = { pass: "bg-success/15 text-success", warn: "bg-warning/15 text-[#9a6700]", fail: "bg-danger/15 text-danger" }

const TRANSCRIPT = `[00:00] Matt: Hi Sarah, thanks for joining the call today.
[00:12] Sarah: Happy to be here, really excited about the role.
[01:05] Matt: Can you walk me through your Python experience?
[01:18] Sarah: Sure, I've been using Python for about 7 years now, primarily in backend development and data pipelines.
[03:45] Matt: How large were the teams you managed?
[03:52] Sarah: My last team was 12 engineers, including 3 seniors.
[06:10] Matt: And what's your cloud experience like?
[06:22] Sarah: Mostly Azure in production, AWS in personal projects.
[10:30] Matt: What are your salary expectations?
[10:40] Sarah: Somewhere in the region of £75,000 to £80,000.`

const SUMMARY = [
  ["Motivation", "Highly motivated; aware of company; asked specific questions about team."],
  ["Technical Fit", "Confirmed 7 years Python. AWS limited to personal projects."],
  ["Leadership", "Managed team of 12; 3 direct senior reports."],
  ["Red Flags", "None identified in call."],
  ["Salary Expectation", "£75,000–£80,000"],
  ["Availability", "4 weeks notice"],
  ["Recommendation", "Advance to Technical Interview"],
]

function normalizePdfText(value: string) {
  return value
    .replace(/£/g, "GBP ")
    .replace(/Â£/g, "GBP ")
    .replace(/–/g, "-")
    .replace(/â€“/g, "-")
    .replace(/—/g, "-")
    .replace(/â€”/g, "-")
    .replace(/•/g, "-")
    .replace(/â€¢/g, "-")
    .replace(/✓/g, "pass")
    .replace(/✕/g, "fail")
    .replace(/[^\x20-\x7E]/g, "")
}

function escapePdfText(value: string) {
  return normalizePdfText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
}

function wrapPdfText(value: string, maxLength = 88) {
  const words = normalizePdfText(value).split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ""

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxLength) {
      if (current) lines.push(current)
      current = word
    } else {
      current = next
    }
  })

  if (current) lines.push(current)
  return lines
}

function makeCandidateReportPdf(lines: { text: string; size?: number; bold?: boolean; gap?: number }[]) {
  let y = 750
  const content = lines.flatMap((line) => {
    const size = line.size || 10
    const font = line.bold ? "F2" : "F1"
    const currentY = y
    y -= line.gap || size + 7
    return [`BT /${font} ${size} Tf 54 ${currentY} Td (${escapePdfText(line.text)}) Tj ET`]
  }).join("\n")

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ]

  let pdf = "%PDF-1.4\n"
  const offsets = [0]
  objects.forEach((object, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })
  const xref = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`

  return pdf
}

export function CandidateProfile() {
  const { nav, go, role, clientIdFilter, toast } = useApp()
  const { clients, jobs, candidates, setCandidates, analyzer } = useStore()
  const [tab, setTab] = useState<(typeof TABS)[number]>("CV & AI Evaluation")
  const [hmModal, setHmModal] = useState(false)
  const [reportModal, setReportModal] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [advanceTo, setAdvanceTo] = useState("Interview")

  const readonly = role === "client"
  const currentClient = readonly ? clients.find((client) => client.id === clientIdFilter) : clients.find((client) => client.id === nav.clientId)
  const currentJob = (jobs[currentClient?.id || ""] || []).find((job) => job.id === nav.jobId)
  const storedCandidate = candidates.find((c) => c.id === nav.candidateId)
  const analyzerId = nav.candidateId?.startsWith("analyzer-") ? nav.candidateId.replace("analyzer-", "") : null
  const analyzerCandidate = analyzer.find((row) => row.id === analyzerId) || analyzer.find((row) => row.name === storedCandidate?.name)
  const scopedAnalyzerCandidate = readonly && currentClient
    ? analyzer.find((row) => row.client === currentClient.name && row.name === (storedCandidate?.name || analyzerCandidate?.name))
    : analyzerCandidate
  const candidate = storedCandidate || (analyzerCandidate
    ? {
        id: `analyzer-${analyzerCandidate.id}`,
        name: analyzerCandidate.name,
        score: analyzerCandidate.score,
        stage: analyzerCandidate.status === "Rejected" ? "Rejected" : analyzerCandidate.status === "Accepted" ? "Screened" : "Applied",
        summary: analyzerCandidate.reason,
        flag: analyzerCandidate.flag,
        added: "2 days ago",
      }
    : candidates[0])

  const candidateBlocked = readonly && !scopedAnalyzerCandidate

  const [notes, setNotes] = useState([
    { time: "11 Jun 2026, 10:15", text: "Spoke briefly before formal screen. Seems very motivated, asked good questions about the team structure." },
    { time: "10 Jun 2026, 14:30", text: "CV uploaded and AI analysis reviewed. Strong match on core criteria. Short tenure flag noted but may be explained by contract role." },
    { time: "09 Jun 2026, 09:00", text: "Added to pipeline from Excel import." },
  ])

  const [history, setHistory] = useState([
    { color: "bg-success", stage: "Interview Scheduled", date: "11 Jun 2026", note: "Video interview booked for 13 Jun, 2PM" },
    { color: "bg-primary", stage: "Screened", date: "10 Jun 2026", note: "Phone screen completed, AI summary generated" },
    { color: "bg-warning", stage: "Applied", date: "09 Jun 2026", note: "Added via Excel import, AI score: 91%" },
  ])

  const setStage = (stage: string) => setCandidates((prev) => prev.map((c) => c.id === candidate.id ? { ...c, stage } : c))

  const addNote = () => {
    if (!newNote.trim()) return
    const time = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) + ", " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    setNotes((prev) => [{ time, text: newNote }, ...prev])
    setNewNote("")
    toast("Note saved")
  }

  const updateStage = () => {
    setStage(advanceTo)
    const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    setHistory((prev) => [{ color: "bg-primary", stage: advanceTo, date, note: "Stage updated manually by Matt" }, ...prev])
    toast(`Stage updated to ${advanceTo}`)
  }

  const downloadCandidateReport = () => {
    const reportLines = [
      { text: "Candidate Report", size: 20, bold: true, gap: 28 },
      { text: candidate.name, size: 16, bold: true, gap: 21 },
      { text: "Senior Engineer @ Apex Corp", size: 11, gap: 24 },
      { text: `AI Score: ${candidate.score}%`, size: 12, bold: true, gap: 18 },
      { text: `Current Stage: ${candidate.stage}`, size: 11, gap: 18 },
      { text: "AI Evaluation Summary", size: 13, bold: true, gap: 18 },
      ...wrapPdfText("This candidate is a strong match for the role. Python expertise is well-demonstrated across multiple roles. Team leadership confirmed. Cloud experience is partial, limited to Azure rather than AWS. FinTech domain not mentioned; may need clarification.", 86).map((text) => ({ text, size: 10, gap: 14 })),
      { text: "Evaluation Criteria", size: 13, bold: true, gap: 18 },
      ...evaluationCriteria.flatMap((item) => wrapPdfText(`${item.label}: ${item.match}`, 86).map((text) => ({ text, size: 10, gap: 14 }))),
      { text: "Recruiter Remarks", size: 13, bold: true, gap: 18 },
      ...wrapPdfText("Spoke briefly before formal screen. Seems very motivated, asked good questions about the team structure. Strong Python background confirmed. Ready to advance to technical interview.", 86).map((text) => ({ text, size: 10, gap: 14 })),
      { text: "Pipeline Status", size: 13, bold: true, gap: 18 },
      { text: "Days in Pipeline: 2 days", size: 10, gap: 14 },
      { text: "Next Action: Schedule Technical", size: 10, gap: 20 },
      { text: `Generated by Tread Talent Solutions on ${new Date().toLocaleDateString()}`, size: 9, gap: 12 },
    ]
    const pdf = makeCandidateReportPdf(reportLines)
    const blob = new Blob([pdf], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Candidate-Report-${candidate.name.replace(/\s+/g, "-")}.pdf`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 60000)
    toast("Candidate report PDF downloaded")
  }

  if (candidateBlocked) {
    return <Card className="p-6 text-sm text-muted-foreground">Candidate not found for this client.</Card>
  }

  return (
    <div className="space-y-3 sm:space-y-5">
      <div>
        <Breadcrumbs items={readonly
          ? [
              { label: "Jobs", onClick: () => go("clients") },
              ...(currentJob ? [{ label: currentJob.title, onClick: () => go("job-detail", { clientId: currentClient?.id, jobId: currentJob.id }) }] : []),
              { label: candidate.name },
            ]
          : [{ label: "Clients", onClick: () => go("clients") }, { label: "Apex Corp", onClick: () => go("client-folder", { clientId: "apex" }) }, { label: "Senior Engineer", onClick: () => go("job-detail", { clientId: "apex", jobId: "apex-se" }) }, { label: candidate.name }]} />
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <h2 className="text-xl sm:text-[22px] font-semibold text-foreground truncate">{candidate.name}</h2>
          <div className="flex gap-2 flex-wrap">
            {candidate.score > 0 && <ScoreBadge score={candidate.score} />}
            <StageBadge stage={candidate.stage} />
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`border-b-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>

      {tab === "CV & AI Evaluation" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card className="lg:col-span-3 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="text-xs sm:text-sm font-semibold text-foreground">CV Preview</h3>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button variant="outline" className="px-2 sm:px-3 py-1 text-xs flex-1 sm:flex-none" onClick={() => toast("CV downloaded")}><Icon.Download className="size-3.5" /> Download CV</Button>
                {!readonly && <Button variant="outline" className="px-2 sm:px-3 py-1 text-xs flex-1 sm:flex-none" onClick={() => setReportModal(true)}><Icon.Download className="size-3.5" /> Download Report</Button>}
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-border bg-muted/50 p-4 sm:p-6 text-xs sm:text-sm leading-relaxed text-muted-foreground max-h-96 sm:max-h-[500px] overflow-y-auto">
              <p className="font-semibold text-foreground">CV Preview — {candidate.name}.pdf</p>
              <p className="mt-3 font-medium text-foreground">{candidate.name}</p>
              <p>Senior Software Engineer · London, UK</p>
              <p className="mt-3 font-medium text-foreground">Experience</p>
              <p>Lead Engineer, DataFlow Ltd (2021–2024) — Led backend team of 12 engineers.</p>
              <p>Senior Developer, CloudWorks (2018–2021) — Built Python data pipelines.</p>
              <p className="mt-3 font-medium text-foreground">Education</p>
              <p>BSc Computer Science, University of Manchester</p>
            </div>
          </Card>

          <Card className="col-span-2 p-5">
            <div className="flex flex-col items-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-success/15 text-2xl font-bold text-success">{candidate.score}%</div>
              <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">Overall Score</p>
            </div>
            <div className="mt-4 space-y-2">
              {evaluationCriteria.map((c) => (
                <div key={c.label} className="flex items-center gap-2 text-sm">
                  <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${STATUS_STYLE[c.status]}`}>{STATUS_ICON[c.status]}</span>
                  <span className="flex-1 text-foreground">{c.label}</span>
                  <span className="text-xs text-muted-foreground">{c.match}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-accent/50 p-3">
              <CardLabel>AI Summary</CardLabel>
              <p className="mt-1 text-sm leading-relaxed text-foreground">This candidate is a strong match for the role. Python expertise is well-demonstrated across multiple roles. Team leadership confirmed. Cloud experience is partial — limited to Azure rather than AWS. FinTech domain not mentioned; may need clarification.</p>
            </div>
            <div className="mt-3 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-[#9a6700]">
              Short tenure at last role (8 months)
            </div>
            {!readonly && (
              <div className="mt-4 flex gap-2">
                <Button variant="success" className="flex-1" onClick={() => { setStage("Offer"); toast("Candidate accepted") }}>
                  <Icon.Check className="size-4" /> Accept Candidate
                </Button>
                <Button variant="danger" className="flex-1" onClick={() => { setStage("Rejected"); toast("Candidate rejected") }}>
                  <Icon.X className="size-4" /> Reject Candidate
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {tab === "Recruiter Remarks" && (
        <Card className="p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold text-foreground">Recruiter Remarks</h3>
            {readonly && <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">Read-only access</span>}
          </div>
          <div className={`max-h-96 space-y-3 overflow-y-auto ${readonly ? "" : "mb-4 border-b border-border pb-4"}`}>
            {notes.map((n, i) => (
              <div key={i} className="text-xs text-muted-foreground">
                <p className="font-medium">{n.time}</p>
                <p className="mt-1 text-foreground">{n.text}</p>
              </div>
            ))}
          </div>
          {!readonly && (
            <div className="space-y-2">
              <TextArea placeholder="Add a note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} />
              <Button onClick={addNote} className="w-full"><Icon.MessageSquarePlus className="size-4" /> Add Note</Button>
            </div>
          )}
        </Card>
      )}

      {!readonly && tab === "Status History" && (
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Status History</h3>
          <ol className="relative ml-2 space-y-5 border-l border-border pl-6">
            {history.map((h, i) => (
              <li key={i} className="relative">
                <span className={`absolute -left-[31px] top-0.5 size-3 rounded-full ring-4 ring-card ${h.color}`} />
                <p className="text-sm font-medium text-foreground">{h.stage}</p>
                <p className="text-xs text-muted-foreground">{h.date}</p>
                <p className="mt-1 text-sm text-foreground">{h.note}</p>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex items-end gap-2 border-t border-border pt-4">
            <div className="w-48">
              <CardLabel>Advance Stage</CardLabel>
              <Select value={advanceTo} onChange={(e) => setAdvanceTo(e.target.value)} className="mt-1"><option>Applied</option><option>Screened</option><option>Interview</option><option>Offer</option><option>Placed</option><option>Rejected</option></Select>
            </div>
            <Button onClick={updateStage}>Update Stage</Button>
          </div>
        </Card>
      )}

      {tab === "Call Transcript & Notes" && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground">Phone Screen Recording</h3>
            <div className="mt-3 flex items-center gap-3 rounded-lg border border-border p-3">
              <button className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-label="Play"><Icon.Play className="size-4" /></button>
              <div className="flex flex-1 items-center gap-0.5">
                {Array.from({ length: 48 }).map((_, i) => <span key={i} className="w-1 rounded-full bg-primary/40" style={{ height: `${8 + Math.abs(Math.sin(i)) * 20}px` }} />)}
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">0:00 / 18:34</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Transcript auto-generated</p>
            <pre className="mt-3 h-48 overflow-y-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/50 p-3 font-mono text-xs leading-relaxed text-foreground">{TRANSCRIPT}</pre>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">AI-Generated Screen Summary</h3>
            <dl className="grid grid-cols-2 gap-3">
              {SUMMARY.map(([l, v]) => (
                <div key={l} className="rounded-lg border border-border p-3"><CardLabel>{l}</CardLabel><p className="mt-1 text-sm text-foreground">{v}</p></div>
              ))}
            </dl>
            <Button className="mt-4 w-full" onClick={() => setHmModal(true)}><Icon.Ai className="size-4" /> {readonly ? "View Hiring Manager Summary" : "Generate Hiring Manager Summary"}</Button>
          </Card>
        </div>
      )}

      {tab === "Status History" && readonly && (
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Status History</h3>
          <ol className="relative ml-2 space-y-5 border-l border-border pl-6">
            {history.map((h, i) => (
              <li key={i} className="relative">
                <span className={`absolute -left-[31px] top-0.5 size-3 rounded-full ring-4 ring-card ${h.color}`} />
                <p className="text-sm font-medium text-foreground">{h.stage}</p>
                <p className="text-xs text-muted-foreground">{h.date}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{h.note}</p>
              </li>
            ))}
          </ol>
        </Card>
      )}

      <Modal open={hmModal} onClose={() => setHmModal(false)} title={`Hiring Manager Summary — ${candidate.name}`} maxWidth="max-w-2xl">
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-foreground">HIRING MANAGER SUMMARY — {candidate.name} — Senior Engineer @ Apex Corp</h3>
          {[
            ["Candidate Overview", "Senior Software Engineer with 7 years of Python experience and strong backend/data pipeline background. Currently leading a team of 12 engineers."],
            ["Key Strengths", "Deep Python expertise, confirmed team leadership (3 senior reports), strong communication and motivation."],
            ["Areas to Probe", "AWS cloud experience is limited to personal projects; recent role tenure of 8 months should be explored. FinTech domain not evidenced."],
            ["Salary & Availability", "Expectation £75,000–£80,000. Available with 4 weeks notice."],
            ["Recruiter Recommendation", "Advance to Technical Interview. Strong overall fit (91%)."],
          ].map(([l, v]) => (
            <div key={l}><p className="font-semibold text-foreground">{l}</p><p className="mt-0.5 text-muted-foreground">{v}</p></div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => toast("Copied to clipboard")}><Icon.Copy className="size-4" /> Copy to Clipboard</Button>
            <Button onClick={() => setHmModal(false)}>Close</Button>
          </div>
        </div>
      </Modal>

      <Modal open={reportModal} onClose={() => setReportModal(false)} title={`Candidate Report — ${candidate.name}`} maxWidth="max-w-3xl">
        <div className="space-y-6 text-sm">
          {/* Header */}
          <div className="border-b border-border pb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{candidate.name}</h2>
                <p className="text-muted-foreground">Senior Engineer @ Apex Corp</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex size-16 items-center justify-center rounded-lg bg-success/20 text-2xl font-bold text-success">{candidate.score}%</div>
                <p className="text-xs text-muted-foreground mt-1 uppercase">AI Score</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">Interview Stage</span>
              <span className="inline-flex items-center rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-600">Applied: 09 Jun 2026</span>
            </div>
          </div>

          {/* AI Summary */}
          <div className="rounded-lg bg-accent/10 border border-accent p-4">
            <h3 className="font-semibold text-foreground mb-2">AI Evaluation Summary</h3>
            <p className="text-muted-foreground leading-relaxed">This candidate is a strong match for the role. Python expertise is well-demonstrated across multiple roles. Team leadership confirmed. Cloud experience is partial — limited to Azure rather than AWS. FinTech domain not mentioned; may need clarification.</p>
          </div>

          {/* Criteria Checklist */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Evaluation Criteria</h3>
            <div className="space-y-2">
              {evaluationCriteria.map((c) => (
                <div key={c.label} className="flex items-center gap-3 p-2 rounded-lg border border-border">
                  <span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${STATUS_STYLE[c.status]}`}>{STATUS_ICON[c.status]}</span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{c.label}</p>
                    <p className="text-xs text-muted-foreground">{c.match}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recruiter Remarks */}
          <div className="rounded-lg bg-muted/50 border border-border p-4">
            <h3 className="font-semibold text-foreground mb-2">Recruiter Remarks</h3>
            <p className="text-muted-foreground text-sm">Spoke briefly before formal screen. Seems very motivated, asked good questions about the team structure. Strong Python background confirmed. Ready to advance to technical interview.</p>
          </div>

          {/* Pipeline Status */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground">Current Stage</p>
              <p className="font-semibold text-foreground mt-1">Interview</p>
            </div>
            <div className="p-3 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground">Days in Pipeline</p>
              <p className="font-semibold text-foreground mt-1">2 days</p>
            </div>
            <div className="p-3 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground">Next Action</p>
              <p className="font-semibold text-foreground mt-1">Schedule Technical</p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border pt-4 text-center">
            <p className="text-xs text-muted-foreground">Generated by Tread Talent Solutions • {new Date().toLocaleDateString()}</p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={() => { toast("Report copied to clipboard"); setReportModal(false) }}><Icon.Copy className="size-4" /> Copy Report</Button>
            <Button onClick={downloadCandidateReport}><Icon.Download className="size-4" /> Download PDF</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
