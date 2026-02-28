import { existsSync, readFileSync } from 'node:fs'

const auditServiceFile = 'apps/api/src/modules/audit-logs/audit-logs.service.ts'
if (!existsSync(auditServiceFile)) {
  throw new Error(`Missing audit service: ${auditServiceFile}`)
}

const serviceText = readFileSync(auditServiceFile, 'utf8')
if (!serviceText.includes('logAction')) {
  throw new Error('AuditLogsService must expose logAction()')
}

const mutationServices = [
  'apps/api/src/modules/projects/projects.service.ts',
  'apps/api/src/modules/tasks/tasks.service.ts',
  'apps/api/src/modules/daily-reports/daily-reports.service.ts'
]

for (const file of mutationServices) {
  const text = readFileSync(file, 'utf8')
  if (!text.includes('AuditLogsService')) {
    throw new Error(`Service missing AuditLogsService injection: ${file}`)
  }
  if (!text.includes('logAction(')) {
    throw new Error(`Service missing audit log call: ${file}`)
  }
}

console.log('audit integration check passed')
