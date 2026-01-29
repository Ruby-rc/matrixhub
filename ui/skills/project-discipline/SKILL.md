---
name: project-discipline
description: Discipline bundle for this project, covering Mantine, TanStack Router, react-console patterns, and react-i18next conventions as defined in AGENTS.md.
metadata:
  version: "1.0.0"
  llm: true
  entry_points:
    - rules/mantine.md
    - rules/tanstack-router.md
    - rules/react-i18next.md
    - rules/react-console.md
    - rules/README.md
---


# Console Discipline Bundle

This skill encapsulates the core guidance from `AGENTS.md` so contributors can load one entry point that explains Mantine layout/theming, TanStack Router's file-based routing, console route expectations, and react-i18next localization discipline.

## LLM / Agent integration

This skill is adapted for both human and AI consumption. Each rule file follows a consistent structure:

1. Quick intent — when an agent should consult this doc
2. Human guidance — concise examples, checklist, and links
3. LLM hints — prompts, indexes, and when to use full LLMS index

Agents may `npx skills add ./skills/project-discipline` or read files in-place. The repo version is authoritative.

## How this is organized

- **Project invariants** live in `ui/AGENTS.md` (stack, folder boundaries, forbidden items).
- **This skill** is the single entry point for day-to-day coding patterns.
- **Detailed rules** are split by topic under `rules/` (see `rules/README.md`).

## When to consult

- When creating or updating a console route under `src/routes` to keep features isolated and router-driven.
- When defining layouts/spacings so Mantine primitives and theme tokens stay consistent across the console SPA.
- When implementing translations/localization to avoid literal JSX strings and keep namespaces aligned with route folders.
- When newcomers need a single reference that links to the four discipline rules inherited from the AGENTS instructions.

## Rules

- Index / precedence: `rules/README.md`
- Mantine layout & theming: `rules/mantine.md`
- Console route duties/limits: `rules/react-console.md`
- React-i18next namespace discipline: `rules/react-i18next.md`
- TanStack Router file-based routing: `rules/tanstack-router.md`
