# Inpro Project Management App MVP Design

Date: 2026-02-26
Status: Approved

## 1) Product Scope (MVP)

Build an internal project management web application for Inpro (construction domain, many Pertamina oil & gas projects), designed API-first so mobile can follow with minimal rework.

MVP priorities:
- Project tracking
- Task management + daily field reporting

Primary users (MVP):
- Internal Inpro team only

## 2) Architecture Decision

Chosen architecture:
- Frontend Web: Next.js (TypeScript)
- Backend API: NestJS (TypeScript)
- Database: PostgreSQL
- ORM: Prisma
- Pattern: Modular monolith, API-first

Why:
- Better backend structure and lower bug risk for solo development versus ad-hoc route-handler backend growth.
- Keeps domain boundaries clear while avoiding microservice overhead.

Domain modules:
- projects
- tasks
- daily_reports
- users_roles
- notifications
- documents (MVP-light)
- audit_logs

## 3) Auth & Security Model

Auth strategy: Hybrid
- Web: session/cookie-based auth
- Mobile (future React Native): JWT access + refresh

Security/RBAC:
- Role-based guards at API layer
- Roles (MVP): Admin, Project Manager, Site Engineer, Viewer
- Project-level membership checks for sensitive operations

## 4) Core MVP Functional Design

### 4.1 Project Tracking

Entities and fields:
- Project: name, client, location, start_date, end_date, status, pic
- Milestone: title, target_date, status
- Progress snapshot: computed and stored summary

Key capabilities:
- Create/manage projects and milestones
- Project-level status and progress visibility

### 4.2 Task Management

Entities and fields:
- Task: project_id, title, description, assignee, due_date, priority, status

Key capabilities:
- Create/assign/update tasks
- Track overdue and completion
- Link tasks to project progress

### 4.3 Daily Reports

Entities and fields:
- Daily report: project_id, date, author, activities, blockers, notes, attachments_refs
- Optional metadata: weather, manpower summary

Key capabilities:
- Submit and view daily field reports
- Associate reports with task/progress updates

### 4.4 Dashboard

MVP dashboard widgets:
- Active projects by status
- Progress by project
- Overdue tasks
- Recent daily reports/activity

## 5) Data Flow (Primary Journey)

1. Admin/PM creates project and milestones.
2. PM decomposes work into tasks and assigns owners.
3. Engineer submits daily reports and updates task status.
4. Service recalculates project progress summary.
5. Audit logs are written for critical changes.
6. Dashboard shows near-real-time operational snapshot.

## 6) Reliability and Bug-Minimization Strategy

Concurrency controls:
- Transactions for critical writes (progress/status/report workflows)
- Optimistic concurrency checks using updated_at/version-like strategy

API robustness:
- DTO validation everywhere
- Standardized error codes and response shape
- Idempotency key on sensitive mutation endpoints (e.g., report submit/status transitions)

Operational quality:
- Audit logging in same transaction for critical business changes
- Async queue for notifications/aggregation (not blocking API request path)
- Structured logging + request correlation id

## 7) Testing Strategy

Testing pyramid for MVP:
- Unit tests on domain services
- Integration tests for critical endpoints and DB behavior
- Concurrency-focused tests on progress/task update paths
- Contract/API tests for web/mobile compatibility
- Smoke E2E for key flow:
  create project -> create task -> submit report -> dashboard reflects changes

## 8) UI/Design System Decision

Chosen UI baseline:
- shadcn/ui with preset:
  pnpm dlx shadcn@latest create --preset "https://ui.shadcn.com/init?base=base&style=nova&baseColor=zinc&theme=green&iconLibrary=phosphor&font=geist&menuAccent=subtle&menuColor=default&radius=default&template=next&rtl=false" --template next

UI implementation policy:
- Use shadcn as primary design system
- Do NOT import every component blindly
- Start with core components only (forms, tables, dialogs, tabs, cards, alerts, toasts, badges, sheet)
- Use dashboard blocks/charts only where they provide direct business value
- Keep tokens/theme stable in phase 1 for consistency and speed

## 9) Delivery Strategy

Product strategy:
- Build web MVP first (responsive)
- Keep API-first boundaries so React Native app can be added with minimal backend redesign

Planned horizon:
- >2 months, with strong foundation quality over rushed breadth

## 10) Explicit Non-Goals (MVP)

- External client portal access (Pertamina side) in MVP
- Full enterprise document approval workflow
- Microservices split
- Over-customized UI system in phase 1

## 11) Definition of Success (MVP)

- Internal teams can manage projects, tasks, and daily reports end-to-end
- Dashboard provides clear operational visibility
- Core critical paths are covered by integration + concurrency tests
- API contracts remain stable and mobile-ready
