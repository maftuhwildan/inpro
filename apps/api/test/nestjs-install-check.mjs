import { readFileSync, existsSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('apps/api/package.json', 'utf8'))
const deps = pkg.dependencies ?? {}
const required = [
  '@nestjs/common',
  '@nestjs/core',
  '@nestjs/platform-express',
  'reflect-metadata',
  'rxjs'
]

for (const dep of required) {
  if (!deps[dep]) {
    throw new Error(`Missing dependency: ${dep}`)
  }
}

if (!existsSync('apps/api/dist/main.js')) {
  throw new Error('Build artifact missing: apps/api/dist/main.js')
}

console.log('nestjs install check passed')
