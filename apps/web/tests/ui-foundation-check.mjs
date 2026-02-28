import { existsSync } from 'node:fs'

const files = [
  'apps/web/app/layout.tsx',
  'apps/web/components/layout/app-shell.tsx',
  'apps/web/app/page.tsx'
]

for (const file of files) {
  if (!existsSync(file)) throw new Error(`Missing web foundation file: ${file}`)
}

console.log('web foundation check passed')
