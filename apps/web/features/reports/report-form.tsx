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
                authorId: 'current-user', // placeholder until auth session is wired
                activities: form.activities,
            }
            if (form.blockers.trim()) payload.blockers = form.blockers
            if (form.notes.trim()) payload.notes = form.notes
            if (form.weather.trim()) payload.weather = form.weather
            if (form.manpower) payload.manpower = Number(form.manpower)

            const created = await createDailyReport(payload)
            onSaved(created)

            // Reset form for next entry
            setForm((prev) => ({
                ...prev,
                activities: '',
                blockers: '',
                notes: '',
                weather: '',
                manpower: '',
            }))
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError('Failed to submit daily report')
            }
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
        <section style={{ background: '#fff', border: '1px solid #d7dfd9', padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>Submit Daily Report</h3>

            {error ? <p style={{ color: '#b42318' }}>{error}</p> : null}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
                <label>
                    Report Date *
                    <input type="date" {...field('reportDate')} />
                    {fieldErrors.reportDate ? <span style={{ color: '#b42318', fontSize: 12 }}>{fieldErrors.reportDate}</span> : null}
                </label>

                <label>
                    Activities * (what was done today)
                    <textarea rows={3} {...field('activities')} />
                    {fieldErrors.activities ? <span style={{ color: '#b42318', fontSize: 12 }}>{fieldErrors.activities}</span> : null}
                </label>

                <label>
                    Blockers (issues encountered)
                    <textarea rows={2} {...field('blockers')} />
                </label>

                <label>
                    Notes (additional info)
                    <textarea rows={2} {...field('notes')} />
                </label>

                <label>
                    Weather
                    <input type="text" placeholder="e.g. Cerah, Hujan ringan" {...field('weather')} />
                </label>

                <label>
                    Manpower (jumlah pekerja)
                    <input type="number" min="0" {...field('manpower')} />
                    {fieldErrors.manpower ? <span style={{ color: '#b42318', fontSize: 12 }}>{fieldErrors.manpower}</span> : null}
                </label>

                <button type="submit" disabled={saving}>{saving ? 'Submitting...' : 'Submit Report'}</button>
            </form>
        </section>
    )
}
