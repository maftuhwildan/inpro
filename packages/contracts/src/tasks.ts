export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE'

export type TaskDto = {
  id: string
  projectId: string
  title: string
  description?: string
  assigneeId?: string
  dueDate?: string
  priority: TaskPriority
  status: TaskStatus
  updatedAt: string
}
