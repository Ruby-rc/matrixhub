# TanStack Router Discipline

Routes are adapters first. UI and business logic live in src/features, except for trivial static pages.

## Core model

- src/routes = routing glue (createFileRoute, params/loaders, layouts).
- src/features = pages and feature logic.
- Route file mounts a feature page or defines a trivial static page (see criteria).

## File conventions

- All route files live under src/routes.
- _layout.tsx defines layouts.
- index.tsx defines default pages.
- $param.tsx defines dynamic segments.
- __root.tsx is reserved for root providers/layout.
- Every route file uses createFileRoute.
- Do not default-export pages from routes.

## Hard rules

- No business logic in src/routes.
- No runtime or conditional routing.
- No cross-import between route folders.
- Share logic via src/shared.
- One feature per route entry.
- src/routeTree.gen.ts is read-only.

## Trivial page criteria (route-level UI allowed)

Route-level UI is allowed only when all of these are true:

- Single component in the route file.
- No data loading, mutations, or side effects.
- No local state or custom hooks beyond useTranslation().
- Only Mantine primitives/layout; no complex composition.
- Text uses i18n keys under a feature namespace with locale files in src/locales/{lang}/{feature}.json.

If any rule is violated or the page grows, move it to src/features/{feature}/pages.

## List / form / detail

- Keep routes thin.
- Pages live in features/{name}/pages/{Name}ListPage.tsx and related files.
- Route files mount the corresponding page (unless the page is trivial and static).

Reference: https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing
