import { existsSync } from 'node:fs'

const required = [
  'docs/adr/0001-mvp-architecture.md',
  'docs/api/openapi.yaml',
  'README.md'
]
for (const file of required) {
  if (!existsSync(file)) throw new Error(`Missing final doc: ${file}`)
}
console.log('final docs check passed')
