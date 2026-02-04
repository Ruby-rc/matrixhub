# Console Route Discipline

## Route adapter rules

- Files under src/routes are routing glue first.
- Mount a page from src/features/{feature}/pages by default.
- Allow route-level metadata (title/head) and trivial static UI (see tanstack-router.md).

## Feature responsibilities

- UI and feature-local hooks/components: src/features/{feature}/...
- Shared infra or reusable UI: src/shared/...
- Translations: src/locales/{lang}/{feature}.json

## Console UX expectations

- Always render loading, error, and empty states.
- Prefer URL-driven state (search params/actions) for filters, drawers, and flows.
- After mutations, refresh data from the server (invalidate loaders or refetch).

## Before submit

- Route file mounts the feature page or a trivial static page.
- No literal JSX strings; use t('{feature}.*').
- Mantine primitives for layout/styling.
- pnpm lint/typecheck passes.
