"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/* ---------- Status / Stage badges ---------- */

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-success/15 text-success",
    Open: "bg-success/15 text-success",
    Paused: "bg-warning/15 text-[#9a6700]",
    "On Hold": "bg-warning/15 text-[#9a6700]",
    Closed: "bg-muted text-muted-foreground",
    Confirmed: "bg-success/15 text-success",
    "Confirmation Sent": "bg-success/15 text-success",
    "Awaiting Response": "bg-warning/15 text-[#9a6700]",
    Accepted: "bg-success/15 text-success",
    "Pending Review": "bg-warning/15 text-[#9a6700]",
    Pending: "bg-warning/15 text-[#9a6700]",
    Rejected: "bg-danger/15 text-danger",
  }
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", map[status] || "bg-muted text-muted-foreground")}>
      {status}
    </span>
  )
}

const STAGE_COLORS: Record<string, string> = {
  Applied: "bg-slate-100 text-slate-600",
  Screened: "bg-blue-100 text-blue-700",
  Interview: "bg-indigo-100 text-indigo-700",
  Offer: "bg-amber-100 text-amber-700",
  Placed: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
}

export function StageBadge({ stage }: { stage: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", STAGE_COLORS[stage] || "bg-muted text-muted-foreground")}>
      {stage}
    </span>
  )
}

export function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "bg-success/15 text-success" : score >= 60 ? "bg-warning/15 text-[#9a6700]" : "bg-danger/15 text-danger"
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums", color)}>
      {score}%
    </span>
  )
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
      {category}
    </span>
  )
}

export function Flag({ flag }: { flag: { type: string; text: string } | null }) {
  if (!flag) return <span className="text-muted-foreground">—</span>
  const isError = flag.type === "error"
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", isError ? "text-danger" : "text-[#9a6700]")}>
      <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {isError ? (
          <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>
        ) : (
          <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>
        )}
      </svg>
      {flag.text}
    </span>
  )
}

/* ---------- Section label ---------- */

export function CardLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-xs font-medium uppercase tracking-wide text-muted-foreground", className)}>{children}</p>
}

/* ---------- Card ---------- */

export function Card({ children, className, ...props }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("rounded-xl border border-border bg-card shadow-sm", className)}>{children}</div>
}

/* ---------- Modal ---------- */

export function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }: { open: boolean; onClose: () => void; title: string; children: ReactNode; maxWidth?: string }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
      <div className={cn("w-full rounded-xl bg-card shadow-xl", maxWidth)}>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

/* ---------- Form fields ---------- */

const inputBase = "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"

export function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}{required && <span className="text-danger"> *</span>}
      </span>
      {children}
    </label>
  )
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputBase, props.className)} />
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputBase, props.className)} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputBase, "min-h-20 resize-y", props.className)} />
}

const selectChevron = "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='m6 9 6 6 6-6'/%3e%3c/svg%3e\")"

export function Select({ className, style, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{
        backgroundImage: selectChevron,
        backgroundPosition: "right 0.75rem center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "1rem",
        ...style,
      }}
      className={cn(inputBase, "appearance-none pr-9", className)}
    />
  )
}

/* ---------- Buttons ---------- */

export function Button({ variant = "primary", className, ...props }: { variant?: "primary" | "outline" | "ghost" | "success" | "danger" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-card text-foreground hover:bg-muted",
    ghost: "text-foreground hover:bg-muted",
    success: "bg-success text-success-foreground hover:bg-success/90",
    danger: "bg-danger text-danger-foreground hover:bg-danger/90",
  }
  return (
    <button {...props} className={cn("inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors active:scale-[0.98] disabled:opacity-50", variants[variant], className)} />
  )
}

/* ---------- Segmented control ---------- */

export function Segmented({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-muted p-0.5">
      {options.map((opt) => (
        <button key={opt} type="button" onClick={() => onChange(opt)}
          className={cn("rounded-md px-3 py-1 text-xs font-medium transition-colors", value === opt ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
          {opt}
        </button>
      ))}
    </div>
  )
}

/* ---------- Toggle ---------- */

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="inline-flex items-center gap-2">
      <span className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors", checked ? "bg-primary" : "bg-muted-foreground/30")}>
        <span className={cn("inline-block size-4 transform rounded-full bg-white shadow transition-transform", checked ? "translate-x-4" : "translate-x-0.5")} />
      </span>
      {label && <span className="text-sm text-foreground">{label}</span>}
    </button>
  )
}

/* ---------- Mini pipeline bar ---------- */

export function PipelineBar({ values }: { values: number[] }) {
  const total = values.reduce((a, b) => a + b, 0) || 1
  const colors = ["bg-slate-300", "bg-blue-400", "bg-indigo-400", "bg-amber-400", "bg-green-500"]
  return (
    <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
      {values.map((v, i) => (
        <div key={i} className={colors[i]} style={{ width: `${(v / total) * 100}%` }} />
      ))}
    </div>
  )
}
