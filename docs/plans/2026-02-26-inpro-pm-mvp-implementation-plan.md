# Inpro PM MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an API-first MVP for internal Inpro project management with project tracking, task management, daily reports, and dashboard visibility.

**Architecture:** Use modular monolith boundaries in NestJS for domain logic and expose stable REST APIs consumed by a Next.js frontend. Enforce strict validation, RBAC, transactional writes, and audit logging on critical mutations. Keep mobile-readiness through API contracts and hybrid auth strategy.

**Tech Stack:** Next.js (TypeScript), NestJS (TypeScript), Prisma, PostgreSQL, shadcn/ui (Nova preset), Vitest/Jest, Playwright/Cypress (smoke E2E)

---

### Task 1: Workspace Bootstrap and Repository Layout

**Files:**
- Create: `apps/web/`
- Create: `apps/api/`
- Create: `packages/contracts/`
- Create: `packages/config/`
- Create: `pnpm-workspace.yaml`
- Create: `package.json`
- Create: `.editorconfig`
- Create: `.gitignore`

**Step 1: Write the failing test**
- Create a simple workspace health check script test that expects both apps to exist.

```ts
import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('workspace layout', () => {
  it('has api and web apps', () => {
    expect(existsSync('apps/api')).toBe(true)
    expect(existsSync('apps/web')).toBe(true)
  })
})
```

**Step 2: Run test to verify it fails**
- Run: `pnpm vitest run tests/workspace-layout.test.ts`
- Expected: FAIL because folders are missing.

**Step 3: Write minimal implementation**
- Create monorepo folders and base workspace config.

**Step 4: Run test to verify it passes**
- Run: `pnpm vitest run tests/workspace-layout.test.ts`
- Expected: PASS.

**Step 5: Commit**
```bash
git add .
git commit -m "chore: bootstrap monorepo layout for web and api"
```

### Task 2: API Scaffold with NestJS Modules

**Files:**
- Create: `apps/api/src/modules/projects/`
- Create: `apps/api/src/modules/tasks/`
- Create: `apps/api/src/modules/daily-reports/`
- Create: `apps/api/src/modules/users-roles/`
- Create: `apps/api/src/modules/audit-logs/`
- Modify: `apps/api/src/app.module.ts`
- Test: `apps/api/test/module-wiring.spec.ts`

**Step 1: Write the failing test**
- Add a module wiring test that expects all domain modules to load in app module.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter api test module-wiring.spec.ts`
- Expected: FAIL because modules are not registered.

**Step 3: Write minimal implementation**
- Register modules in `AppModule` and export providers as needed.

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter api test module-wiring.spec.ts`
- Expected: PASS.

**Step 5: Commit**
```bash
git add apps/api
git commit -m "feat(api): scaffold core domain modules"
```

### Task 3: Prisma Schema and Initial Migration

**Files:**
- Create: `apps/api/prisma/schema.prisma`
- Create: `apps/api/prisma/migrations/*`
- Test: `apps/api/test/db-schema.spec.ts`

**Step 1: Write the failing test**
- Add schema contract tests for required tables and critical columns: projects, milestones, tasks, daily_reports, users, roles, audit_logs.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter api test db-schema.spec.ts`
- Expected: FAIL because migration/schema not present.

**Step 3: Write minimal implementation**
- Define Prisma models, relations, enums, and indexes.
- Generate and apply initial migration.

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter api test db-schema.spec.ts`
- Expected: PASS.

**Step 5: Commit**
```bash
git add apps/api/prisma apps/api/test
git commit -m "feat(api): add initial prisma schema and migration"
```

### Task 4: Auth Foundation (Hybrid Ready)

**Files:**
- Create: `apps/api/src/modules/auth/`
- Modify: `apps/api/src/app.module.ts`
- Create: `apps/api/test/auth-smoke.spec.ts`
- Create: `apps/web/src/lib/auth/`

**Step 1: Write the failing test**
- API tests for login endpoint issuing session for web mode and token pair for mobile mode.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter api test auth-smoke.spec.ts`
- Expected: FAIL due to missing auth module.

**Step 3: Write minimal implementation**
- Implement auth controller/service and mode-specific response strategy.

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter api test auth-smoke.spec.ts`
- Expected: PASS.

**Step 5: Commit**
```bash
git add apps/api apps/web
git commit -m "feat(auth): implement hybrid auth foundation"
```

### Task 5: RBAC Guard and Project Membership Enforcement

**Files:**
- Create: `apps/api/src/modules/auth/guards/roles.guard.ts`
- Create: `apps/api/src/modules/auth/guards/project-membership.guard.ts`
- Create: `apps/api/test/rbac.spec.ts`

**Step 1: Write the failing test**
- Test forbidden access for non-member/non-role users on project-sensitive routes.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter api test rbac.spec.ts`
- Expected: FAIL.

**Step 3: Write minimal implementation**
- Implement guards and route decorators.

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter api test rbac.spec.ts`
- Expected: PASS.

**Step 5: Commit**
```bash
git add apps/api
git commit -m "feat(api): enforce rbac and project membership guards"
```

### Task 6: Project Tracking APIs (Projects + Milestones)

**Files:**
- Create: `apps/api/src/modules/projects/projects.controller.ts`
- Create: `apps/api/src/modules/projects/projects.service.ts`
- Create: `apps/api/src/modules/projects/dto/*.ts`
- Test: `apps/api/test/projects-api.spec.ts`

**Step 1: Write the failing test**
- Integration tests for create/list/update project and create milestone.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter api test projects-api.spec.ts`
- Expected: FAIL.

**Step 3: Write minimal implementation**
- Implement validated endpoints and service methods.

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter api test projects-api.spec.ts`
- Expected: PASS.

**Step 5: Commit**
```bash
git add apps/api
git commit -m "feat(api): add project and milestone endpoints"
```

### Task 7: Task Management APIs

**Files:**
- Create: `apps/api/src/modules/tasks/tasks.controller.ts`
- Create: `apps/api/src/modules/tasks/tasks.service.ts`
- Create: `apps/api/src/modules/tasks/dto/*.ts`
- Test: `apps/api/test/tasks-api.spec.ts`

**Step 1: Write the failing test**
- Integration tests for task create/assign/update/status transition/overdue query.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter api test tasks-api.spec.ts`
- Expected: FAIL.

**Step 3: Write minimal implementation**
- Implement task lifecycle logic and overdue filtering.

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter api test tasks-api.spec.ts`
- Expected: PASS.

**Step 5: Commit**
```bash
git add apps/api
git commit -m "feat(api): implement task management endpoints"
```

### Task 8: Daily Report APIs and Attachments Reference

**Files:**
- Create: `apps/api/src/modules/daily-reports/daily-reports.controller.ts`
- Create: `apps/api/src/modules/daily-reports/daily-reports.service.ts`
- Create: `apps/api/src/modules/daily-reports/dto/*.ts`
- Test: `apps/api/test/daily-reports-api.spec.ts`

**Step 1: Write the failing test**
- Integration tests for submit/list daily reports and validate required fields.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter api test daily-reports-api.spec.ts`
- Expected: FAIL.

**Step 3: Write minimal implementation**
- Implement report creation/list endpoints with attachment references and metadata.

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter api test daily-reports-api.spec.ts`
- Expected: PASS.

**Step 5: Commit**
```bash
git add apps/api
git commit -m "feat(api): add daily report endpoints"
```

### Task 9: Audit Logging Integration

**Files:**
- Create: `apps/api/src/modules/audit-logs/audit-logs.service.ts`
- Modify: `apps/api/src/modules/projects/projects.service.ts`
- Modify: `apps/api/src/modules/tasks/tasks.service.ts`
- Modify: `apps/api/src/modules/daily-reports/daily-reports.service.ts`
- Test: `apps/api/test/audit-logs.spec.ts`

**Step 1: Write the failing test**
- Verify critical mutations write audit entries atomically.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter api test audit-logs.spec.ts`
- Expected: FAIL.

**Step 3: Write minimal implementation**
- Inject audit service and write logs inside same transaction.

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter api test audit-logs.spec.ts`
- Expected: PASS.

**Step 5: Commit**
```bash
git add apps/api
git commit -m "feat(api): enforce transactional audit logging"
```

### Task 10: Concurrency Safety for Critical Updates

**Files:**
- Modify: `apps/api/src/modules/tasks/tasks.service.ts`
- Modify: `apps/api/src/modules/projects/projects.service.ts`
- Create: `apps/api/test/concurrency.spec.ts`

**Step 1: Write the failing test**
- Simulate concurrent updates on task/project progress and expect conflict behavior.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter api test concurrency.spec.ts`
- Expected: FAIL.

**Step 3: Write minimal implementation**
- Add version/updated_at checks and conflict responses.

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter api test concurrency.spec.ts`
- Expected: PASS.

**Step 5: Commit**
```bash
git add apps/api
git commit -m "feat(api): add optimistic concurrency controls"
```

### Task 11: Idempotency for Sensitive Endpoints

**Files:**
- Create: `apps/api/src/common/idempotency/`
- Modify: `apps/api/src/modules/daily-reports/daily-reports.controller.ts`
- Modify: `apps/api/src/modules/tasks/tasks.controller.ts`
- Test: `apps/api/test/idempotency.spec.ts`

**Step 1: Write the failing test**
- Retry same mutation with same idempotency key and assert single effect.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter api test idempotency.spec.ts`
- Expected: FAIL.

**Step 3: Write minimal implementation**
- Add idempotency middleware/interceptor and persistence strategy.

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter api test idempotency.spec.ts`
- Expected: PASS.

**Step 5: Commit**
```bash
git add apps/api
git commit -m "feat(api): add idempotency support for critical mutations"
```

### Task 12: API Contracts Package

**Files:**
- Create: `packages/contracts/src/*.ts`
- Create: `packages/contracts/package.json`
- Modify: `apps/api/src/**`
- Modify: `apps/web/src/**`
- Test: `packages/contracts/tests/contracts.spec.ts`

**Step 1: Write the failing test**
- Validate contract types compile and are consumed by web/api.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter contracts test`
- Expected: FAIL.

**Step 3: Write minimal implementation**
- Define DTO/type contracts and use in API responses and web data layer.

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter contracts test`
- Expected: PASS.

**Step 5: Commit**
```bash
git add packages/contracts apps/api apps/web
git commit -m "feat(contracts): add shared api contracts package"
```

### Task 13: Frontend Foundation with shadcn Preset

**Files:**
- Create/Modify: `apps/web/*`
- Create: `apps/web/components/ui/*`
- Create: `apps/web/components/layout/*`
- Test: `apps/web/tests/ui-foundation.spec.tsx`

**Step 1: Write the failing test**
- Basic render tests for app shell and navigation.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter web test ui-foundation.spec.tsx`
- Expected: FAIL.

**Step 3: Write minimal implementation**
- Initialize Next.js app and apply shadcn preset baseline.
- Implement app shell (sidebar/topbar/content).

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter web test ui-foundation.spec.tsx`
- Expected: PASS.

**Step 5: Commit**
```bash
git add apps/web
git commit -m "feat(web): setup shadcn-based ui foundation"
```

### Task 14: Project Pages (List + Detail + Milestones)

**Files:**
- Create: `apps/web/app/projects/page.tsx`
- Create: `apps/web/app/projects/[id]/page.tsx`
- Create: `apps/web/features/projects/*`
- Test: `apps/web/tests/projects-pages.spec.tsx`

**Step 1: Write the failing test**
- Component/page tests for rendering project list and detail sections.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter web test projects-pages.spec.tsx`
- Expected: FAIL.

**Step 3: Write minimal implementation**
- Implement project pages consuming API client.

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter web test projects-pages.spec.tsx`
- Expected: PASS.

**Step 5: Commit**
```bash
git add apps/web
git commit -m "feat(web): add project tracking pages"
```

### Task 15: Task Pages (Board/Table + Status Updates)

**Files:**
- Create: `apps/web/app/tasks/page.tsx`
- Create: `apps/web/features/tasks/*`
- Test: `apps/web/tests/tasks-pages.spec.tsx`

**Step 1: Write the failing test**
- Tests for task list, filter, and status update actions.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter web test tasks-pages.spec.tsx`
- Expected: FAIL.

**Step 3: Write minimal implementation**
- Implement table-based task management with role-aware actions.

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter web test tasks-pages.spec.tsx`
- Expected: PASS.

**Step 5: Commit**
```bash
git add apps/web
git commit -m "feat(web): implement task management pages"
```

### Task 16: Daily Report Pages and Submission Flow

**Files:**
- Create: `apps/web/app/reports/page.tsx`
- Create: `apps/web/features/reports/*`
- Test: `apps/web/tests/reports-pages.spec.tsx`

**Step 1: Write the failing test**
- Tests for report form validation and list rendering.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter web test reports-pages.spec.tsx`
- Expected: FAIL.

**Step 3: Write minimal implementation**
- Implement daily report submission/list pages.

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter web test reports-pages.spec.tsx`
- Expected: PASS.

**Step 5: Commit**
```bash
git add apps/web
git commit -m "feat(web): add daily report workflows"
```

### Task 17: Dashboard Page (KPIs + Charts + Alerts)

**Files:**
- Create: `apps/web/app/dashboard/page.tsx`
- Create: `apps/web/features/dashboard/*`
- Test: `apps/web/tests/dashboard-page.spec.tsx`

**Step 1: Write the failing test**
- Tests for KPI card rendering and overdue alerts panel.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter web test dashboard-page.spec.tsx`
- Expected: FAIL.

**Step 3: Write minimal implementation**
- Implement dashboard with shadcn cards/charts and alert blocks.

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter web test dashboard-page.spec.tsx`
- Expected: PASS.

**Step 5: Commit**
```bash
git add apps/web
git commit -m "feat(web): add operational dashboard"
```

### Task 18: Observability Baseline

**Files:**
- Create: `apps/api/src/common/logging/*`
- Modify: `apps/api/src/main.ts`
- Create: `apps/api/test/logging.spec.ts`

**Step 1: Write the failing test**
- Verify response includes request id and logs are structured.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter api test logging.spec.ts`
- Expected: FAIL.

**Step 3: Write minimal implementation**
- Add logger interceptor and request id middleware.

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter api test logging.spec.ts`
- Expected: PASS.

**Step 5: Commit**
```bash
git add apps/api
git commit -m "chore(api): add structured logging and request ids"
```

### Task 19: Smoke E2E for Critical Journey

**Files:**
- Create: `apps/web/e2e/mvp-smoke.spec.ts`
- Create: `apps/web/e2e/fixtures/*`
- Modify: `apps/web/playwright.config.ts`

**Step 1: Write the failing test**
- E2E flow: create project -> create task -> submit report -> verify dashboard update.

**Step 2: Run test to verify it fails**
- Run: `pnpm --filter web test:e2e --grep "mvp smoke"`
- Expected: FAIL before implementation completeness.

**Step 3: Write minimal implementation**
- Add stable selectors and fixture seeding needed for smoke flow.

**Step 4: Run test to verify it passes**
- Run: `pnpm --filter web test:e2e --grep "mvp smoke"`
- Expected: PASS.

**Step 5: Commit**
```bash
git add apps/web
git commit -m "test(e2e): add mvp critical path smoke test"
```

### Task 20: Final Verification and Delivery Readiness

**Files:**
- Modify: `README.md`
- Modify: `docs/adr/0001-mvp-architecture.md`
- Modify: `docs/api/openapi.yaml` (if generated, commit source spec)

**Step 1: Write the failing test**
- Add CI-like verification script that fails if required checks are missing.

**Step 2: Run test to verify it fails**
- Run: `pnpm run verify:mvp`
- Expected: FAIL before scripts/checks wired.

**Step 3: Write minimal implementation**
- Add verification script executing lint, typecheck, unit/integration, and smoke e2e gates.
- Document setup/run/deploy basics.

**Step 4: Run test to verify it passes**
- Run: `pnpm run verify:mvp`
- Expected: PASS.

**Step 5: Commit**
```bash
git add README.md docs package.json
git commit -m "chore: add mvp verification pipeline and docs"
```

## Notes for Execution

- Keep commits small and map to one task each.
- If a task reveals schema/API contract changes, update contracts and tests first.
- Do not broaden scope beyond MVP non-goals in the approved design.
- Prefer explicit status enums and finite transition logic over free-form updates.
- For every critical write path, confirm: validation + auth guard + transaction + audit.
