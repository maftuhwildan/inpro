'use client'

import { useCallback, useEffect, useState } from 'react'
import { ApiError, getDailyReports, type DailyReportDto, type ProjectDto } from '../../lib/api-client'
import { ReportForm } from './report-form'

type ReportListFeatureProps = {
  projects: ProjectDto[]
  loadError?: string
}

export function ReportListFeature({ projects, loadError }: ReportListFeatureProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id ?? '')
  const [reports, setReports] = useState<DailyReportDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(loadError)

  const fetchReports = useCallback(async (projectId: string) => {
    if (!projectId) return
    setLoading(true)
    setError(undefined)
    try {
      const data = await getDailyReports(projectId)
      setReports(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load reports')
      setReports([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedProjectId) fetchReports(selectedProjectId)
  }, [selectedProjectId, fetchReports])

  function handleReportCreated(report: DailyReportDto) {
    setReports((prev) => [report, ...prev])
  }

  function formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
    } catch { return dateStr }
  }

  return (
    <div className="stack">
      {error ? <div className="alert alert-error">{error}</div> : null}

      <div className="card">
        <div className="card-header"><h3>Select Project</h3></div>
        <div className="card-content">
          <select className="select" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
            {projects.length === 0 ? <option value="">No projects available</option> : null}
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name} — {project.client}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedProjectId ? <ReportForm projectId={selectedProjectId} onSaved={handleReportCreated} /> : null}

      <div className="card">
        <div className="card-header">
          <h3>Reports {loading ? '(loading...)' : ''}</h3>
          <span className="badge badge-outline">{reports.length} reports</span>
        </div>
        <div className="card-content" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Activities</th>
                <th>Blockers</th>
                <th>Weather</th>
                <th>Manpower</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(report.reportDate)}</td>
                  <td>{report.activities}</td>
                  <td style={{ color: report.blockers ? 'var(--destructive)' : 'var(--muted-foreground)' }}>{report.blockers ?? '—'}</td>
                  <td>{report.weather ?? '—'}</td>
                  <td>{report.manpower ?? '—'}</td>
                </tr>
              ))}
              {!loading && reports.length === 0 ? (
                <tr><td colSpan={5} className="data-table-empty">No reports for this project yet</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
