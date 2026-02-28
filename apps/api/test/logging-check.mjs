import { existsSync } from 'node:fs'
for (const file of ['apps/api/src/common/logging/request-id.middleware.ts','apps/api/src/common/logging/logging.interceptor.ts']) {
  if (!existsSync(file)) throw new Error(`Missing logging file: ${file}`)
}
console.log('logging check passed')
