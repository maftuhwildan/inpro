# Web Projects Hybrid Integration Design

Date: 2026-02-28
Status: Approved

## Scope

Implement `Projects` web feature with:
- List projects (SSR initial load)
- Create project (client mutation)
- Edit project (client mutation)

Approach selected:
- Hybrid data flow: SSR list + client mutation

## Architecture

- `apps/web/app/projects/page.tsx`
  - Fetch initial project list server-side from API.
  - Pass initial data into feature layer.

- `apps/web/lib/api-client.ts`
  - Centralized API wrapper with base URL from `NEXT_PUBLIC_API_BASE_URL`.
  - Methods:
    - `getProjects()`
    - `createProject(payload)`
    - `updateProject(id, payload)`
  - Parse and normalize API errors.

- `apps/web/features/projects/project-list.tsx`
  - Render list from initial SSR data.
  - Manage local list state for optimistic refresh after mutation.
  - Trigger create/edit form actions.

- `apps/web/features/projects/project-form.tsx`
  - Shared form for create and edit modes.
  - Client-side strict validation before API call.

## Validation Rules

Required fields:
- `name`
- `client`
- `location`
- `startDate`

Date rules:
- `endDate` (if provided) must be >= `startDate`

Status-progress rules:
- `progress` must be in `[0, 100]`
- `status = COMPLETED` requires `progress = 100`
- `status = PLANNING` should stay low-progress (enforced as max 25 in UI validation)

## Error Handling

- Field-level validation errors shown inline.
- API/network errors shown as global error banner.
- Conflict response (`409`) shown as: refresh and retry guidance.

## Testing Strategy

- Keep existing page checks passing.
- Add targeted checks for:
  - Strict form validation behavior
  - API-client wrapper usage in feature layer
- Build/type sanity checks before completion.

## Non-goals

- Full global state manager
- Advanced table features (pagination/sort/filter server-driven)
- Full optimistic concurrency UX beyond simple conflict messaging
