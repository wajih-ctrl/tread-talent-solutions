"use client"

import { useState, type ChangeEvent } from "react"
import { useApp } from "../app-context"
import { useStore } from "../store"
import { Card, CardLabel, Button, Input, TextArea } from "../ui-kit"
import { Icon } from "../icons"
import { jobsSeed, clientsSeed } from "@/lib/data"

export function PublicJobApplication({ jobId }: { jobId: string }) {
  const { toast } = useApp()
  const { setCandidates } = useStore()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Find the job and client using seed data so public apply links work without route-specific store state
  const normalizedJobId = decodeURIComponent(jobId || "").trim().replace(/\/+$/, "").toLowerCase()
  const jobEntry = Object.entries(jobsSeed)
    .flatMap(([clientId, jobs]) => jobs.map((job) => ({ clientId, job })))
    .find(({ job }) => {
      const id = String(job.id).trim().toLowerCase()
      return id === normalizedJobId || id.endsWith(normalizedJobId) || normalizedJobId.endsWith(id)
    })

  const job = jobEntry?.job
  const client = jobEntry ? clientsSeed.find((c) => c.id === jobEntry.clientId) : null

  if (!job || !client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="p-6 sm:p-8 text-center">
          <Icon.Briefcase className="size-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h2 className="text-xl font-semibold text-foreground">Position Not Found</h2>
          <p className="text-sm text-muted-foreground mt-2">This position is no longer available or the link is invalid.</p>
        </Card>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      toast("Please fill in all required fields")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setCandidates((prev) => [
        {
          id: `app${Date.now()}`,
          name: name.trim(),
          score: 0,
          stage: "Applied",
          summary: "Submitted via public application",
          flag: null,
          added: "just now",
        },
        ...prev,
      ])

      setLoading(false)
      setSubmitted(true)
      toast("Application submitted successfully")
    }, 800)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="p-6 sm:p-8 text-center max-w-md">
          <div className="flex size-16 items-center justify-center rounded-full bg-success/20 mx-auto mb-4">
            <Icon.Check className="size-8 text-success" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Application Submitted</h2>
          <p className="text-sm text-muted-foreground mt-2">Thank you for applying for the {job.title} position at {client.name}.</p>
          <p className="text-sm text-muted-foreground mt-3">We've received your application and our team will review it shortly. You'll hear back from us within 3-5 business days.</p>
          <Button className="mt-6 w-full">Back to Tread Talent</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 text-white mx-auto mb-4">
            <Icon.Briefcase className="size-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Tread Talent Solutions</h1>
          <p className="text-muted-foreground mt-1">Recruiting Operations Platform</p>
        </div>

        {/* Job Details Card */}
        <Card className="p-6 sm:p-8 mb-6">
          <div className="mb-6 pb-6 border-b border-border">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{job.title}</h2>
            <p className="text-lg text-muted-foreground mt-1">{client.name}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">{job.location}</span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">{job.type}</span>
              <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">{job.salary}</span>
            </div>
          </div>

          <div className="prose prose-sm text-foreground max-w-none">
            <h3 className="text-lg font-semibold mb-2">About This Role</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
          </div>
        </Card>

        {/* Application Form Card */}
        <Card className="p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Submit Your Application</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2">
                <span className="text-sm font-medium text-foreground">Full Name *</span>
              </label>
              <Input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-2">
                <span className="text-sm font-medium text-foreground">Email Address *</span>
              </label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-2">
                <span className="text-sm font-medium text-foreground">Phone Number</span>
              </label>
              <Input
                type="tel"
                placeholder="+44 20 XXXX XXXX"
                value={phone}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2">
                <span className="text-sm font-medium text-foreground">Cover Letter or Notes (Optional)</span>
              </label>
              <TextArea
                placeholder="Tell us why you'd be a great fit for this role..."
                value={notes}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs font-medium text-blue-900 mb-1">CV Upload</p>
              <p className="text-xs text-blue-800">In the live version, you'd be able to upload your CV here. For now, please include a link or details in your cover letter above.</p>
            </div>

            <Button
              type="submit"
              className="w-full py-3 font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Icon.Clock className="size-4 animate-spin" /> Submitting...
                </span>
              ) : (
                "Submit Application"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By applying, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            © 2026 Tread Talent Solutions. This is a prototype application.
          </p>
        </div>
      </div>
    </div>
  )
}
