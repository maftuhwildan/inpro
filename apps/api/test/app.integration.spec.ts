import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { AuthService } from '../src/modules/auth/auth.service'
import { ProjectsService } from '../src/modules/projects/projects.service'
import { TasksService } from '../src/modules/tasks/tasks.service'
import { DailyReportsService } from '../src/modules/daily-reports/daily-reports.service'

describe('API integration routes', () => {
  let app: INestApplication

  const authServiceMock = {
    login: jest.fn(),
  }

  const projectsServiceMock = {
    createProject: jest.fn(),
    listProjects: jest.fn(),
    updateProject: jest.fn(),
    createMilestone: jest.fn(),
  }

  const tasksServiceMock = {
    createTask: jest.fn(),
    listTasks: jest.fn(),
    updateTask: jest.fn(),
    listOverdueTasks: jest.fn(),
  }

  const reportsServiceMock = {
    createReport: jest.fn(),
    listReports: jest.fn(),
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue(authServiceMock)
      .overrideProvider(ProjectsService)
      .useValue(projectsServiceMock)
      .overrideProvider(TasksService)
      .useValue(tasksServiceMock)
      .overrideProvider(DailyReportsService)
      .useValue(reportsServiceMock)
      .compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })

  it('POST /auth/login should call auth service and return payload', async () => {
    authServiceMock.login.mockReturnValueOnce({ mode: 'web', session: { id: 's1' } })

    const payload = {
      email: 'pm@inpro.com',
      password: 'secret',
      mode: 'web',
    }

    const res = await request(app.getHttpServer()).post('/auth/login').send(payload).expect(201)

    expect(authServiceMock.login).toHaveBeenCalledWith(payload)
    expect(res.body).toEqual({ mode: 'web', session: { id: 's1' } })
  })

  it('GET /projects should return project list', async () => {
    projectsServiceMock.listProjects.mockResolvedValueOnce([{ id: 'p1', name: 'Pipeline Revamp' }])

    const res = await request(app.getHttpServer()).get('/projects').expect(200)

    expect(projectsServiceMock.listProjects).toHaveBeenCalledTimes(1)
    expect(res.body).toEqual([{ id: 'p1', name: 'Pipeline Revamp' }])
  })

  it('POST /projects should create project', async () => {
    const dto = {
      name: 'Tank Expansion',
      client: 'Pertamina',
      location: 'Balikpapan',
      startDate: '2026-03-01T00:00:00.000Z',
    }
    projectsServiceMock.createProject.mockResolvedValueOnce({ id: 'p2', ...dto })

    const res = await request(app.getHttpServer()).post('/projects').send(dto).expect(201)

    expect(projectsServiceMock.createProject).toHaveBeenCalledWith(dto)
    expect(res.body.id).toBe('p2')
  })

  it('POST /tasks should create task', async () => {
    const dto = {
      projectId: 'p2',
      title: 'Prepare permit package',
      priority: 'HIGH',
    }
    tasksServiceMock.createTask.mockResolvedValueOnce({ id: 't1', ...dto, status: 'TODO' })

    const res = await request(app.getHttpServer()).post('/tasks').set('x-idempotency-key', 'idem-1').send(dto).expect(201)

    expect(tasksServiceMock.createTask).toHaveBeenCalledWith(dto)
    expect(res.body.id).toBe('t1')
  })

  it('GET /tasks should return filtered list', async () => {
    tasksServiceMock.listTasks.mockResolvedValueOnce([{ id: 't1', projectId: 'p2' }])

    const res = await request(app.getHttpServer()).get('/tasks').query({ projectId: 'p2' }).expect(200)

    expect(tasksServiceMock.listTasks).toHaveBeenCalledWith('p2')
    expect(res.body).toEqual([{ id: 't1', projectId: 'p2' }])
  })

  it('POST /daily-reports should create report', async () => {
    const dto = {
      projectId: 'p2',
      reportDate: '2026-03-03T00:00:00.000Z',
      authorId: 'u1',
      activities: 'Site prep complete',
    }
    reportsServiceMock.createReport.mockResolvedValueOnce({ id: 'r1', ...dto })

    const res = await request(app.getHttpServer())
      .post('/daily-reports')
      .set('x-idempotency-key', 'idem-r1')
      .send(dto)
      .expect(201)

    expect(reportsServiceMock.createReport).toHaveBeenCalledWith(dto)
    expect(res.body.id).toBe('r1')
  })

  it('GET /daily-reports should return list', async () => {
    reportsServiceMock.listReports.mockResolvedValueOnce([{ id: 'r1', projectId: 'p2' }])

    const res = await request(app.getHttpServer()).get('/daily-reports').query({ projectId: 'p2' }).expect(200)

    expect(reportsServiceMock.listReports).toHaveBeenCalledWith('p2')
    expect(res.body).toEqual([{ id: 'r1', projectId: 'p2' }])
  })
})
