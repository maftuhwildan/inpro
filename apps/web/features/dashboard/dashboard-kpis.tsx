'use client'

import { useMemo } from 'react'
import type { DailyReportDto, ProjectDto, ProjectStatus, TaskDto } from '../../lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type DashboardKpisProps = {
  projects: ProjectDto[]
  overdueTasks: TaskDto[]
  recentReports: DailyReportDto[]
  loadError?: string
}

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; badge: 'default' | 'success' | 'warning' | 'info' | 'destructive' }> = {
  PLANNING: { label: 'Planning', color: 'border-l-zinc-400', badge: 'default' },
  ACTIVE: { label: 'Active', color: 'border-l-green-500', badge: 'success' },
  ON_HOLD: { label: 'On Hold', color: 'border-l-amber-500', badge: 'warning' },
  COMPLETED: { label: 'Completed', color: 'border-l-blue-500', badge: 'info' },
  CANCELLED: { label: 'Cancelled', color: 'border-l-red-500', badge: 'destructive' },
}

const PRIORITY_BADGE: Record<string, 'default' | 'secondary' | 'warning' | 'destructive'> = {
  LOW: 'secondary',
  MEDIUM: 'default',
  HIGH: 'warning',
  CRITICAL: 'destructive',
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
    <div className="space-y-6">
      {loadError ? <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{loadError}</div> : null}

      {/* Widget 1: Project Status Cards */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Projects by Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {(Object.keys(STATUS_CONFIG) as ProjectStatus[]).map((status) => (
            <Card key={status} className={`border-l-4 ${STATUS_CONFIG[status].color}`}>
              <CardContent className="p-4">
                <div className="text-3xl font-bold">{statusCounts[status] ?? 0}</div>
                <div className="text-xs text-muted-foreground mt-1">{STATUS_CONFIG[status].label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Widget 2: Project Progress */}
      <Card>
        <CardHeader><CardTitle>Project Progress</CardTitle></CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-muted-foreground">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="grid grid-cols-[1fr_50px] gap-3 items-center">
                  <div>
                    <div className="text-sm font-medium">{project.name}</div>
                    <div className="h-2 rounded-full bg-secondary mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${project.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-right text-muted-foreground">{project.progress}%</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Widget 3: Overdue Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className={overdueTasks.length > 0 ? 'text-destructive' : ''}>
            Overdue Tasks ({overdueTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {overdueTasks.length === 0 ? (
            <p className="text-green-600">✓ No overdue tasks</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overdueTasks.map((task) => (
                  <TableRow key={task.id} className={task.priority === 'CRITICAL' ? 'bg-red-50' : ''}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell><Badge variant={PRIORITY_BADGE[task.priority] ?? 'secondary'}>{task.priority}</Badge></TableCell>
                    <TableCell><Badge variant="outline">{task.status}</Badge></TableCell>
                    <TableCell>{task.dueDate ? formatDate(task.dueDate) : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Widget 4: Recent Daily Reports */}
      <Card>
        <CardHeader><CardTitle>Recent Daily Reports</CardTitle></CardHeader>
        <CardContent>
          {last5Reports.length === 0 ? (
            <p className="text-muted-foreground">No reports yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Activities</TableHead>
                  <TableHead>Weather</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {last5Reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="whitespace-nowrap">{formatDate(report.reportDate)}</TableCell>
                    <TableCell className="max-w-[400px] truncate">{report.activities}</TableCell>
                    <TableCell>{report.weather ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
