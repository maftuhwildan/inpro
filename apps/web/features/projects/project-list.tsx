'use client'

import { useState } from 'react'
import type { ProjectDto } from '../../lib/api-client'
import { ProjectForm } from './project-form'

type ProjectListFeatureProps = {
  initialProjects: ProjectDto[]
  loadError?: string
}

const STATUS_BADGE: Record<string, string> = {
  PLANNING: 'badge-default',
  ACTIVE: 'badge-success',
  ON_HOLD: 'badge-warning',
  COMPLETED: 'badge-info',
  CANCELLED: 'badge-danger',
}

export function ProjectListFeature({ initialProjects, loadError }: ProjectListFeatureProps) {
  const [projects, setProjects] = useState<ProjectDto[]>(initialProjects)
  const [editing, setEditing] = useState<ProjectDto | null>(null)

  function onCreateSaved(project: ProjectDto) {
    setProjects((prev) => [project, ...prev])
  }

  function onEditSaved(project: ProjectDto) {
    setProjects((prev) => prev.map((item) => (item.id === project.id ? project : item)))
    setEditing(null)
  }

  return (
    <div className="stack">
      {loadError ? <div className="alert alert-error">{loadError}</div> : null}

      <ProjectForm mode="create" onSaved={onCreateSaved} />

      {editing ? <ProjectForm mode="edit" initialValue={editing} onSaved={onEditSaved} onCancel={() => setEditing(null)} /> : null}

      <div className="card">
        <div className="card-header">
          <h3>Project List</h3>
          <span className="badge badge-outline">{projects.length} projects</span>
        </div>
        <div className="card-content" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Client</th>
                <th>Location</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td style={{ fontWeight: 500 }}>{project.name}</td>
                  <td>{project.client}</td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{project.location}</td>
                  <td><span className={`badge ${STATUS_BADGE[project.status] ?? 'badge-outline'}`}>{project.status}</span></td>
                  <td>
                    <div className="row" style={{ gap: 6 }}>
                      <div className="progress-track" style={{ width: 80 }}>
                        <div className={`progress-fill ${project.progress === 100 ? 'progress-fill-primary' : 'progress-fill-info'}`} style={{ width: `${project.progress}%` }} />
                      </div>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>{project.progress}%</span>
                    </div>
                  </td>
                  <td><button className="btn btn-outline btn-sm" onClick={() => setEditing(project)}>Edit</button></td>
                </tr>
              ))}
              {projects.length === 0 ? (
                <tr><td colSpan={6} className="data-table-empty">No projects yet</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
