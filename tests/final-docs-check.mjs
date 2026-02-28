import { existsSync, readFileSync } from 'node:fs'

const required = [
  'docs/adr/0001-mvp-architecture.md',
  'docs/api/openapi.yaml',
  'README.md'
]

for (const file of required) {
  if (!existsSync(file)) throw new Error(`Missing final doc: ${file}`)
}

// Verify README has essential sections
const readme = readFileSync('README.md', 'utf8')
for (const marker of ['Inpro', 'apps/api', 'apps/web']) {
  if (!readme.includes(marker)) {
    throw new Error(`README.md missing reference: ${marker}`)
  }
}

// Verify ADR has key content
const adr = readFileSync('docs/adr/0001-mvp-architecture.md', 'utf8')
if (!adr.includes('modular') && !adr.includes('Modular')) {
  throw new Error('ADR must reference modular architecture')
}

console.log('final docs check passed')
