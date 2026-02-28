import { existsSync, readFileSync } from 'node:fs'

// File existence checks
for (const file of [
  'apps/api/src/common/logging/request-id.middleware.ts',
  'apps/api/src/common/logging/logging.interceptor.ts',
]) {
  if (!existsSync(file)) throw new Error(`Missing logging file: ${file}`)
}

// Request ID middleware markers
const middleware = readFileSync('apps/api/src/common/logging/request-id.middleware.ts', 'utf8')
for (const marker of ['randomUUID', 'x-request-id', 'requestId']) {
  if (!middleware.includes(marker)) {
    throw new Error(`request-id.middleware.ts missing marker: ${marker}`)
  }
}

// Logging interceptor markers
const interceptor = readFileSync('apps/api/src/common/logging/logging.interceptor.ts', 'utf8')
for (const marker of ['requestId', 'JSON.stringify', 'tookMs']) {
  if (!interceptor.includes(marker)) {
    throw new Error(`logging.interceptor.ts missing marker: ${marker}`)
  }
}

// main.ts wiring check
const mainTs = readFileSync('apps/api/src/main.ts', 'utf8')
for (const marker of ['RequestIdMiddleware', 'LoggingInterceptor']) {
  if (!mainTs.includes(marker)) {
    throw new Error(`main.ts must wire: ${marker}`)
  }
}

console.log('logging check passed')
