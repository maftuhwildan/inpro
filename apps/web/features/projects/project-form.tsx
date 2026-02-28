'use client'

import { useMemo, useState } from 'react'
import {
  ApiError,
  type CreateProjectPayload,
  createProject,
  type ProjectDto,
  type ProjectStatus,
  type UpdateProjectPayload,
  updateProject,
} from '../../lib/api-client'

type ProjectFormProps = {
  mode: 'create' | 'edit'
  initialValue?: ProjectDto
  onSaved: (project: ProjectDto) => void
  onCancel?: () => void
}

type FormState = {
  name: string
  client: string
  location: string
  startDate: string
  endDate: string
  status: ProjectStatus
  progress: string
}

type FormErrors = Partial<Record<keyof FormState, string>> & {
  global?: string
}

function toDateInput(value?: string | null): string {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 10)
}

function buildInitialFormState(initialValue?: ProjectDto): FormState {
  return {
    name: initialValue?.name ?? '',
    client: initialValue?.client ?? '',
    location: initialValue?.location ?? '',
    startDate: toDateInput(initialValue?.startDate),
    endDate: toDateInput(initialValue?.endDate ?? null),
    status: initialValue?.status ?? 'PLANNING',
    progress: String(initialValue?.progress ?? 0),
  }
}

function validate(state: FormState): FormErrors {
  const errors: FormErrors = {}

  if (!state.name.trim()) errors.name = 'Name is required'
  if (!state.client.trim()) errors.client = 'Client is required'
  if (!state.location.trim()) errors.location = 'Location is required'
  if (!state.startDate) errors.startDate = 'Start date is required'

  if (state.endDate && state.startDate && new Date(state.endDate) < new Date(state.startDate)) {
    errors.endDate = 'End date must be on/after start date'
  }

  const progress = Number(state.progress)
  if (Number.isNaN(progress) || progress < 0 || progress > 100) {
    errors.progress = 'Progress must be between 0 and 100'
  }

  if (state.status === 'COMPLETED' && progress !== 100) {
    errors.progress = 'Completed status requires progress = 100'
  }

  if (state.status === 'PLANNING' && progress > 25) {
    errors.progress = 'Planning status should stay at max 25 progress'
  }

  return errors
}

export function ProjectForm({ mode, initialValue, onSaved, onCancel }: ProjectFormProps) {
  const [state, setState] = useState<FormState>(() => buildInitialFormState(initialValue))
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)

  const title = useMemo(() => (mode === 'create' ? 'Create Project' : 'Edit Project'), [mode])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validate(state)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      if (mode === 'create') {
        const payload: CreateProjectPayload = {
          name: state.name,
          client: state.client,
          location: state.location,
          startDate: new Date(state.startDate).toISOString(),
          endDate: state.endDate ? new Date(state.endDate).toISOString() : undefined,
        }

        const created = await createProject(payload)
        onSaved(created)
        setState(buildInitialFormState())
      } else if (initialValue) {
        const payload: UpdateProjectPayload = {
          name: state.name,
          client: state.client,
          location: state.location,
          endDate: state.endDate ? new Date(state.endDate).toISOString() : undefined,
          status: state.status,
          progress: Number(state.progress),
          expectedUpdatedAt: initialValue.updatedAt,
        }
        const updated = await updateProject(initialValue.id, payload)
        onSaved(updated)
      }

      setErrors({})
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setErrors({ global: 'Project was updated elsewhere. Refresh and retry.' })
      } else if (error instanceof Error) {
        setErrors({ global: error.message })
      } else {
        setErrors({ global: 'Failed to save project' })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10, padding: 12, border: '1px solid #d7dfd9', background: '#fff' }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      {errors.global ? <p style={{ color: '#b42318', margin: 0 }}>{errors.global}</p> : null}

      <label>
        Name
        <input value={state.name} onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))} />
        {errors.name ? <span style={{ color: '#b42318' }}>{errors.name}</span> : null}
      </label>

      <label>
        Client
        <input value={state.client} onChange={(e) => setState((s) => ({ ...s, client: e.target.value }))} />
        {errors.client ? <span style={{ color: '#b42318' }}>{errors.client}</span> : null}
      </label>

      <label>
        Location
        <input value={state.location} onChange={(e) => setState((s) => ({ ...s, location: e.target.value }))} />
        {errors.location ? <span style={{ color: '#b42318' }}>{errors.location}</span> : null}
      </label>

      <label>
        Start Date
        <input type="date" value={state.startDate} onChange={(e) => setState((s) => ({ ...s, startDate: e.target.value }))} />
        {errors.startDate ? <span style={{ color: '#b42318' }}>{errors.startDate}</span> : null}
      </label>

      <label>
        End Date
        <input type="date" value={state.endDate} onChange={(e) => setState((s) => ({ ...s, endDate: e.target.value }))} />
        {errors.endDate ? <span style={{ color: '#b42318' }}>{errors.endDate}</span> : null}
      </label>

      <label>
        Status
        <select value={state.status} onChange={(e) => setState((s) => ({ ...s, status: e.target.value as ProjectStatus }))}>
          <option value="PLANNING">Planning</option>
          <option value="ACTIVE">Active</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </label>

      <label>
        Progress
        <input type="number" min={0} max={100} value={state.progress} onChange={(e) => setState((s) => ({ ...s, progress: e.target.value }))} />
        {errors.progress ? <span style={{ color: '#b42318' }}>{errors.progress}</span> : null}
      </label>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : mode === 'create' ? 'Create' : 'Save'}</button>
        {onCancel ? <button type="button" onClick={onCancel}>Cancel</button> : null}
      </div>
    </form>
  )
}
