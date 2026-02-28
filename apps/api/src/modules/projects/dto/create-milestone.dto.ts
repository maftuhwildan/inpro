export class CreateMilestoneDto {
  title!: string
  targetDate!: string
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED'
}
