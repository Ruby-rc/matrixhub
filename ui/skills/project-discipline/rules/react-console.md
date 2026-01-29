# React Console Route Checklist

This document is a **behavior checklist** for this project's routes/pages.
It intentionally avoids duplicating the stack-specific rules in `mantine.md`, `tanstack-router.md`, and `react-i18next.md`.

## What a route is (adapter only)

- A file under `src/routes` is **routing glue** (params/search/loaders/actions/layout mounting).
- It **mounts** a page from `src/features/{feature}/pages`.
- It must not own UI/business logic. It may define **route-level metadata** (e.g. page title / head meta) only.

Example:

`src/routes/(app)/_layout/about.tsx` → `src/features/about/pages/AboutPage.tsx`

## Page/feature responsibilities (what belongs where)

- **UI + feature-local helpers/hooks**: `src/features/{feature}/...`
- **Shared infra/reusable UI**: `src/shared/...`
- **Translations**: `src/locales/{lang}/{feature}.json` (one file per feature per language)

## Console UX expectations (route wiring)

- **Loading/error/empty**: always render explicit states; never leave a blank screen.
- **URL-driven state first**: prefer search params/router actions for filters, drawers, and detail flows (so refresh/back/forward works).
- **Server truth**: after mutations, ensure the visible list/detail reflects the server response (refetch/loader invalidate) instead of stale local state.

## Before submit (quick self-check)

- Route contains only router wiring and mounts a feature page.
- No literal JSX strings in UI; visible text should come from `t('{feature}.*')`.
- Mantine primitives cover layout/styling (no ad-hoc layout `<div>` when Mantine exists).
- `pnpm lint/typecheck` passes.

## Forbidden

- UI or business logic inside `src/routes`
- Cross-feature direct imports (share via `src/shared`)

