import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('apps/api/package.json', 'utf8'))
if (!pkg.devDependencies?.jest || !pkg.devDependencies?.supertest) {
  throw new Error('Missing jest/supertest dependencies')
}
console.log('integration deps check passed')
