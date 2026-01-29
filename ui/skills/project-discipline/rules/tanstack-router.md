# TanStack Router Discipline

TanStack Router uses file-based routing.
In this project, **routes are adapters only**. Real UI and business logic live in `src/features`.

---

## Core Model

* `src/routes` = routing glue (createFileRoute, layout, params/loaders)
* `src/features` = pages + business logic
* Routes mount feature pages; routes never own UI.

Mental model:

```
route → feature page
```

---

## File Conventions

* All route files live under `src/routes`
* `_layout.tsx` defines layouts
* `index.tsx` defines default pages
* `$param.tsx` defines dynamic segments
* `__root.tsx` is reserved for root providers/layout

Every route file MUST use `createFileRoute`.

Example:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { LabelPage } from '@/features/label/pages/LabelPage'

export const Route = createFileRoute('/(app)/_layout/label')({
  component: () => <LabelPage />,
})
```

Rules:

* Do NOT export default pages from routes
* Routes only mount feature pages

---

## Hard Rules

* Routes are registered only by files under `src/routes`
* No runtime or conditional routing
* No UI or business logic in `src/routes`
* No cross-import between route folders
* Share logic via `src/shared`
* One feature per route entry

---

## List / Form / Detail

When a feature has multiple views:

* Keep routes thin
* Pages live in:

```
features/{name}/pages/
  {Name}ListPage.tsx
  {Name}FormPage.tsx
  {Name}DetailPage.tsx
```

Routes simply mount the corresponding page.

Do NOT merge list/form/detail into a single route module.

---

## Generated Artifacts

* `src/routeTree.gen.ts` is read-only and generator-owned

---

## References

Official docs:

* [https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing)

Optional skill bundle (use when you want extra best-practices prompts/rules installed into your local agent environment):

* [https://github.com/DeckardGer/tanstack-agent-skills/tree/main/skills/tanstack-router](https://github.com/DeckardGer/tanstack-agent-skills/tree/main/skills/tanstack-router)

Example install:

```sh
npx skills add https://github.com/deckardger/tanstack-agent-skills --skill tanstack-router-best-practices
```

---

## Forbidden

* UI or domain logic in `src/routes`
* Runtime route registration
* Conditional routing trees
* Default-exported pages in routes

---

**Summary**

```
routes = adapters
features = pages
router tree = static
```
