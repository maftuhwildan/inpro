import { existsSync } from 'node:fs'
if (!existsSync('apps/web/e2e/mvp-smoke.spec.ts')) throw new Error('Missing mvp smoke e2e spec')
console.log('e2e smoke check passed')
