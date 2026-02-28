import { existsSync, readFileSync } from 'node:fs'

const requiredFiles = [
  'apps/api/src/common/idempotency/idempotency.module.ts',
  'apps/api/src/common/idempotency/idempotency.interceptor.ts',
  'apps/api/src/common/idempotency/idempotency.service.ts',
  'apps/api/src/common/idempotency/idempotent.decorator.ts'
]

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    throw new Error(`Missing idempotency file: ${file}`)
  }
}

const tasksController = readFileSync('apps/api/src/modules/tasks/tasks.controller.ts', 'utf8')
const reportsController = readFileSync('apps/api/src/modules/daily-reports/daily-reports.controller.ts', 'utf8')

if (!tasksController.includes('@Idempotent()')) {
  throw new Error('TasksController must use @Idempotent() on sensitive mutation endpoint(s)')
}
if (!reportsController.includes('@Idempotent()')) {
  throw new Error('DailyReportsController must use @Idempotent() on submit endpoint')
}

const interceptor = readFileSync('apps/api/src/common/idempotency/idempotency.interceptor.ts', 'utf8')
for (const marker of ['x-idempotency-key', 'ExecutionContext', 'CallHandler']) {
  if (!interceptor.includes(marker)) {
    throw new Error(`IdempotencyInterceptor missing marker: ${marker}`)
  }
}

console.log('idempotency check passed')
