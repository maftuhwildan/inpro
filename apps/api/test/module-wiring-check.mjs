import { existsSync, readFileSync } from 'node:fs'

const requiredModuleDirs = [
  'apps/api/src/modules/projects',
  'apps/api/src/modules/tasks',
  'apps/api/src/modules/daily-reports',
  'apps/api/src/modules/users-roles',
  'apps/api/src/modules/audit-logs'
]

for (const dir of requiredModuleDirs) {
  if (!existsSync(dir)) {
    throw new Error(`Missing module directory: ${dir}`)
  }
}

const appModulePath = 'apps/api/src/app.module.ts'
if (!existsSync(appModulePath)) {
  throw new Error('Missing app module: apps/api/src/app.module.ts')
}

const appModule = readFileSync(appModulePath, 'utf8')
const requiredImports = [
  'ProjectsModule',
  'TasksModule',
  'DailyReportsModule',
  'UsersRolesModule',
  'AuditLogsModule'
]

for (const imp of requiredImports) {
  if (!appModule.includes(imp)) {
    throw new Error(`AppModule missing import/registration: ${imp}`)
  }
}

console.log('module wiring check passed')
