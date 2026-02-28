export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE'

export type ProjectDto = {
  id: string
  name: string
  client: string
  location: string
  startDate: string
  endDate?: string | null
  status: ProjectStatus
  progress: number
  updatedAt: string
}

export type TaskDto = {
  id: string
  projectId: string
  title: string
  description?: string
  assigneeId?: string
  dueDate?: string | null
  priority: TaskPriority
  status: TaskStatus
  updatedAt: string
}

export type CreateProjectPayload = {
  name: string
  client: string
  location: string
  startDate: string
  endDate?: string
  picUserId?: string
}

export type UpdateProjectPayload = {
  name?: string
  client?: string
  location?: string
  endDate?: string
  status?: ProjectStatus
  progress?: number
  picUserId?: string
  expectedUpdatedAt?: string
}

export type CreateTaskPayload = {
  projectId: string
  title: string
  description?: string
  assigneeId?: string
  dueDate?: string
  priority?: TaskPriority
}

export type UpdateTaskPayload = {
  title?: string
  description?: string
  assigneeId?: string
  dueDate?: string
  priority?: TaskPriority
  status?: TaskStatus
  expectedUpdatedAt?: string
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001'

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text()
  const payload = text ? JSON.parse(text) : null

  if (!res.ok) {
    const message = payload?.message ?? `Request failed (${res.status})`
    throw new ApiError(message, res.status)
  }

  return payload as T
}

function createIdempotencyKey(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export async function getProjects(): Promise<ProjectDto[]> {
  const res = await fetch(`${API_BASE_URL}/projects`, { cache: 'no-store' })
  return parseResponse<ProjectDto[]>(res)
}

export async function createProject(payload: CreateProjectPayload): Promise<ProjectDto> {
  const res = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseResponse<ProjectDto>(res)
}

export async function updateProject(id: string, payload: UpdateProjectPayload): Promise<ProjectDto> {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseResponse<ProjectDto>(res)
}

export async function getTasks(projectId?: string): Promise<TaskDto[]> {
  const query = projectId ? `?projectId=${encodeURIComponent(projectId)}` : ''
  const res = await fetch(`${API_BASE_URL}/tasks${query}`, { cache: 'no-store' })
  return parseResponse<TaskDto[]>(res)
}

export async function getOverdueTasks(): Promise<TaskDto[]> {
  const res = await fetch(`${API_BASE_URL}/tasks/overdue/list`, { cache: 'no-store' })
  return parseResponse<TaskDto[]>(res)
}

export async function createTask(payload: CreateTaskPayload): Promise<TaskDto> {
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-idempotency-key': createIdempotencyKey('task-create'),
    },
    body: JSON.stringify(payload),
  })
  return parseResponse<TaskDto>(res)
}

export async function updateTask(id: string, payload: UpdateTaskPayload): Promise<TaskDto> {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      'x-idempotency-key': createIdempotencyKey('task-update'),
    },
    body: JSON.stringify(payload),
  })
  return parseResponse<TaskDto>(res)
}
