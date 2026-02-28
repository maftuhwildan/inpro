import { existsSync, readFileSync } from 'node:fs'

if (!existsSync('apps/web/app/reports/page.tsx')) throw new Error('Missing reports page')

if (!existsSync('apps/web/features/reports/report-list.tsx')) {
    throw new Error('Missing reports feature component: report-list.tsx')
}

if (!existsSync('apps/web/features/reports/report-form.tsx')) {
    throw new Error('Missing reports feature component: report-form.tsx')
}

const reportsPage = readFileSync('apps/web/app/reports/page.tsx', 'utf8')
for (const marker of ['getProjects', 'ReportListFeature']) {
    if (!reportsPage.includes(marker)) {
        throw new Error(`Reports page must include marker: ${marker}`)
    }
}

const reportList = readFileSync('apps/web/features/reports/report-list.tsx', 'utf8')
for (const marker of ['getDailyReports', 'ReportForm', 'selectedProjectId']) {
    if (!reportList.includes(marker)) {
        throw new Error(`report-list.tsx missing marker: ${marker}`)
    }
}

const reportForm = readFileSync('apps/web/features/reports/report-form.tsx', 'utf8')
for (const marker of ['createDailyReport', 'reportDate', 'activities', 'validate']) {
    if (!reportForm.includes(marker)) {
        throw new Error(`report-form.tsx missing marker: ${marker}`)
    }
}

const apiClient = readFileSync('apps/web/lib/api-client.ts', 'utf8')
if (!apiClient.includes('getDailyReports')) {
    throw new Error('api-client must export getDailyReports function')
}
if (!apiClient.includes('createDailyReport')) {
    throw new Error('api-client must export createDailyReport function')
}
if (!apiClient.includes("createIdempotencyKey('report-create')")) {
    throw new Error('createDailyReport must use x-idempotency-key')
}

console.log('reports integration check passed')
