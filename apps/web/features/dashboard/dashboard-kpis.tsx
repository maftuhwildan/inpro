'use client'

import { useMemo } from 'react'
import type { DailyReportDto, ProjectDto, ProjectStatus, TaskDto } from '../../lib/api-client'

type DashboardKpisProps = {
  projects: ProjectDto[]
  overdueTasks: TaskDto[]
  recentReports: DailyReportDto[]
  loadError?: string
}

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; badge: string }> = {
  PLANNING: { label: 'Planning', color: '#71717a', badge: 'badge-default' },
  ACTIVE: { label: 'Active', color: '#16a34a', badge: 'badge-success' },
  ON_HOLD: { label: 'On Hold', color: '#d97706', badge: 'badge-warning' },
  COMPLETED: { label: 'Completed', color: '#2563eb', badge: 'badge-info' },
  CANCELLED: { label: 'Cancelled', color: '#dc2626', badge: 'badge-danger' },
}

export function DashboardKpisFeature({ projects, overdueTasks, recentReports, loadError }: DashboardKpisProps) {
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const status of Object.keys(STATUS_CONFIG)) counts[status] = 0
    for (const project of projects) counts[project.status] = (counts[project.status] ?? 0) + 1
    return counts
  }, [projects])

  const last5Reports = useMemo(() => recentReports.slice(0, 5), [recentReports])

  function formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })
    } catch { return dateStr }
  }

  return (
    <div className="stack-lg">
      {loadError ? <div className="alert alert-error">{loadError}</div> : null}

      {/* Widget 1: Project Status Cards */}
      <section>
        <h2 style={{ marginBottom: 12 }}>Projects by Status</h2>
        <div className="grid-cards">
          {(Object.keys(STATUS_CONFIG) as ProjectStatus[]).map((status) => (
            <div key={status} className="card kpi-card" style={{ borderLeftColor: STATUS_CONFIG[status].color }}>
              <div className="card-content" style={{ padding: '16px 20px' }}>
                <div className="kpi-value">{statusCounts[status] ?? 0}</div>
                <div className="kpi-label">{STATUS_CONFIG[status].label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Widget 2: Project Progress */}
      <div className="card">
        <div className="card-header"><h3>Project Progress</h3></div>
        <div className="card-content">
          {projects.length === 0 ? (
            <p style={{ color: 'var(--muted-foreground)' }}>No projects yet</p>
          ) : (
            <div className="stack-sm">
              {projects.map((project) => (
                <div key={project.id} style={{ display: 'grid', gridTemplateColumns: '1fr 50px', gap: 8, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{project.name}</div>
                    <div className="progress-track" style={{ marginTop: 4 }}>
                      <div
                        className={`progress-fill ${project.progress === 100 ? 'progress-fill-primary' : 'progress-fill-info'}`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8125rem', textAlign: 'right', color: 'var(--muted-foreground)' }}>{project.progress}%</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Widget 3: Overdue Tasks */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ color: overdueTasks.length > 0 ? 'var(--destructive)' : undefined }}>
            Overdue Tasks ({overdueTasks.length})
          </h3>
        </div>
        <div className="card-content">
          {overdueTasks.length === 0 ? (
            <p style={{ color: 'var(--success)' }}>✓ No overdue tasks</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {overdueTasks.map((task) => (
                  <tr key={task.id} className={task.priority === 'CRITICAL' ? 'row-critical' : ''}>
                    <td>{task.title}</td>
                    <td><span className={`badge badge-${task.priority === 'CRITICAL' ? 'danger' : task.priority === 'HIGH' ? 'warning' : 'default'}`}>{task.priority}</span></td>
                    <td><span className="badge badge-outline">{task.status}</span></td>
                    <td>{task.dueDate ? formatDate(task.dueDate) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Widget 4: Recent Daily Reports */}
      <div className="card">
        <div className="card-header"><h3>Recent Daily Reports</h3></div>
        <div className="card-content">
          {last5Reports.length === 0 ? (
            <p style={{ color: 'var(--muted-foreground)' }}>No reports yet</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Activities</th>
                  <th>Weather</th>
                </tr>
              </thead>
              <tbody>
                {last5Reports.map((report) => (
                  <tr key={report.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDate(report.reportDate)}</td>
                    <td style={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{report.activities}</td>
                    <td>{report.weather ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
