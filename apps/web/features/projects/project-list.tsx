'use client'

import { useState } from 'react'
import type { ProjectDto } from '../../lib/api-client'
import { ProjectForm } from './project-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type ProjectListFeatureProps = { initialProjects: ProjectDto[]; loadError?: string }

const STATUS_BADGE: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'info' | 'destructive'> = {
  PLANNING: 'secondary', ACTIVE: 'success', ON_HOLD: 'warning', COMPLETED: 'info', CANCELLED: 'destructive',
}

export function ProjectListFeature({ initialProjects, loadError }: ProjectListFeatureProps) {
  const [projects, setProjects] = useState<ProjectDto[]>(initialProjects)
  const [editing, setEditing] = useState<ProjectDto | null>(null)

  return (
    <div className="space-y-4">
      {loadError ? <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{loadError}</div> : null}
      <ProjectForm mode="create" onSaved={(p) => setProjects((prev) => [p, ...prev])} />
      {editing ? <ProjectForm mode="edit" initialValue={editing} onSaved={(p) => { setProjects((prev) => prev.map((i) => (i.id === p.id ? p : i))); setEditing(null) }} onCancel={() => setEditing(null)} /> : null}

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Project List</CardTitle>
          <Badge variant="outline">{projects.length} projects</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Client</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead><TableHead>Progress</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell className="text-muted-foreground">{project.location}</TableCell>
                  <TableCell><Badge variant={STATUS_BADGE[project.status] ?? 'outline'}>{project.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-secondary overflow-hidden">
                        <div className={`h-full rounded-full ${project.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${project.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{project.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell><Button variant="outline" size="sm" onClick={() => setEditing(project)}>Edit</Button></TableCell>
                </TableRow>
              ))}
              {projects.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No projects yet</TableCell></TableRow> : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
