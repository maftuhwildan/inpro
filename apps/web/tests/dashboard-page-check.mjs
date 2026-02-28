import { existsSync } from 'node:fs'
if (!existsSync('apps/web/app/dashboard/page.tsx')) throw new Error('Missing dashboard page')
console.log('dashboard page check passed')
