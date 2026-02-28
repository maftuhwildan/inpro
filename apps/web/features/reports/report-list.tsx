'use client'

import { useCallback, useEffect, useState } from 'react'
import { ApiError, getDailyReports, type DailyReportDto, type ProjectDto } from '../../lib/api-client'
import { ReportForm } from './report-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type ReportListFeatureProps = { projects: ProjectDto[]; loadError?: string }

export function ReportListFeature({ projects, loadError }: ReportListFeatureProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id ?? '')
  const [reports, setReports] = useState<DailyReportDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(loadError)

  const fetchReports = useCallback(async (projectId: string) => {
    if (!projectId) return
    setLoading(true); setError(undefined)
    try { setReports(await getDailyReports(projectId)) }
    catch (err) { setError(err instanceof ApiError ? err.message : 'Failed'); setReports([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { if (selectedProjectId) fetchReports(selectedProjectId) }, [selectedProjectId, fetchReports])

  function formatDate(d: string): string {
    try { return new Date(d).toLocaleDateString('id-ID', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) }
    catch { return d }
  }

  return (
    <div className="space-y-4">
      {error ? <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}

      <Card>
        <CardHeader><CardTitle>Select Project</CardTitle></CardHeader>
        <CardContent>
          <Select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
            {projects.length === 0 ? <option value="">No projects available</option> : null}
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.client}</option>)}
          </Select>
        </CardContent>
      </Card>

      {selectedProjectId ? <ReportForm projectId={selectedProjectId} onSaved={(r) => setReports((prev) => [r, ...prev])} /> : null}

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Reports {loading ? '(loading...)' : ''}</CardTitle>
          <Badge variant="outline">{reports.length} reports</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Activities</TableHead><TableHead>Blockers</TableHead><TableHead>Weather</TableHead><TableHead>Manpower</TableHead></TableRow></TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap">{formatDate(r.reportDate)}</TableCell>
                  <TableCell>{r.activities}</TableCell>
                  <TableCell className={r.blockers ? 'text-destructive' : 'text-muted-foreground'}>{r.blockers ?? '—'}</TableCell>
                  <TableCell>{r.weather ?? '—'}</TableCell>
                  <TableCell>{r.manpower ?? '—'}</TableCell>
                </TableRow>
              ))}
              {!loading && reports.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No reports for this project yet</TableCell></TableRow> : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
