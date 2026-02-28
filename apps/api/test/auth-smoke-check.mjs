import { existsSync, readFileSync } from 'node:fs'

const requiredFiles = [
  'apps/api/src/modules/auth/auth.module.ts',
  'apps/api/src/modules/auth/auth.controller.ts',
  'apps/api/src/modules/auth/auth.service.ts'
]

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    throw new Error(`Missing auth file: ${file}`)
  }
}

const controller = readFileSync('apps/api/src/modules/auth/auth.controller.ts', 'utf8')
if (!controller.includes("@Post('login')")) {
  throw new Error('AuthController must expose POST /auth/login')
}
if (!controller.includes('mode')) {
  throw new Error('AuthController should read mode from request body')
}

const service = readFileSync('apps/api/src/modules/auth/auth.service.ts', 'utf8')
if (!service.includes('login')) {
  throw new Error('AuthService should implement login()')
}
if (!service.includes('session') || !service.includes('accessToken') || !service.includes('refreshToken')) {
  throw new Error('AuthService login() must support web session and mobile token pair')
}

const appModule = readFileSync('apps/api/src/app.module.ts', 'utf8')
if (!appModule.includes('AuthModule')) {
  throw new Error('AppModule must register AuthModule')
}

console.log('auth smoke check passed')
