export class UpdateProjectDto {
  name?: string
  client?: string
  location?: string
  endDate?: string
  status?: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
  progress?: number
  picUserId?: string
  expectedUpdatedAt?: string
}
