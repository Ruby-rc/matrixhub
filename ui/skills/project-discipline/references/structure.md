# Project Structure Mental Model

Use this mapping to keep routes, features, shared, and locales aligned.

## Core boundaries

- src/routes: route declarations and simple UI. Complex features should reside in src/features.
- src/features: feature implementation (heavy UI + logic).
- src/shared: cross-feature UI, hooks, and infrastructure only.
- src/locales: per-feature locale files.

## Feature layout (recommended)

- (root) or pages/: Feature entry components (mounted by src/routes).
- components/: feature-only UI pieces.
- hooks/: feature-only hooks.
- utils/: feature-only helpers (non-hook functions).
- api/: feature-only API clients.

## Example mapping

Route: /projects/$id/repositories

- Route adapter: src/routes/(app)/_layout/projects/$id/repositories.tsx
- Feature page: src/features/projects/repositories/pages/ProjectRepositoriesPage.tsx (or a single page file for the feature)
- Feature hooks/utils/api/components: src/features/projects/repositories/{hooks,utils,api,components}/...
- Shared UI/hooks/infra: src/shared/{ui,hooks,api}/...
- Locales: src/locales/en/projects/repositories.json and src/locales/zh/projects/repositories.json
- Translation usage: t('projects.repositories.*')

Route: /about (trivial static page)

- Route adapter: src/routes/(app)/_layout/about.tsx (inline page)
- Locales: src/locales/en/about.json and src/locales/zh/about.json
- Translation usage: t('about.*')
