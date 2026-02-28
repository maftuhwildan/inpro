'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  ApiError,
  getDailyReports,
  type DailyReportDto,
  type ProjectDto,
} from '../../lib/api-client'
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
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to load reports')
      }
      setReports([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedProjectId) {
      fetchReports(selectedProjectId)
    }
  }, [selectedProjectId, fetchReports])

  function handleProjectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedProjectId(e.target.value)
  }

  function handleReportCreated(report: DailyReportDto) {
    setReports((prev) => [report, ...prev])
  }

  function formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {error ? <p style={{ color: '#b42318' }}>{error}</p> : null}

      <section style={{ background: '#fff', border: '1px solid #d7dfd9', padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Select Project</h3>
        <select value={selectedProjectId} onChange={handleProjectChange} style={{ width: '100%', padding: 6 }}>
          {projects.length === 0 ? <option value="">No projects available</option> : null}
          {projects.map((project) => (
            <option key={project.id} value={project.id}>{project.name} — {project.client}</option>
          ))}
        </select>
      </section>

      {selectedProjectId ? (
        <ReportForm projectId={selectedProjectId} onSaved={handleReportCreated} />
      ) : null}

      <section style={{ background: '#fff', border: '1px solid #d7dfd9', padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>
          Reports {loading ? '(loading...)' : `(${reports.length})`}
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">Date</th>
              <th align="left">Activities</th>
              <th align="left">Blockers</th>
              <th align="left">Weather</th>
              <th align="left">Manpower</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{formatDate(report.reportDate)}</td>
                <td>{report.activities}</td>
                <td>{report.blockers ?? '—'}</td>
                <td>{report.weather ?? '—'}</td>
                <td>{report.manpower ?? '—'}</td>
              </tr>
            ))}
            {!loading && reports.length === 0 ? (
              <tr>
                <td colSpan={5}>No reports for this project yet</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  )
}
