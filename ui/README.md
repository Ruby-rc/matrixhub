# MatrixHub UI

MatrixHub UI ...

## Quick start

```
pnpm install
pnpm dev
pnpm build
pnpm lint/typecheck
```

Lint/typecheck must pass before merging.

## Key directories

- `src/routes/`: routing adapters only, one file/folder per static route.
- `src/features/`: feature implementations (pages, components, hooks, api, etc.; each static route maps to one feature).
- `src/shared/`: reusable UI primitives and helpers.
- `src/locales/`: translations keyed by language and namespace.
- `skills/`: discipline docs that every change must follow.

## Governance pointers

1. Read `AGENTS.md` for stack, constraints, ownership, and enabled skills.
2. Use the `skills/*` docs (react-console, mantine, tanstack-router, react-i18next) for formatting/routing/i18n decisions.
3. Treat `src/routeTree.gen.ts` and other generated files as read-only.
