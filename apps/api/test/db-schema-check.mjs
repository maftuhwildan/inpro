import { existsSync, readFileSync } from 'node:fs'

const schemaPath = 'apps/api/prisma/schema.prisma'
if (!existsSync(schemaPath)) {
  throw new Error('Missing Prisma schema file')
}

const schema = readFileSync(schemaPath, 'utf8')
const requiredModels = [
  'model Project',
  'model Milestone',
  'model Task',
  'model DailyReport',
  'model User',
  'model Role',
  'model AuditLog'
]

for (const model of requiredModels) {
  if (!schema.includes(model)) {
    throw new Error(`Missing Prisma model: ${model}`)
  }
}

const migrationDir = 'apps/api/prisma/migrations/0001_init'
const migrationFile = `${migrationDir}/migration.sql`
if (!existsSync(migrationDir) || !existsSync(migrationFile)) {
  throw new Error('Missing initial migration: apps/api/prisma/migrations/0001_init/migration.sql')
}

const migrationSql = readFileSync(migrationFile, 'utf8')
const requiredTables = [
  'CREATE TABLE "projects"',
  'CREATE TABLE "milestones"',
  'CREATE TABLE "tasks"',
  'CREATE TABLE "daily_reports"',
  'CREATE TABLE "users"',
  'CREATE TABLE "roles"',
  'CREATE TABLE "audit_logs"'
]

for (const table of requiredTables) {
  if (!migrationSql.includes(table)) {
    throw new Error(`Missing migration table statement: ${table}`)
  }
}

console.log('prisma schema check passed')
