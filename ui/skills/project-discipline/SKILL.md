---
name: project-discipline
description: Discipline bundle for the console SPA; use when applying Mantine, TanStack Router, react-console, or react-i18next conventions documented in AGENTS.md and the linked reference docs.
---

# Console Discipline Bundle

Use this skill to load consolidated guidance when you touch Mantine layout/theming, TanStack Router file routes, console-specific routing duties, or react-i18next localization in the console SPA.

## Entry points

- references/mantine.md: Mantine layout, tokens, and styling discipline.
- references/tanstack-router.md: file-based routing discipline.
- references/react-console.md: console route checklist and UX expectations.
- references/react-i18next.md: i18n discipline and locale structure.
- references/structure.md: structure mapping example for routes, features, and locales.

## Usage guidance

- Start with the relevant file under references/ for details.
- Consult this bundle before changing any file under src/routes, src/features, or src/locales.
- Keep shared infrastructure in src/shared. src/routes may contain simple UI, but complex logic belongs in src/features.
- Use t('{feature}.{path}') with feature-local locale files; avoid literal JSX strings.

## Loading the skill

Run npx skills add ./skills/project-discipline from the repo root or open the files directly; the repo copy is authoritative for this codebase.
