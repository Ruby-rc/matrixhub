# AGENTS.md

Project is a console-focused SPA in this repo. It relies on Mantine v8, TanStack Router, and react-i18next.

---

## Stack (immutable)

* pnpm
* Vite + React Compiler
* TypeScript
* Mantine v8
* TanStack Router (file-based)
* react-i18next (mandatory)
* ESLint v9 (flat config)

Rolldown is disabled because Mantine and Rolldown conflict (mantine/issues/8448). Do not re-enable it.

---

## Commands

```
pnpm install
pnpm dev
pnpm build
pnpm lint/typecheck
```

Fix any lint/typecheck failures before committing.

---

## Structure & Constraints

Allowed top-level folders under `src`:

* `src/routes`   — routing adapters (may include trivial static UI)
* `src/features` — domain features (pages + business)
* `src/shared`   — cross-feature infrastructure
* `src/locales`  — per-feature localization files

Do not introduce additional architectural layers beyond these.

### Responsibilities

* `src/routes`

  * Routing DSL (createFileRoute, layout, params/loaders)
  * Trivial static UI only (see project-discipline references for criteria)
  * Mount feature pages for non-trivial pages

* `src/features`

  * Real feature implementation
  * pages / components / hooks / utils / api
  * Most static page routes map to exactly one feature

* `src/shared`

  * Infrastructure only (UI shell, generic hooks, i18n helpers)
  * MUST NOT contain domain logic

* `src/locales`

  * One file per feature, per language
  * Locale filename MUST equal feature name
  * Keys are accessed with a feature prefix: `t('{feature}.{path}')`
  * JSON files contain feature keys without an extra `{feature}` wrapper

Routing is static; generated files drive the router.

---

## Generated Artifacts

* `src/routeTree.gen.ts` (read-only, generator-owned)

---

## Ownership Summary

* `src/features`: feature owners
* `src/routes`: routing adapters (conventions governed by core team)
* `src/shared`: design system / infra maintainers
* Mantine theming: design system owners

---

## Skills & Coding Patterns

Guidance lives in `skills/`.

The enabled discipline bundle is:

* `skills/project-discipline/`

See `SKILL.md` and `references/*.md` for Mantine, TanStack Router, react-console, and react-i18next guidance.

`skills/` in this repository is the source of truth; `npx skills add ./skills/...` is only for installing this guidance into a local agent environment (e.g. under `.codex/` / `.cursor/`) to make it easier to load.

When working on feature updates (routes, layouts, components, navigation, or translations), always read:

* `skills/project-discipline/SKILL.md`
* referenced docs inside that bundle

Keep `AGENTS.md` high-level (stack / structure / forbidden items).
Treat the project-discipline skill as the living reference for coding patterns.

Update SKILL / reference files instead of duplicating content here.

---

## Forbidden

* Domain logic inside `src/shared`
* Hooks directory containing non-hook functions
* Utils using `use*` naming
* i18n keys without page/feature prefix
* New architectural layers beyond routes/features/shared/locales
* Edits to generated files
