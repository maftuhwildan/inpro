import { AppShell } from '@/components/layout/app-shell'
import { ApiError, getProjects } from '@/lib/api-client'
import { ProjectListFeature } from '@/features/projects/project-list'

export default async function ProjectsPage() {
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
      <h1 className="text-3xl font-bold tracking-tight mb-6">Projects</h1>
      <ProjectListFeature initialProjects={projects} loadError={loadError} />
    </AppShell>
  )
}
