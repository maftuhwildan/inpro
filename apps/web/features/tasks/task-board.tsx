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
      const created = await createTask({
        projectId: form.projectId,
        title: form.title,
        priority: form.priority,
      })
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
      const updated = await updateTask(task.id, {
        status,
        expectedUpdatedAt: task.updatedAt,
      })

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
    <div style={{ display: 'grid', gap: 16 }}>
      {error ? <p style={{ color: '#b42318' }}>{error}</p> : null}

      <section style={{ background: '#fff', border: '1px solid #d7dfd9', padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Create Task</h3>
        <form onSubmit={handleCreateTask} style={{ display: 'grid', gap: 8 }}>
          <label>
            Project
            <select value={form.projectId} onChange={(e) => setForm((s) => ({ ...s, projectId: e.target.value }))}>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </label>

          <label>
            Title
            <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
          </label>

          <label>
            Priority
            <select value={form.priority} onChange={(e) => setForm((s) => ({ ...s, priority: e.target.value as CreateTaskFormState['priority'] }))}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </label>

          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Task'}</button>
        </form>
      </section>

      <section style={{ background: '#fff', border: '1px solid #d7dfd9', padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Overdue Tasks ({overdueTasks.length})</h3>
        <ul>
          {overdueTasks.map((task) => (
            <li key={task.id}>{task.title} ({task.status})</li>
          ))}
          {overdueTasks.length === 0 ? <li>No overdue tasks</li> : null}
        </ul>
      </section>

      <section style={{ background: '#fff', border: '1px solid #d7dfd9', padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Task List</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">Title</th>
              <th align="left">Project</th>
              <th align="left">Priority</th>
              <th align="left">Status</th>
              <th align="left">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const projectName = projects.find((project) => project.id === task.projectId)?.name ?? task.projectId
              return (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{projectName}</td>
                  <td>{task.priority}</td>
                  <td>{task.status}</td>
                  <td>
                    {task.status !== 'IN_PROGRESS' ? <button onClick={() => moveStatus(task, 'IN_PROGRESS')}>Start</button> : null}
                    {task.status !== 'DONE' ? <button onClick={() => moveStatus(task, 'DONE')}>Done</button> : null}
                  </td>
                </tr>
              )
            })}
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5}>No tasks yet</td>
              </tr>
            ) : null}
          </tbody>
        </table>

        <p style={{ fontSize: 12, color: '#555' }}>Editable tasks: {editableTasks.length}</p>
      </section>
    </div>
  )
}
