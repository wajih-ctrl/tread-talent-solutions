// Seed data for Tread Talent Solutions prototype

export const PIPELINE_STAGES = ["Applied", "Screened", "Interview", "Offer", "Placed"]

export const clientsSeed = [
  {
    id: "apex",
    name: "Apex Corp",
    industry: "Technology",
    jobs: 3,
    candidates: 22,
    status: "Active",
    lastActivity: "2 days ago",
    contactName: "Helen Carter",
    contactEmail: "helen@apexcorp.com",
    contactPhone: "+44 20 7946 0011",
    notes: "Key account. Fast-moving engineering hires. Prefers weekly summaries.",
    pipeline: [22, 14, 6, 3, 2],
  },
  {
    id: "bluesky",
    name: "BlueSky Media",
    industry: "Marketing",
    jobs: 2,
    candidates: 15,
    status: "Active",
    lastActivity: "5 hours ago",
    contactName: "Daniel Reyes",
    contactEmail: "daniel@blueskymedia.com",
    contactPhone: "+44 161 496 0022",
    notes: "Creative roles. Portfolio review required before screen.",
    pipeline: [15, 9, 4, 1, 1],
  },
  {
    id: "greenfield",
    name: "Greenfield Logistics",
    industry: "Operations",
    jobs: 4,
    candidates: 31,
    status: "Active",
    lastActivity: "1 day ago",
    contactName: "Priyanka Das",
    contactEmail: "priyanka@greenfield-log.com",
    contactPhone: "+44 113 496 0033",
    notes: "High volume. Shift-based roles, location matters.",
    pipeline: [31, 18, 9, 3, 2],
  },
  {
    id: "nova",
    name: "Nova Health",
    industry: "Healthcare",
    jobs: 3,
    candidates: 12,
    status: "Active",
    lastActivity: "3 days ago",
    contactName: "Dr. Alan Whitfield",
    contactEmail: "alan@novahealth.org",
    contactPhone: "+44 20 7946 0044",
    notes: "Compliance checks mandatory. DBS required for all candidates.",
    pipeline: [12, 7, 4, 2, 2],
  },
  {
    id: "steelmark",
    name: "Steelmark Finance",
    industry: "Finance",
    jobs: 2,
    candidates: 7,
    status: "Paused",
    lastActivity: "1 week ago",
    contactName: "Margaret Lowe",
    contactEmail: "margaret@steelmark.co.uk",
    contactPhone: "+44 20 7946 0055",
    notes: "Hiring freeze until Q3. Keep warm pipeline only.",
    pipeline: [7, 4, 2, 1, 1],
  },
]

export const jobsSeed: Record<string, any[]> = {
  apex: [
    { id: "apex-se", title: "Senior Engineer", department: "Engineering", status: "Open", candidates: 8, analyzed: 8, created: "02 Jun 2026", location: "London, UK", type: "Full-Time", salary: "£75k–£90k", targetStart: "2026-08-01", description: "We are seeking a Senior Engineer to lead backend development of our data platform, mentoring a team of engineers and driving architectural decisions across cloud infrastructure." },
    { id: "apex-pm", title: "Product Manager", department: "Product", status: "Open", candidates: 9, analyzed: 6, created: "28 May 2026", location: "London, UK", type: "Full-Time", salary: "£65k–£80k", targetStart: "2026-07-15", description: "Own the product roadmap for our analytics suite, working closely with engineering and design to deliver customer value." },
    { id: "apex-de", title: "Data Engineer", department: "Engineering", status: "On Hold", candidates: 5, analyzed: 3, created: "20 May 2026", location: "Remote", type: "Contract", salary: "£500/day", targetStart: "2026-09-01", description: "Build and maintain data pipelines, ensuring reliable ingestion and transformation at scale." },
  ],
  bluesky: [
    { id: "bluesky-mm", title: "Marketing Manager", department: "Marketing", status: "Open", candidates: 8, analyzed: 8, created: "30 May 2026", location: "Manchester, UK", type: "Full-Time", salary: "£45k–£55k", targetStart: "2026-07-01", description: "Lead integrated marketing campaigns across digital and traditional channels for major media clients." },
    { id: "bluesky-ux", title: "UX Lead", department: "Design", status: "Open", candidates: 7, analyzed: 5, created: "22 May 2026", location: "Manchester, UK", type: "Full-Time", salary: "£55k–£65k", targetStart: "2026-08-01", description: "Define and drive UX strategy across product lines, leading a small team of designers." },
  ],
  greenfield: [
    { id: "gf-ll", title: "Logistics Lead", department: "Operations", status: "Open", candidates: 10, analyzed: 7, created: "01 Jun 2026", location: "Leeds, UK", type: "Full-Time", salary: "£40k–£48k", targetStart: "2026-07-10", description: "Coordinate warehouse and distribution operations, optimising routes and managing shift teams." },
    { id: "gf-wm", title: "Warehouse Manager", department: "Operations", status: "Open", candidates: 8, analyzed: 5, created: "25 May 2026", location: "Leeds, UK", type: "Full-Time", salary: "£38k–£44k", targetStart: "2026-07-20", description: "Run day-to-day warehouse operations including inventory, safety and team management." },
    { id: "gf-fa", title: "Fleet Analyst", department: "Operations", status: "On Hold", candidates: 7, analyzed: 4, created: "18 May 2026", location: "Remote", type: "Part-Time", salary: "£32k–£36k", targetStart: "2026-09-01", description: "Analyse fleet performance data to reduce costs and improve delivery efficiency." },
    { id: "gf-cs", title: "Supply Coordinator", department: "Operations", status: "Closed", candidates: 6, analyzed: 6, created: "10 May 2026", location: "Leeds, UK", type: "Full-Time", salary: "£30k–£34k", targetStart: "2026-06-15", description: "Coordinate supplier relationships and inbound logistics scheduling." },
  ],
  nova: [
    { id: "nova-pd", title: "Product Designer", department: "Design", status: "Open", candidates: 5, analyzed: 4, created: "29 May 2026", location: "London, UK", type: "Full-Time", salary: "£50k–£60k", targetStart: "2026-08-01", description: "Design patient-facing digital health experiences with a focus on accessibility and compliance." },
    { id: "nova-cn", title: "Clinical Nurse Specialist", department: "Clinical", status: "Open", candidates: 4, analyzed: 3, created: "21 May 2026", location: "London, UK", type: "Full-Time", salary: "£42k–£50k", targetStart: "2026-07-15", description: "Provide specialist clinical care and support across our outpatient services." },
    { id: "nova-da", title: "Data Analyst", department: "Analytics", status: "On Hold", candidates: 3, analyzed: 2, created: "15 May 2026", location: "Remote", type: "Contract", salary: "£400/day", targetStart: "2026-09-01", description: "Analyse health outcome data to support clinical decision making." },
  ],
  steelmark: [
    { id: "sm-fa", title: "Financial Analyst", department: "Finance", status: "On Hold", candidates: 4, analyzed: 3, created: "12 May 2026", location: "London, UK", type: "Full-Time", salary: "£48k–£58k", targetStart: "2026-09-15", description: "Support financial planning and analysis across investment portfolios." },
    { id: "sm-cm", title: "Compliance Manager", department: "Risk", status: "On Hold", candidates: 3, analyzed: 2, created: "08 May 2026", location: "London, UK", type: "Full-Time", salary: "£60k–£72k", targetStart: "2026-10-01", description: "Oversee regulatory compliance and risk frameworks across financial operations." },
  ],
}

export const defaultCriteria = [
  { id: "c1", label: "5+ years Python experience", weight: "High", required: true },
  { id: "c2", label: "Team leadership (5+ reports)", weight: "High", required: true },
  { id: "c3", label: "Agile methodology", weight: "Medium", required: false },
  { id: "c4", label: "Cloud experience (AWS)", weight: "Medium", required: true },
  { id: "c5", label: "FinTech domain knowledge", weight: "Low", required: false },
  { id: "c6", label: "Strong communication skills", weight: "Medium", required: false },
]

export const candidatesSeed = [
  { id: "sarah", name: "Sarah Chen", score: 91, stage: "Interview", summary: "Strong Python, led teams of 10+", flag: null, added: "3 days ago" },
  { id: "james", name: "James Patel", score: 84, stage: "Screened", summary: "Good tech skills, short tenure history", flag: { type: "warn", text: "Short tenures" }, added: "2 days ago" },
  { id: "priya", name: "Priya Sharma", score: 78, stage: "Applied", summary: "Meets 4/6 criteria", flag: null, added: "1 day ago" },
  { id: "tom", name: "Tom Reed", score: 72, stage: "Offer", summary: "Solid background, salary mismatch", flag: { type: "warn", text: "Salary" }, added: "5 days ago" },
  { id: "marcus", name: "Marcus Williams", score: 68, stage: "Screened", summary: "Partial match on experience", flag: null, added: "4 days ago" },
  { id: "lisa", name: "Lisa Nguyen", score: 62, stage: "Applied", summary: "Missing key Python requirement", flag: { type: "error", text: "Missing skill" }, added: "1 day ago" },
  { id: "david", name: "David Kim", score: 55, stage: "Applied", summary: "Limited relevant experience", flag: { type: "error", text: "Below threshold" }, added: "1 day ago" },
  { id: "emma", name: "Emma Johnson", score: 88, stage: "Interview", summary: "Excellent fit, strong references", flag: null, added: "3 days ago" },
]

export const activityFeed = [
  { type: "upload", text: "CV uploaded: James Patel → Senior Engineer @ Apex Corp", time: "20 min ago" },
  { type: "ai", text: "AI Analysis complete: Marketing Manager @ BlueSky (8 candidates scored)", time: "1 hr ago" },
  { type: "calendar", text: "Interview scheduled: Sarah Chen → Product Designer @ Nova Health", time: "2 hrs ago" },
  { type: "advance", text: "Candidate advanced: Tom Reed → Offer Stage @ Greenfield", time: "3 hrs ago" },
  { type: "email", text: "Email sent: Rejection — 4 candidates @ Steelmark", time: "4 hrs ago" },
  { type: "upload", text: "New CV imported: Excel batch (12 records) → Apex Corp", time: "Yesterday" },
  { type: "ai", text: "Hiring Manager Summary generated: UX Lead @ BlueSky", time: "2 days ago" },
  { type: "advance", text: "Placement confirmed: Rachel Moore → Nova Health", time: "3 days ago" },
]

export const upcomingInterviewsSeed = [
  { id: "i1", name: "Sarah Chen", job: "Senior Engineer", client: "Apex Corp", date: "Jun 13", time: "2:00 PM", duration: "60 min", type: "Video", status: "Confirmed" },
  { id: "i2", name: "Emma Johnson", job: "Senior Engineer", client: "Apex Corp", date: "Jun 14", time: "10:00 AM", duration: "45 min", type: "Phone", status: "Awaiting Response" },
  { id: "i3", name: "James Patel", job: "Product Designer", client: "Nova Health", date: "Jun 15", time: "3:00 PM", duration: "60 min", type: "Video", status: "Confirmed" },
  { id: "i4", name: "Priya Sharma", job: "Marketing Manager", client: "BlueSky Media", date: "Jun 16", time: "11:00 AM", duration: "45 min", type: "In-Person", status: "Confirmed" },
  { id: "i5", name: "Tom Reed", job: "Logistics Lead", client: "Greenfield Logistics", date: "Jun 17", time: "9:30 AM", duration: "30 min", type: "Phone", status: "Awaiting Response" },
]

export const analyzerSeed = [
  { id: "a1", name: "Sarah Chen", job: "Senior Engineer", client: "Apex Corp", score: 91, reason: "Strong Python, led teams of 10+", flag: null, status: "Accepted" },
  { id: "a2", name: "Emma Johnson", job: "Senior Engineer", client: "Apex Corp", score: 88, reason: "Excellent fit, strong references", flag: null, status: "Pending" },
  { id: "a3", name: "Rachel Moore", job: "Product Designer", client: "Nova Health", score: 86, reason: "Award-winning portfolio, healthcare UX", flag: null, status: "Accepted" },
  { id: "a4", name: "James Patel", job: "Senior Engineer", client: "Apex Corp", score: 84, reason: "Good tech skills, short tenure history", flag: { type: "warn", text: "Short tenures" }, status: "Pending" },
  { id: "a5", name: "Priya Sharma", job: "Marketing Manager", client: "BlueSky Media", score: 78, reason: "Meets 4/6 criteria", flag: null, status: "Pending" },
  { id: "a6", name: "Olivia Brooks", job: "Logistics Lead", client: "Greenfield Logistics", score: 75, reason: "Strong ops background, ready now", flag: null, status: "Pending" },
  { id: "a7", name: "Tom Reed", job: "Logistics Lead", client: "Greenfield Logistics", score: 72, reason: "Solid background, salary mismatch", flag: { type: "warn", text: "Salary" }, status: "Pending" },
  { id: "a8", name: "Marcus Williams", job: "Senior Engineer", client: "Apex Corp", score: 68, reason: "Partial match on experience", flag: null, status: "Pending" },
  { id: "a9", name: "Lisa Nguyen", job: "Senior Engineer", client: "Apex Corp", score: 62, reason: "Missing key Python requirement", flag: { type: "error", text: "Missing skill" }, status: "Rejected" },
  { id: "a10", name: "David Kim", job: "Marketing Manager", client: "BlueSky Media", score: 55, reason: "Limited relevant experience", flag: { type: "error", text: "Below threshold" }, status: "Rejected" },
]

export const templatesSeed = [
  { id: "t1", name: "Application Received Confirmation", category: "Inbound", edited: "08 Jun 2026", subject: "We've received your application — {{job_title}} at {{company_name}}", body: "Hi {{candidate_first_name}},\n\nThank you for applying for the {{job_title}} role at {{company_name}}. We've received your application and our team is reviewing it now.\n\nWe'll be in touch shortly with next steps.\n\nBest regards,\nMatt\nTread Talent Solutions" },
  { id: "t2", name: "Phone Screen Invitation", category: "Outreach", edited: "07 Jun 2026", subject: "Let's chat — {{job_title}} at {{company_name}}", body: "Hi {{candidate_first_name}},\n\nWe'd love to set up a brief phone screen for the {{job_title}} position at {{company_name}}. Please let me know your availability over the next few days.\n\nBest regards,\nMatt\nTread Talent Solutions" },
  { id: "t3", name: "Interview Confirmation", category: "Scheduling", edited: "09 Jun 2026", subject: "Re: Your Application — {{job_title}} at {{company_name}}", body: "Hi {{candidate_first_name}},\n\nI'm pleased to confirm your {{interview_type}} interview for the {{job_title}} position at {{company_name}}.\n\nDate: {{interview_date}}\nTime: {{interview_time}}\nDuration: {{duration}}\nFormat: {{interview_type}}\n\nPlease confirm receipt by replying to this email.\n\nBest regards,\nMatt\nTread Talent Solutions" },
  { id: "t4", name: "Candidate Rejection (Post-Screen)", category: "Rejection", edited: "06 Jun 2026", subject: "Update on your application — {{job_title}}", body: "Hi {{candidate_first_name}},\n\nThank you for taking the time to speak with us about the {{job_title}} role at {{company_name}}. After careful consideration, we've decided not to move forward at this time.\n\nWe wish you the very best in your search.\n\nBest regards,\nMatt\nTread Talent Solutions" },
  { id: "t5", name: "Offer Stage Notification", category: "Advancement", edited: "05 Jun 2026", subject: "Great news regarding {{job_title}} at {{company_name}}", body: "Hi {{candidate_first_name}},\n\nWe're delighted to move you to the offer stage for the {{job_title}} position at {{company_name}}. I'll be in touch shortly with full details.\n\nBest regards,\nMatt\nTread Talent Solutions" },
  { id: "t6", name: "Placement Confirmed", category: "Completion", edited: "04 Jun 2026", subject: "Welcome aboard — {{job_title}} at {{company_name}}", body: "Hi {{candidate_first_name}},\n\nCongratulations and welcome to {{company_name}}! Your placement for the {{job_title}} role is confirmed.\n\nBest regards,\nMatt\nTread Talent Solutions" },
]

export const variableTags = [
  "candidate_first_name", "candidate_last_name", "job_title", "company_name",
  "interview_date", "interview_time", "duration", "interview_type",
  "recruiter_name", "application_date",
]

export const automationRulesSeed = [
  { id: "r1", name: "Send Confirmation on Apply", trigger: "Candidate Added", template: "Application Received Confirmation", scope: "All Clients", active: true },
  { id: "r2", name: "Phone Screen Invite on Shortlist", trigger: "Moved to Screened", template: "Phone Screen Invitation", scope: "All Clients", active: true },
  { id: "r3", name: "Interview Confirm on Schedule", trigger: "Interview Scheduled", template: "Interview Confirmation", scope: "All Clients", active: true },
  { id: "r4", name: "Rejection Email on Reject", trigger: "Candidate Rejected", template: "Candidate Rejection (Post-Screen)", scope: "All Clients", active: true },
  { id: "r5", name: "Apex Offer Alert", trigger: "Moved to Offer", template: "Offer Stage Notification", scope: "Apex Corp", active: true },
]

export const clientMetrics = [
  { client: "Apex Corp", cvsIn: 42, screened: 18, interviewed: 9, offers: 4, placements: 2, conversion: "4.8%", days: "19 days" },
  { client: "BlueSky Media", cvsIn: 28, screened: 12, interviewed: 6, offers: 2, placements: 1, conversion: "3.6%", days: "24 days" },
  { client: "Greenfield Logistics", cvsIn: 31, screened: 14, interviewed: 7, offers: 3, placements: 2, conversion: "6.5%", days: "21 days" },
  { client: "Nova Health", cvsIn: 22, screened: 9, interviewed: 4, offers: 2, placements: 2, conversion: "9.1%", days: "18 days" },
  { client: "Steelmark Finance", cvsIn: 20, screened: 8, interviewed: 3, offers: 1, placements: 1, conversion: "5.0%", days: "31 days" },
]

export const funnelData = [
  { stage: "Applied", value: 143 },
  { stage: "Screened", value: 61 },
  { stage: "Interviewed", value: 29 },
  { stage: "Offers", value: 12 },
  { stage: "Placements", value: 8 },
]

export const evaluationCriteria = [
  { label: "5+ yrs Python", match: "Strong", status: "pass" },
  { label: "Team Leadership", match: "Confirmed (10+ reports)", status: "pass" },
  { label: "Agile Methodology", match: "Mentioned", status: "pass" },
  { label: "Cloud Experience (AWS)", match: "Partial", status: "warn" },
  { label: "FinTech Domain", match: "Not found", status: "fail" },
  { label: "Communication Skills", match: "Strong indicators", status: "pass" },
]
