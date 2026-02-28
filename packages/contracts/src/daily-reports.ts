export type DailyReportDto = {
  id: string
  projectId: string
  reportDate: string
  authorId: string
  activities: string
  blockers?: string
  notes?: string
  attachmentsRef?: string
  weather?: string
  manpower?: number
  updatedAt: string
}
