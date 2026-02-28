export class CreateProjectDto {
  name!: string
  client!: string
  location!: string
  startDate!: string
  endDate?: string
  picUserId?: string
}
