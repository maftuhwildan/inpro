'use client'

import { useMemo } from 'react'
import type { DailyReportDto, ProjectDto, ProjectStatus, TaskDto } from '../../lib/api-client'

type DashboardKpisProps = {
  projects: ProjectDto[]
  overdueTasks: TaskDto[]
  recentReports: DailyReportDto[]
  loadError?: string
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  PLANNING: 'Planning',
  ACTIVE: 'Active',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

const STATUS_COLORS: Record<ProjectStatus, string> = {
  PLANNING: '#6b7280',
  ACTIVE: '#16a34a',
  ON_HOLD: '#d97706',
  COMPLETED: '#2563eb',
  CANCELLED: '#dc2626',
}

export function DashboardKpisFeature({ projects, overdueTasks, recentReports, loadError }: DashboardKpisProps) {
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const status of Object.keys(STATUS_LABELS)) {
      counts[status] = 0
    }
    for (const project of projects) {
      counts[project.status] = (counts[project.status] ?? 0) + 1
    }
    return counts
  }, [projects])

  const last5Reports = useMemo(() => recentReports.slice(0, 5), [recentReports])

  function formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {loadError ? <p style={{ color: '#b42318' }}>{loadError}</p> : null}

      {/* Widget 1: Project Status Cards */}
      <section>
        <h2 style={{ marginBottom: 8 }}>Projects by Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {(Object.keys(STATUS_LABELS) as ProjectStatus[]).map((status) => (
            <div
              key={status}
              style={{
                background: '#fff',
                border: '1px solid #d7dfd9',
                borderLeft: `4px solid ${STATUS_COLORS[status]}`,
                padding: 12,
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 700 }}>{statusCounts[status] ?? 0}</div>
              <div style={{ fontSize: 13, color: '#555' }}>{STATUS_LABELS[status]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Widget 2: Project Progress */}
      <section style={{ background: '#fff', border: '1px solid #d7dfd9', padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Project Progress</h3>
        {projects.length === 0 ? (
          <p style={{ color: '#555' }}>No projects yet</p>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {projects.map((project) => (
              <div key={project.id} style={{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: 8, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{project.name}</div>
                  <div
                    style={{
                      height: 8,
                      background: '#e5e7eb',
                      borderRadius: 4,
                      marginTop: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${project.progress}%`,
                        background: project.progress === 100 ? '#16a34a' : '#2563eb',
                        borderRadius: 4,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
                <div style={{ fontSize: 13, textAlign: 'right', color: '#555' }}>{project.progress}%</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Widget 3: Overdue Tasks */}
      <section style={{ background: '#fff', border: '1px solid #d7dfd9', padding: 12 }}>
        <h3 style={{ marginTop: 0, color: overdueTasks.length > 0 ? '#b42318' : undefined }}>
          Overdue Tasks ({overdueTasks.length})
        </h3>
        {overdueTasks.length === 0 ? (
          <p style={{ color: '#16a34a' }}>No overdue tasks — great!</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">Task</th>
                <th align="left">Priority</th>
                <th align="left">Status</th>
                <th align="left">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {overdueTasks.map((task) => (
                <tr
                  key={task.id}
                  style={{
                    background: task.priority === 'CRITICAL' ? '#fef2f2' : undefined,
                    color: task.priority === 'CRITICAL' ? '#b42318' : undefined,
                  }}
                >
                  <td>{task.title}</td>
                  <td>{task.priority}</td>
                  <td>{task.status}</td>
                  <td>{task.dueDate ? formatDate(task.dueDate) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Widget 4: Recent Daily Reports */}
      <section style={{ background: '#fff', border: '1px solid #d7dfd9', padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Recent Daily Reports</h3>
        {last5Reports.length === 0 ? (
          <p style={{ color: '#555' }}>No reports yet</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">Date</th>
                <th align="left">Activities</th>
                <th align="left">Weather</th>
              </tr>
            </thead>
            <tbody>
              {last5Reports.map((report) => (
                <tr key={report.id}>
                  <td>{formatDate(report.reportDate)}</td>
                  <td style={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {report.activities}
                  </td>
                  <td>{report.weather ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
