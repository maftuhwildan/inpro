import { existsSync, readFileSync } from 'node:fs'

// File existence
if (!existsSync('apps/web/e2e/mvp-smoke.spec.ts')) throw new Error('Missing mvp smoke e2e spec')

// Smoke spec content checks
const smokeSpec = readFileSync('apps/web/e2e/mvp-smoke.spec.ts', 'utf8')
for (const route of ['/dashboard', '/projects', '/tasks', '/reports']) {
    if (!smokeSpec.includes(route)) {
        throw new Error(`Smoke spec must test route: ${route}`)
    }
}

// Verify all 4 page files exist
for (const page of [
    'apps/web/app/dashboard/page.tsx',
    'apps/web/app/projects/page.tsx',
    'apps/web/app/tasks/page.tsx',
    'apps/web/app/reports/page.tsx',
]) {
    if (!existsSync(page)) throw new Error(`Missing page: ${page}`)
}

// Verify each page imports API client
for (const [page, markers] of [
    ['apps/web/app/dashboard/page.tsx', ['getProjects', 'getOverdueTasks', 'getDailyReports']],
    ['apps/web/app/projects/page.tsx', ['getProjects']],
    ['apps/web/app/tasks/page.tsx', ['getTasks', 'getOverdueTasks']],
    ['apps/web/app/reports/page.tsx', ['getProjects']],
]) {
    const content = readFileSync(page, 'utf8')
    for (const marker of markers) {
        if (!content.includes(marker)) {
            throw new Error(`${page} missing api-client import: ${marker}`)
        }
    }
}

console.log('e2e smoke check passed')
