'use client'

import { useMemo, useState } from 'react'
import {
  ApiError,
  createTask,
  type ProjectDto,
  type TaskDto,
  type TaskStatus,
  updateTask,
} from '../../lib/api-client'

type TaskBoardProps = {
  initialTasks: TaskDto[]
  initialOverdueTasks: TaskDto[]
  projects: ProjectDto[]
  loadError?: string
}

type CreateTaskFormState = {
  projectId: string
  title: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

const PRIORITY_BADGE: Record<string, string> = {
  LOW: 'badge-default',
  MEDIUM: 'badge-info',
  HIGH: 'badge-warning',
  CRITICAL: 'badge-danger',
}

const STATUS_BADGE: Record<string, string> = {
  TODO: 'badge-outline',
  IN_PROGRESS: 'badge-info',
  BLOCKED: 'badge-danger',
  DONE: 'badge-success',
}

export function TaskBoard({ initialTasks, initialOverdueTasks, projects, loadError }: TaskBoardProps) {
  const [tasks, setTasks] = useState<TaskDto[]>(initialTasks)
  const [overdueTasks, setOverdueTasks] = useState<TaskDto[]>(initialOverdueTasks)
  const [error, setError] = useState<string | undefined>(loadError)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<CreateTaskFormState>({
    projectId: projects[0]?.id ?? '',
    title: '',
    priority: 'MEDIUM',
  })

  const editableTasks = useMemo(() => tasks.filter((task) => task.status !== 'DONE'), [tasks])

  async function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(undefined)
    if (!form.projectId || !form.title.trim()) {
      setError('Project and title are required')
      return
    }
    setSaving(true)
    try {
      const created = await createTask({ projectId: form.projectId, title: form.title, priority: form.priority })
      setTasks((prev) => [created, ...prev])
      setForm((prev) => ({ ...prev, title: '' }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
    } finally {
      setSaving(false)
    }
  }

  async function moveStatus(task: TaskDto, status: TaskStatus) {
    setError(undefined)
    try {
      const updated = await updateTask(task.id, { status, expectedUpdatedAt: task.updatedAt })
      setTasks((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      setOverdueTasks((prev) => prev.filter((item) => item.id !== updated.id))
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError('Task changed by another user. Refresh and retry.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to update task')
      }
    }
  }

  return (
    <div className="stack">
      {error ? <div className="alert alert-error">{error}</div> : null}

      {/* Create Task Form */}
      <div className="card">
        <div className="card-header"><h3>Create Task</h3></div>
        <div className="card-content">
          <form onSubmit={handleCreateTask} className="stack-sm">
            <div className="form-field">
              <label className="form-label">Project</label>
              <select className="select" value={form.projectId} onChange={(e) => setForm((s) => ({ ...s, projectId: e.target.value }))}>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Title</label>
              <input className="input" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} placeholder="Task title..." />
            </div>
            <div className="form-field">
              <label className="form-label">Priority</label>
              <select className="select" value={form.priority} onChange={(e) => setForm((s) => ({ ...s, priority: e.target.value as CreateTaskFormState['priority'] }))}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div><button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Task'}</button></div>
          </form>
        </div>
      </div>

      {/* Overdue Tasks */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ color: overdueTasks.length > 0 ? 'var(--destructive)' : undefined }}>
            ⚠ Overdue Tasks ({overdueTasks.length})
          </h3>
        </div>
        <div className="card-content">
          {overdueTasks.length === 0 ? (
            <p style={{ color: 'var(--success)' }}>✓ No overdue tasks</p>
          ) : (
            <ul className="stack-sm" style={{ listStyle: 'none', padding: 0 }}>
              {overdueTasks.map((task) => (
                <li key={task.id} className="row-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span>{task.title}</span>
                  <span className={`badge ${PRIORITY_BADGE[task.priority] ?? 'badge-default'}`}>{task.priority}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Task List */}
      <div className="card">
        <div className="card-header">
          <h3>Task List</h3>
          <span className="badge badge-outline">{editableTasks.length} active</span>
        </div>
        <div className="card-content" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const projectName = projects.find((project) => project.id === task.projectId)?.name ?? task.projectId
                return (
                  <tr key={task.id}>
                    <td style={{ fontWeight: 500 }}>{task.title}</td>
                    <td style={{ color: 'var(--muted-foreground)' }}>{projectName}</td>
                    <td><span className={`badge ${PRIORITY_BADGE[task.priority] ?? 'badge-default'}`}>{task.priority}</span></td>
                    <td><span className={`badge ${STATUS_BADGE[task.status] ?? 'badge-outline'}`}>{task.status}</span></td>
                    <td>
                      <div className="row">
                        {task.status !== 'IN_PROGRESS' ? <button className="btn btn-outline btn-sm" onClick={() => moveStatus(task, 'IN_PROGRESS')}>Start</button> : null}
                        {task.status !== 'DONE' ? <button className="btn btn-primary btn-sm" onClick={() => moveStatus(task, 'DONE')}>Done</button> : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {tasks.length === 0 ? (
                <tr><td colSpan={5} className="data-table-empty">No tasks yet</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
