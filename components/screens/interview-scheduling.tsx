"use client"

import { useState } from "react"
import { useApp } from "../app-context"
import { useStore } from "../store"
import { Card, CardLabel, StatusBadge, Button, Field, Select, TextInput, TextArea, Segmented, Toggle } from "../ui-kit"
import { Icon } from "../icons"
import { candidatesSeed } from "@/lib/data"

const TYPE_ICONS: Record<string, keyof typeof Icon> = { Phone: "Phone", "Phone Screen": "Phone", Video: "Video", "Video Call": "Video", "In-Person": "Pin" }
const JOB_OPTIONS = ["Senior Engineer", "Product Manager", "Marketing Manager", "UX Lead", "Logistics Lead", "Product Designer"]

export function InterviewScheduling() {
  const { go, toast } = useApp()
  const { interviews, setInterviews } = useStore()
  const [candidate, setCandidate] = useState(candidatesSeed[0].name)
  const [job, setJob] = useState(JOB_OPTIONS[0])
  const [type, setType] = useState("Video Call")
  const [duration, setDuration] = useState("60 min")
  const [slot1, setSlot1] = useState("")
  const [slot2, setSlot2] = useState("")
  const [notes, setNotes] = useState("Please bring examples of recent work...")
  const [sendEmail, setSendEmail] = useState(true)

  const schedule = () => {
    const typeBadge = type === "Phone Screen" ? "Phone" : type === "Video Call" ? "Video" : "In-Person"
    setInterviews((prev) => [{
      id: `i${Date.now()}`, name: candidate, job, client: "Apex Corp",
      date: slot1 ? new Date(slot1).toLocaleDateString("en-GB", { month: "short", day: "numeric" }) : "TBD",
      time: "TBD", duration, type: typeBadge, status: "Confirmation Sent",
    }, ...prev])
    setCandidate(candidatesSeed[0].name)
    setJob(JOB_OPTIONS[0])
    setType("Video Call")
    setDuration("60 min")
    setSlot1("")
    setSlot2("")
    setNotes("Please bring examples of recent work...")
    toast("Interview scheduled — confirmation sent")
  }

  return (
    <div className="space-y-3 sm:space-y-5">
      <h2 className="text-xl sm:text-[22px] font-semibold text-foreground">Interview Scheduling</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Form Section */}
        <Card className="lg:col-span-1 p-4 sm:p-5">
          <h3 className="mb-4 text-xs sm:text-sm font-semibold text-foreground">Schedule New Interview</h3>
          <div className="space-y-3 sm:space-y-4">
            {/* Candidate and Job - Side by side on tablet+, stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <Field label="Candidate">
                <Select value={candidate} onChange={(e) => setCandidate(e.target.value)} className="text-xs sm:text-sm">
                  {candidatesSeed.map((c) => <option key={c.id}>{c.name}</option>)}
                </Select>
              </Field>
              <Field label="Job">
                <Select value={job} onChange={(e) => setJob(e.target.value)} className="text-xs sm:text-sm">
                  {JOB_OPTIONS.map((j) => <option key={j}>{j}</option>)}
                </Select>
              </Field>
            </div>

            {/* Interview Type - Responsive radio buttons */}
            <div>
              <CardLabel className="mb-2 text-xs sm:text-sm">Interview Type</CardLabel>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                {["Phone Screen", "Video Call", "In-Person"].map((t) => (
                  <label key={t} className="flex items-center gap-2 text-xs sm:text-sm text-foreground cursor-pointer">
                    <input 
                      type="radio" 
                      name="itype" 
                      checked={type === t} 
                      onChange={() => setType(t)} 
                      className="accent-[var(--primary)] cursor-pointer"
                    />
                    <span className="whitespace-nowrap">{t}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Duration - Responsive segmented control */}
            <div>
              <CardLabel className="mb-2 text-xs sm:text-sm">Duration</CardLabel>
              <Segmented options={["30 min", "45 min", "60 min", "90 min"]} value={duration} onChange={setDuration} />
            </div>

            {/* Time Slots - Responsive inputs */}
            <Field label="Propose Time Slot 1">
              <TextInput 
                type="datetime-local" 
                value={slot1} 
                onChange={(e) => setSlot1(e.target.value)} 
                className="text-xs sm:text-sm"
              />
            </Field>

            <Field label="Propose Time Slot 2 (optional)">
              <TextInput 
                type="datetime-local" 
                value={slot2} 
                onChange={(e) => setSlot2(e.target.value)} 
                className="text-xs sm:text-sm"
              />
            </Field>

            {/* Notes - Responsive textarea */}
            <Field label="Notes to Candidate">
              <TextArea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs sm:text-sm min-h-20 sm:min-h-24"
              />
            </Field>

            {/* Send Email Toggle - Responsive layout */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="text-xs sm:text-sm font-medium text-foreground">Send Confirmation Email</span>
              <Toggle checked={sendEmail} onChange={setSendEmail} />
            </div>

            {/* Schedule Button - Full width on mobile */}
            <Button className="w-full text-xs sm:text-sm" onClick={schedule}>
              <Icon.Calendar className="size-3.5 sm:size-4" /> Schedule Interview
            </Button>
          </div>
        </Card>

        {/* Upcoming Interviews Section */}
        <div className="lg:col-span-2 space-y-2 sm:space-y-3">
          <h3 className="text-xs sm:text-sm font-semibold text-foreground px-1">Upcoming Interviews (Next 14 Days)</h3>
          {interviews.length === 0 ? (
            <Card className="py-8 sm:py-12 px-4 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">No upcoming interviews.</p>
            </Card>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {interviews.map((iv) => {
                const IconComp = Icon[TYPE_ICONS[iv.type] || "Calendar"]
                return (
                  <Card key={iv.id} className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                      {/* Interview Info */}
                      <div className="flex gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="flex size-8 sm:size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground shrink-0">
                          <IconComp className="size-4 sm:size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-xs sm:text-sm text-foreground truncate">{iv.name} — {iv.job}</p>
                          <p className="text-xs text-muted-foreground truncate">{iv.client}</p>
                          <p className="mt-1 text-xs text-foreground truncate">{iv.date}, {iv.time} · {iv.duration}</p>
                        </div>
                      </div>

                      {/* Badges and Status */}
                      <div className="flex flex-col sm:flex-col-reverse items-start sm:items-end gap-2">
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-accent-foreground whitespace-nowrap">
                          {iv.type}
                        </span>
                        <StatusBadge status={iv.status} />
                      </div>
                    </div>

                    {/* Action Buttons - Responsive layout */}
                    <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-border pt-2 sm:pt-3 gap-2">
                      <button 
                        onClick={() => go("candidate-profile", { candidateId: "sarah" })} 
                        className="text-xs font-medium text-primary hover:underline whitespace-nowrap"
                      >
                        View Profile
                      </button>
                      <button 
                        onClick={() => { setInterviews((prev) => prev.filter((x) => x.id !== iv.id)); toast("Interview cancelled") }} 
                        className="text-xs font-medium text-danger hover:underline whitespace-nowrap"
                      >
                        Cancel
                      </button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
