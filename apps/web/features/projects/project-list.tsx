'use client'

import { useState } from 'react'
import type { ProjectDto } from '../../lib/api-client'
import { ProjectForm } from './project-form'

type ProjectListFeatureProps = {
  initialProjects: ProjectDto[]
  loadError?: string
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
    <div style={{ display: 'grid', gap: 16 }}>
      {loadError ? <p style={{ color: '#b42318' }}>{loadError}</p> : null}

      <ProjectForm mode="create" onSaved={onCreateSaved} />

      {editing ? <ProjectForm mode="edit" initialValue={editing} onSaved={onEditSaved} onCancel={() => setEditing(null)} /> : null}

      <section style={{ background: '#fff', border: '1px solid #d7dfd9', padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Project List</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">Name</th>
              <th align="left">Client</th>
              <th align="left">Location</th>
              <th align="left">Status</th>
              <th align="left">Progress</th>
              <th align="left">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>{project.client}</td>
                <td>{project.location}</td>
                <td>{project.status}</td>
                <td>{project.progress}%</td>
                <td><button onClick={() => setEditing(project)}>Edit</button></td>
              </tr>
            ))}
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6}>No projects yet</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  )
}
