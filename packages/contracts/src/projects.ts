export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'

export type ProjectDto = {
  id: string
  name: string
  client: string
  location: string
  status: ProjectStatus
  progress: number
  updatedAt: string
}

export type MilestoneDto = {
  id: string
  projectId: string
  title: string
  targetDate: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED'
}
