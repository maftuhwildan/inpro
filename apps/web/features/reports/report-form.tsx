'use client'

import { useState } from 'react'
import { ApiError, createDailyReport, type CreateDailyReportPayload } from '../../lib/api-client'

type ReportFormProps = {
    projectId: string
    onSaved: (report: any) => void
}

type FormState = {
    reportDate: string
    activities: string
    blockers: string
    notes: string
    weather: string
    manpower: string
}

function todayString(): string {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function ReportForm({ projectId, onSaved }: ReportFormProps) {
    const [form, setForm] = useState<FormState>({
        reportDate: todayString(),
        activities: '',
        blockers: '',
        notes: '',
        weather: '',
        manpower: '',
    })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | undefined>()
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    function validate(): boolean {
        const errors: Record<string, string> = {}
        if (!form.reportDate) errors.reportDate = 'Report date is required'
        if (!form.activities.trim()) errors.activities = 'Activities is required'
        if (form.manpower && (isNaN(Number(form.manpower)) || Number(form.manpower) < 0)) {
            errors.manpower = 'Manpower must be a non-negative number'
        }
        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(undefined)
        if (!validate()) return

        setSaving(true)
        try {
            const payload: CreateDailyReportPayload = {
                projectId,
                reportDate: form.reportDate,
                authorId: 'current-user',
                activities: form.activities,
            }
            if (form.blockers.trim()) payload.blockers = form.blockers
            if (form.notes.trim()) payload.notes = form.notes
            if (form.weather.trim()) payload.weather = form.weather
            if (form.manpower) payload.manpower = Number(form.manpower)

            const created = await createDailyReport(payload)
            onSaved(created)
            setForm((prev) => ({ ...prev, activities: '', blockers: '', notes: '', weather: '', manpower: '' }))
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to submit daily report')
        } finally {
            setSaving(false)
        }
    }

    function field(name: keyof FormState) {
        return {
            value: form[name],
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                setForm((s) => ({ ...s, [name]: e.target.value })),
        }
    }

    return (
        <div className="card">
            <div className="card-header"><h3>Submit Daily Report</h3></div>
            <div className="card-content">
                {error ? <div className="alert alert-error" style={{ marginBottom: 12 }}>{error}</div> : null}
                <form onSubmit={handleSubmit} className="stack-sm">
                    <div className="form-field">
                        <label className="form-label">Report Date *</label>
                        <input className="input" type="date" {...field('reportDate')} />
                        {fieldErrors.reportDate ? <span className="form-error">{fieldErrors.reportDate}</span> : null}
                    </div>
                    <div className="form-field">
                        <label className="form-label">Activities * (what was done today)</label>
                        <textarea className="textarea" rows={3} {...field('activities')} />
                        {fieldErrors.activities ? <span className="form-error">{fieldErrors.activities}</span> : null}
                    </div>
                    <div className="form-field">
                        <label className="form-label">Blockers (issues encountered)</label>
                        <textarea className="textarea" rows={2} {...field('blockers')} />
                    </div>
                    <div className="form-field">
                        <label className="form-label">Notes (additional info)</label>
                        <textarea className="textarea" rows={2} {...field('notes')} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div className="form-field">
                            <label className="form-label">Weather</label>
                            <input className="input" type="text" placeholder="e.g. Cerah, Hujan ringan" {...field('weather')} />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Manpower</label>
                            <input className="input" type="number" min="0" {...field('manpower')} />
                            {fieldErrors.manpower ? <span className="form-error">{fieldErrors.manpower}</span> : null}
                        </div>
                    </div>
                    <div><button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Submitting...' : 'Submit Report'}</button></div>
                </form>
            </div>
        </div>
    )
}
