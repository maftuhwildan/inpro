export class UpdateTaskDto {
  title?: string
  description?: string
  assigneeId?: string
  dueDate?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status?: 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE'
  expectedUpdatedAt?: string
}
