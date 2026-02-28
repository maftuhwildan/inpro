import { existsSync, readFileSync } from 'node:fs'

const requiredFiles = [
  'apps/api/src/modules/auth/guards/roles.guard.ts',
  'apps/api/src/modules/auth/guards/project-membership.guard.ts',
  'apps/api/src/modules/auth/decorators/roles.decorator.ts'
]

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    throw new Error(`Missing RBAC file: ${file}`)
  }
}

const rolesGuard = readFileSync('apps/api/src/modules/auth/guards/roles.guard.ts', 'utf8')
if (!rolesGuard.includes('CanActivate') || !rolesGuard.includes('Reflector')) {
  throw new Error('RolesGuard should implement CanActivate and use Reflector')
}

const membershipGuard = readFileSync('apps/api/src/modules/auth/guards/project-membership.guard.ts', 'utf8')
if (!membershipGuard.includes('CanActivate') || !membershipGuard.includes('projectId')) {
  throw new Error('ProjectMembershipGuard should check projectId access')
}

const decorator = readFileSync('apps/api/src/modules/auth/decorators/roles.decorator.ts', 'utf8')
if (!decorator.includes('SetMetadata') || !decorator.includes('roles')) {
  throw new Error('Roles decorator must set roles metadata')
}

console.log('rbac check passed')
