'use client'

import { useMemo, useState } from 'react'
import { ApiError, type CreateProjectPayload, createProject, type ProjectDto, type ProjectStatus, type UpdateProjectPayload, updateProject } from '../../lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Select, Label } from '@/components/ui/input'

type ProjectFormProps = { mode: 'create' | 'edit'; initialValue?: ProjectDto; onSaved: (p: ProjectDto) => void; onCancel?: () => void }
type FormState = { name: string; client: string; location: string; startDate: string; endDate: string; status: ProjectStatus; progress: string }
type FormErrors = Partial<Record<keyof FormState, string>> & { global?: string }

function toDateInput(v?: string | null): string { return v ? new Date(v).toISOString().slice(0, 10) : '' }
function buildInit(v?: ProjectDto): FormState {
  return { name: v?.name ?? '', client: v?.client ?? '', location: v?.location ?? '', startDate: toDateInput(v?.startDate), endDate: toDateInput(v?.endDate ?? null), status: v?.status ?? 'PLANNING', progress: String(v?.progress ?? 0) }
}
function validate(s: FormState): FormErrors {
  const e: FormErrors = {}
  if (!s.name.trim()) e.name = 'Required'; if (!s.client.trim()) e.client = 'Required'; if (!s.location.trim()) e.location = 'Required'
  if (!s.startDate) e.startDate = 'Required'
  if (s.endDate && s.startDate && new Date(s.endDate) < new Date(s.startDate)) e.endDate = 'Must be after start'
  const p = Number(s.progress); if (isNaN(p) || p < 0 || p > 100) e.progress = '0-100'
  if (s.status === 'COMPLETED' && p !== 100) e.progress = 'Must be 100'
  if (s.status === 'PLANNING' && p > 25) e.progress = 'Max 25 for Planning'
  return e
}

export function ProjectForm({ mode, initialValue, onSaved, onCancel }: ProjectFormProps) {
  const [state, setState] = useState<FormState>(() => buildInit(initialValue))
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)
  const title = useMemo(() => mode === 'create' ? 'Create Project' : 'Edit Project', [mode])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const errs = validate(state); setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setSaving(true)
    try {
      if (mode === 'create') {
        const payload: CreateProjectPayload = { name: state.name, client: state.client, location: state.location, startDate: new Date(state.startDate).toISOString(), endDate: state.endDate ? new Date(state.endDate).toISOString() : undefined }
        onSaved(await createProject(payload)); setState(buildInit())
      } else if (initialValue) {
        const payload: UpdateProjectPayload = { name: state.name, client: state.client, location: state.location, endDate: state.endDate ? new Date(state.endDate).toISOString() : undefined, status: state.status, progress: Number(state.progress), expectedUpdatedAt: initialValue.updatedAt }
        onSaved(await updateProject(initialValue.id, payload))
      }
      setErrors({})
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) setErrors({ global: 'Updated elsewhere. Refresh.' })
      else setErrors({ global: err instanceof Error ? err.message : 'Failed' })
    } finally { setSaving(false) }
  }

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {errors.global ? <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive mb-3">{errors.global}</div> : null}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1"><Label>Name *</Label><Input value={state.name} onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))} />{errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}</div>
          <div className="space-y-1"><Label>Client *</Label><Input value={state.client} onChange={(e) => setState((s) => ({ ...s, client: e.target.value }))} />{errors.client ? <p className="text-xs text-destructive">{errors.client}</p> : null}</div>
          <div className="space-y-1"><Label>Location *</Label><Input value={state.location} onChange={(e) => setState((s) => ({ ...s, location: e.target.value }))} />{errors.location ? <p className="text-xs text-destructive">{errors.location}</p> : null}</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label>Start Date *</Label><Input type="date" value={state.startDate} onChange={(e) => setState((s) => ({ ...s, startDate: e.target.value }))} />{errors.startDate ? <p className="text-xs text-destructive">{errors.startDate}</p> : null}</div>
            <div className="space-y-1"><Label>End Date</Label><Input type="date" value={state.endDate} onChange={(e) => setState((s) => ({ ...s, endDate: e.target.value }))} />{errors.endDate ? <p className="text-xs text-destructive">{errors.endDate}</p> : null}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label>Status</Label><Select value={state.status} onChange={(e) => setState((s) => ({ ...s, status: e.target.value as ProjectStatus }))}><option value="PLANNING">Planning</option><option value="ACTIVE">Active</option><option value="ON_HOLD">On Hold</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option></Select></div>
            <div className="space-y-1"><Label>Progress (%)</Label><Input type="number" min={0} max={100} value={state.progress} onChange={(e) => setState((s) => ({ ...s, progress: e.target.value }))} />{errors.progress ? <p className="text-xs text-destructive">{errors.progress}</p> : null}</div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : mode === 'create' ? 'Create' : 'Save'}</Button>
            {onCancel ? <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button> : null}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
