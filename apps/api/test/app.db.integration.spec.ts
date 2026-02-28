import 'dotenv/config'
import { execFileSync } from 'node:child_process'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { PrismaClient } from '@prisma/client'
import { AppModule } from '../src/app.module'

jest.setTimeout(90000)

function withSchema(url: string, schema: string): string {
  const parsed = new URL(url)
  parsed.searchParams.set('schema', schema)
  return parsed.toString()
}

describe('API DB integration', () => {
  let app: INestApplication | undefined
  let prisma: PrismaClient | undefined

  beforeAll(async () => {
    const baseDatabaseUrl = process.env.DATABASE_URL
    const baseDirectUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL

    if (!baseDatabaseUrl || !baseDirectUrl) {
      throw new Error('DATABASE_URL/DIRECT_URL is required for DB integration tests')
    }

    const testDatabaseUrl = withSchema(baseDatabaseUrl, 'inpro_test')
    const testDirectUrl = withSchema(baseDirectUrl, 'inpro_test')

    process.env.DATABASE_URL = testDatabaseUrl
    process.env.DIRECT_URL = testDirectUrl

    execFileSync(
      'pnpm.cmd',
      ['exec', 'prisma', 'db', 'push', '--force-reset', '--accept-data-loss', '--skip-generate'],
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          DATABASE_URL: testDatabaseUrl,
          DIRECT_URL: testDirectUrl,
        },
        stdio: 'inherit',
        shell: true,
      },
    )

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    prisma = new PrismaClient({
      datasources: {
        db: {
          url: testDatabaseUrl,
        },
      },
    })
  })

  afterAll(async () => {
    if (app) await app.close()
    if (prisma) await prisma.$disconnect()
  })

  it('should persist core entities with real db writes', async () => {
    if (!app || !prisma) {
      throw new Error('Test app not initialized')
    }

    const createProjectRes = await request(app.getHttpServer())
      .post('/projects')
      .send({
        name: 'Gas Compression Upgrade',
        client: 'Pertamina',
        location: 'Cepu',
        startDate: '2026-03-10T00:00:00.000Z',
      })
      .expect(201)

    const projectId = createProjectRes.body.id as string
    expect(projectId).toBeDefined()

    const createTaskRes = await request(app.getHttpServer())
      .post('/tasks')
      .set('x-idempotency-key', 'task-idem-1')
      .send({
        projectId,
        title: 'Install instrumentation',
        priority: 'HIGH',
      })
      .expect(201)

    expect(createTaskRes.body.id).toBeDefined()

    const createReportRes = await request(app.getHttpServer())
      .post('/daily-reports')
      .set('x-idempotency-key', 'report-idem-1')
      .send({
        projectId,
        reportDate: '2026-03-11T00:00:00.000Z',
        authorId: 'site-eng-1',
        activities: 'Instrumentation trenching done',
      })
      .expect(201)

    expect(createReportRes.body.id).toBeDefined()

    const taskCount = await prisma.task.count({ where: { projectId } })
    const reportCount = await prisma.dailyReport.count({ where: { projectId } })
    const auditCount = await prisma.auditLog.count({ where: { module: { in: ['projects', 'tasks', 'daily_reports'] } } })

    expect(taskCount).toBe(1)
    expect(reportCount).toBe(1)
    expect(auditCount).toBeGreaterThanOrEqual(3)
  })
})
