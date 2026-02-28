export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'

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
