import { existsSync, readFileSync } from 'node:fs'

const requiredFiles = [
  'apps/api/src/modules/daily-reports/daily-reports.controller.ts',
  'apps/api/src/modules/daily-reports/daily-reports.service.ts',
  'apps/api/src/modules/daily-reports/dto/create-daily-report.dto.ts'
]

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    throw new Error(`Missing daily reports API file: ${file}`)
  }
}

const controller = readFileSync('apps/api/src/modules/daily-reports/daily-reports.controller.ts', 'utf8')
for (const marker of ["@Controller('daily-reports')", "@Post()", '@Get()']) {
  if (!controller.includes(marker)) {
    throw new Error(`DailyReportsController missing endpoint marker: ${marker}`)
  }
}

const service = readFileSync('apps/api/src/modules/daily-reports/daily-reports.service.ts', 'utf8')
for (const marker of ['createReport', 'listReports']) {
  if (!service.includes(marker)) {
    throw new Error(`DailyReportsService missing method: ${marker}`)
  }
}

console.log('daily reports api check passed')
