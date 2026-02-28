export class CreateTaskDto {
  projectId!: string
  title!: string
  description?: string
  assigneeId?: string
  dueDate?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}
