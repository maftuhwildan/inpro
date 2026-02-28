import { existsSync } from 'node:fs'
if (!existsSync('apps/web/app/reports/page.tsx')) throw new Error('Missing reports page')
console.log('reports pages check passed')
