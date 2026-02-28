import { existsSync, readFileSync } from 'node:fs'

if (!existsSync('apps/web/lib/api-client.ts')) {
  throw new Error('Missing API client wrapper')
}

const projectPage = readFileSync('apps/web/app/projects/page.tsx', 'utf8')
if (!projectPage.includes('getProjects')) {
  throw new Error('Projects page should load list via API client')
}

const projectForm = readFileSync('apps/web/features/projects/project-form.tsx', 'utf8')
for (const marker of ['COMPLETED', 'progress = 100', 'PLANNING', 'max 25']) {
  if (!projectForm.includes(marker)) {
    throw new Error(`Missing validation marker in project form: ${marker}`)
  }
}

console.log('web projects integration check passed')
