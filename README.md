# Inpro PM Monorepo

API-first monorepo for Inpro project management MVP.

## Apps

- `apps/api`: NestJS API backend.
- `apps/web`: Next.js web frontend skeleton.

## Packages

- `packages/contracts`: shared TypeScript contracts.

## Verification

Run all project checks and API build:

```bash
npm.cmd run verify:mvp
```

## Real Integration Tests (API)

Run Jest + Supertest integration tests:

```bash
pnpm.cmd --filter @inpro/api run test:integration
```
