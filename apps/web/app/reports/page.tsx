import { AppShell } from '../../../components/layout/app-shell'
import { ApiError, getProjects } from '../../../lib/api-client'
import { ReportListFeature } from '../../../features/reports/report-list'

export default async function ReportsPage() {
  let loadError: string | undefined
  let projects = []

  try {
    projects = await getProjects()
  } catch (error) {
    if (error instanceof ApiError) {
      loadError = error.message
    } else {
      loadError = 'Failed to load projects from API'
    }
  }

  return (
    <AppShell>
      <h1>Daily Reports</h1>
      <ReportListFeature projects={projects} loadError={loadError} />
    </AppShell>
  )
}
