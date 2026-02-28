'use client'

import { useState } from 'react'
import { ApiError, createDailyReport, type CreateDailyReportPayload } from '../../lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Label } from '@/components/ui/input'

type ReportFormProps = { projectId: string; onSaved: (report: any) => void }
type FormState = { reportDate: string; activities: string; blockers: string; notes: string; weather: string; manpower: string }

function todayString(): string {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function ReportForm({ projectId, onSaved }: ReportFormProps) {
    const [form, setForm] = useState<FormState>({ reportDate: todayString(), activities: '', blockers: '', notes: '', weather: '', manpower: '' })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | undefined>()
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    function validate(): boolean {
        const e: Record<string, string> = {}
        if (!form.reportDate) e.reportDate = 'Required'
        if (!form.activities.trim()) e.activities = 'Required'
        if (form.manpower && (isNaN(Number(form.manpower)) || Number(form.manpower) < 0)) e.manpower = 'Must be ≥ 0'
        setFieldErrors(e); return Object.keys(e).length === 0
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); setError(undefined)
        if (!validate()) return
        setSaving(true)
        try {
            const payload: CreateDailyReportPayload = { projectId, reportDate: form.reportDate, authorId: 'current-user', activities: form.activities }
            if (form.blockers.trim()) payload.blockers = form.blockers
            if (form.notes.trim()) payload.notes = form.notes
            if (form.weather.trim()) payload.weather = form.weather
            if (form.manpower) payload.manpower = Number(form.manpower)
            onSaved(await createDailyReport(payload))
            setForm((prev) => ({ ...prev, activities: '', blockers: '', notes: '', weather: '', manpower: '' }))
        } catch (err) { setError(err instanceof ApiError ? err.message : 'Failed') } finally { setSaving(false) }
    }

    return (
        <Card>
            <CardHeader><CardTitle>Submit Daily Report</CardTitle></CardHeader>
            <CardContent>
                {error ? <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive mb-3">{error}</div> : null}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1"><Label>Report Date *</Label><Input type="date" value={form.reportDate} onChange={(e) => setForm((s) => ({ ...s, reportDate: e.target.value }))} />{fieldErrors.reportDate ? <p className="text-xs text-destructive">{fieldErrors.reportDate}</p> : null}</div>
                    <div className="space-y-1"><Label>Activities *</Label><Textarea rows={3} value={form.activities} onChange={(e) => setForm((s) => ({ ...s, activities: e.target.value }))} />{fieldErrors.activities ? <p className="text-xs text-destructive">{fieldErrors.activities}</p> : null}</div>
                    <div className="space-y-1"><Label>Blockers</Label><Textarea rows={2} value={form.blockers} onChange={(e) => setForm((s) => ({ ...s, blockers: e.target.value }))} /></div>
                    <div className="space-y-1"><Label>Notes</Label><Textarea rows={2} value={form.notes} onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))} /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1"><Label>Weather</Label><Input placeholder="e.g. Cerah, Hujan ringan" value={form.weather} onChange={(e) => setForm((s) => ({ ...s, weather: e.target.value }))} /></div>
                        <div className="space-y-1"><Label>Manpower</Label><Input type="number" min="0" value={form.manpower} onChange={(e) => setForm((s) => ({ ...s, manpower: e.target.value }))} />{fieldErrors.manpower ? <p className="text-xs text-destructive">{fieldErrors.manpower}</p> : null}</div>
                    </div>
                    <Button type="submit" disabled={saving}>{saving ? 'Submitting...' : 'Submit Report'}</Button>
                </form>
            </CardContent>
        </Card>
    )
}
