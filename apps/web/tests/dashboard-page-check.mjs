import { existsSync, readFileSync } from 'node:fs'

if (!existsSync('apps/web/app/dashboard/page.tsx')) {
    throw new Error('Missing dashboard page')
}

if (!existsSync('apps/web/features/dashboard/dashboard-kpis.tsx')) {
    throw new Error('Missing dashboard feature component: dashboard-kpis.tsx')
}

const dashboardPage = readFileSync('apps/web/app/dashboard/page.tsx', 'utf8')
for (const marker of ['getProjects', 'getOverdueTasks', 'getDailyReports', 'DashboardKpisFeature']) {
    if (!dashboardPage.includes(marker)) {
        throw new Error(`Dashboard page must include marker: ${marker}`)
    }
}

const dashboardKpis = readFileSync('apps/web/features/dashboard/dashboard-kpis.tsx', 'utf8')
for (const marker of ['statusCounts', 'overdueTasks', 'recentReports', 'progress']) {
    if (!dashboardKpis.includes(marker)) {
        throw new Error(`dashboard-kpis.tsx missing marker: ${marker}`)
    }
}

console.log('dashboard integration check passed')
