'use client'

import { useMemo, useState } from 'react'
import { ApiError, createTask, type ProjectDto, type TaskDto, type TaskStatus, updateTask } from '../../lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input, Select, Label } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type TaskBoardProps = {
  initialTasks: TaskDto[]
  initialOverdueTasks: TaskDto[]
  projects: ProjectDto[]
  loadError?: string
}

const PRIORITY_BADGE: Record<string, 'default' | 'secondary' | 'warning' | 'destructive'> = {
  LOW: 'secondary', MEDIUM: 'default', HIGH: 'warning', CRITICAL: 'destructive',
}
const STATUS_BADGE: Record<string, 'outline' | 'info' | 'destructive' | 'success'> = {
  TODO: 'outline', IN_PROGRESS: 'info', BLOCKED: 'destructive', DONE: 'success',
}

export function TaskBoard({ initialTasks, initialOverdueTasks, projects, loadError }: TaskBoardProps) {
  const [tasks, setTasks] = useState<TaskDto[]>(initialTasks)
  const [overdueTasks, setOverdueTasks] = useState<TaskDto[]>(initialOverdueTasks)
  const [error, setError] = useState<string | undefined>(loadError)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ projectId: projects[0]?.id ?? '', title: '', priority: 'MEDIUM' as const })

  const editableTasks = useMemo(() => tasks.filter((t) => t.status !== 'DONE'), [tasks])

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(undefined)
    if (!form.projectId || !form.title.trim()) { setError('Project and title are required'); return }
    setSaving(true)
    try {
      const created = await createTask({ projectId: form.projectId, title: form.title, priority: form.priority })
      setTasks((prev) => [created, ...prev])
      setForm((prev) => ({ ...prev, title: '' }))
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed') } finally { setSaving(false) }
  }

  async function moveStatus(task: TaskDto, status: TaskStatus) {
    setError(undefined)
    try {
      const updated = await updateTask(task.id, { status, expectedUpdatedAt: task.updatedAt })
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      setOverdueTasks((prev) => prev.filter((t) => t.id !== updated.id))
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) setError('Task changed by another user. Refresh.')
      else setError(err instanceof Error ? err.message : 'Failed')
    }
  }

  return (
    <div className="space-y-4">
      {error ? <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}

      <Card>
        <CardHeader><CardTitle>Create Task</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-1"><Label>Project</Label><Select value={form.projectId} onChange={(e) => setForm((s) => ({ ...s, projectId: e.target.value }))}>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></div>
            <div className="space-y-1"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} placeholder="Task title..." /></div>
            <div className="space-y-1"><Label>Priority</Label><Select value={form.priority} onChange={(e) => setForm((s) => ({ ...s, priority: e.target.value as any }))}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></Select></div>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Task'}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className={overdueTasks.length > 0 ? 'text-destructive' : ''}>⚠ Overdue Tasks ({overdueTasks.length})</CardTitle></CardHeader>
        <CardContent>
          {overdueTasks.length === 0 ? <p className="text-green-600">✓ No overdue tasks</p> : (
            <div className="space-y-2">{overdueTasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm">{t.title}</span>
                <Badge variant={PRIORITY_BADGE[t.priority] ?? 'secondary'}>{t.priority}</Badge>
              </div>
            ))}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Task List</CardTitle>
          <Badge variant="outline">{editableTasks.length} active</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Project</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
            <TableBody>
              {tasks.map((task) => {
                const pName = projects.find((p) => p.id === task.projectId)?.name ?? task.projectId
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell className="text-muted-foreground">{pName}</TableCell>
                    <TableCell><Badge variant={PRIORITY_BADGE[task.priority] ?? 'secondary'}>{task.priority}</Badge></TableCell>
                    <TableCell><Badge variant={STATUS_BADGE[task.status] ?? 'outline'}>{task.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {task.status !== 'IN_PROGRESS' ? <Button variant="outline" size="sm" onClick={() => moveStatus(task, 'IN_PROGRESS')}>Start</Button> : null}
                        {task.status !== 'DONE' ? <Button size="sm" onClick={() => moveStatus(task, 'DONE')}>Done</Button> : null}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {tasks.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No tasks yet</TableCell></TableRow> : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
