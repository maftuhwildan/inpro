import { existsSync } from 'node:fs'
for (const file of ['apps/web/app/projects/page.tsx','apps/web/app/projects/[id]/page.tsx']) {
  if (!existsSync(file)) throw new Error(`Missing projects page: ${file}`)
}
console.log('projects pages check passed')
