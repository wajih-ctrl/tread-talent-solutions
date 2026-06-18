"use client"

import { useState } from "react"
import { clientMetrics, funnelData } from "@/lib/data"
import { Card, CardLabel, Button, Select } from "../ui-kit"
import { useApp } from "../app-context"
import { useStore } from "../store"

const TIME_TO_FILL = [
  { client: "Nova Health", days: 18 },
  { client: "Apex Corp", days: 19 },
  { client: "Greenfield Logistics", days: 21 },
  { client: "BlueSky Media", days: 24 },
  { client: "Steelmark Finance", days: 31 },
]

export function Reports() {
  const { toast, role, clientIdFilter } = useApp()
  const { clients } = useStore()
  const [range, setRange] = useState("Last 30 days")
  const [client, setClient] = useState("All Clients")

  const readonly = role === "client"
  const currentClient = readonly ? clients.find((item) => item.id === clientIdFilter) : null
  const selectedClient = currentClient ? currentClient.name : client
  const visibleMetrics = selectedClient === "All Clients"
    ? clientMetrics
    : clientMetrics.filter((item) => item.client === selectedClient)

  const totals = visibleMetrics.reduce(
    (acc, item) => ({
      cvsIn: acc.cvsIn + item.cvsIn,
      screened: acc.screened + item.screened,
      interviewed: acc.interviewed + item.interviewed,
      offers: acc.offers + item.offers,
      placements: acc.placements + item.placements,
    }),
    { cvsIn: 0, screened: 0, interviewed: 0, offers: 0, placements: 0 },
  )

  const reportFunnelData = selectedClient === "All Clients"
    ? funnelData
    : [
        { stage: "Applied", value: totals.cvsIn },
        { stage: "Screened", value: totals.screened },
        { stage: "Interviewed", value: totals.interviewed },
        { stage: "Offers", value: totals.offers },
        { stage: "Placements", value: totals.placements },
      ]

  const visibleTimeToFill = selectedClient === "All Clients"
    ? TIME_TO_FILL
    : TIME_TO_FILL.filter((item) => item.client === selectedClient)
  const maxFunnel = Math.max(1, ...reportFunnelData.map((item) => item.value))
  const maxDays = Math.max(1, ...visibleTimeToFill.map((item) => item.days))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reports &amp; Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentClient ? `Recruitment performance for ${currentClient.name}.` : "Recruitment performance across all clients and roles."}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Filter by date range</label>
            <Select value={range} onChange={(event) => setRange(event.target.value)} className="w-auto">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Year to date</option>
            </Select>
          </div>
          {!readonly && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Filter by client</label>
                <Select value={client} onChange={(event) => setClient(event.target.value)} className="w-auto">
                  <option>All Clients</option>
                  {clientMetrics.map((item) => (
                    <option key={item.client}>{item.client}</option>
                  ))}
                </Select>
              </div>
              <Button variant="outline" onClick={() => toast("Report exported as CSV")}>Export CSV</Button>
              <Button
                onClick={() => {
                  const doc = document.createElement("a")
                  doc.href = "/reports/sample.pdf"
                  doc.download = `Report-${range}.pdf`
                  doc.click()
                  toast("PDF report generated and downloaded")
                }}
              >
                Download PDF
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-4">
          <CardLabel>Total CVs In</CardLabel>
          <p className="mt-1 text-2xl font-semibold text-foreground">{totals.cvsIn}</p>
        </Card>
        <Card className="p-4">
          <CardLabel>Interviews</CardLabel>
          <p className="mt-1 text-2xl font-semibold text-foreground">{totals.interviewed}</p>
        </Card>
        <Card className="p-4">
          <CardLabel>Offers</CardLabel>
          <p className="mt-1 text-2xl font-semibold text-foreground">{totals.offers}</p>
        </Card>
        <Card className="p-4">
          <CardLabel>Placements</CardLabel>
          <p className="mt-1 text-2xl font-semibold text-success">{totals.placements}</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-foreground">Recruitment Funnel</h2>
          <p className="mb-5 text-xs text-muted-foreground">{range} - {selectedClient}</p>
          <div className="flex flex-col gap-3">
            {reportFunnelData.map((item, index) => {
              const pct = (item.value / maxFunnel) * 100
              const conv = index === 0 ? 100 : Math.round((item.value / (reportFunnelData[0].value || 1)) * 100)
              return (
                <div key={item.stage}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{item.stage}</span>
                    <span className="tabular-nums text-muted-foreground">{item.value} - {conv}%</span>
                  </div>
                  <div className="h-6 w-full overflow-hidden rounded-md bg-muted">
                    <div className="flex h-full items-center rounded-md bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold text-foreground">Avg Time to Fill (days)</h2>
          <p className="mb-5 text-xs text-muted-foreground">Lower is better</p>
          <div className="flex flex-col gap-3">
            {visibleTimeToFill.map((item) => (
              <div key={item.client} className="flex items-center gap-3">
                <span className="w-36 shrink-0 truncate text-xs text-foreground">{item.client}</span>
                <div className="h-5 flex-1 overflow-hidden rounded-md bg-muted">
                  <div
                    className={`h-full rounded-md ${item.days <= 20 ? "bg-success" : item.days <= 28 ? "bg-warning" : "bg-danger"}`}
                    style={{ width: `${(item.days / maxDays) * 100}%` }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{item.days}d</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold text-foreground">{readonly ? "Your Performance" : "Client Performance"}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3 text-right">CVs In</th>
                <th className="px-4 py-3 text-right">Screened</th>
                <th className="px-4 py-3 text-right">Interviewed</th>
                <th className="px-4 py-3 text-right">Offers</th>
                <th className="px-4 py-3 text-right">Placements</th>
                <th className="px-4 py-3 text-right">Conversion</th>
                <th className="px-4 py-3 text-right">Avg Time</th>
              </tr>
            </thead>
            <tbody>
              {visibleMetrics.map((item) => (
                <tr key={item.client} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="px-4 py-3 font-medium text-foreground">{item.client}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{item.cvsIn}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{item.screened}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{item.interviewed}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{item.offers}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium text-success">{item.placements}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{item.conversion}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{item.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
