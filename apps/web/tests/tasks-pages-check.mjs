import { existsSync } from 'node:fs'
if (!existsSync('apps/web/app/tasks/page.tsx')) throw new Error('Missing tasks page')
console.log('tasks pages check passed')
