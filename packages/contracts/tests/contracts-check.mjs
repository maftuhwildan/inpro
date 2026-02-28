import { existsSync, readFileSync } from 'node:fs'

const files = [
  'packages/contracts/package.json',
  'packages/contracts/src/index.ts',
  'packages/contracts/src/projects.ts',
  'packages/contracts/src/tasks.ts',
  'packages/contracts/src/daily-reports.ts'
]

for (const file of files) {
  if (!existsSync(file)) throw new Error(`Missing contracts file: ${file}`)
}

const idx = readFileSync('packages/contracts/src/index.ts', 'utf8')
for (const exp of ["'./projects'", "'./tasks'", "'./daily-reports'"]) {
  if (!idx.includes(exp)) throw new Error(`Missing export in contracts index: ${exp}`)
}

console.log('contracts check passed')
