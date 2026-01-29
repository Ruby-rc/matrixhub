# Project Discipline Rules Index

This folder is the detailed, **topic-oriented** reference for the discipline bundle of this project.

### Mental model: `/projects/$id/repositories`

```
ui/src/
├── routes/
│   └── (app)/
│       └── _layout/
│           └── projects/
│               └── $id/
│                   └── repositories.tsx
├── features/
│   └── projects/
│       ├── pages/
│       │   └── ProjectPage.tsx
│       ├── repositories/
│       │   ├── pages/
│       │   │   └── ProjectRepositoriesPage.tsx
│       │   ├── components/  # optional
│       │   ├── hooks/       # optional
│       │   └── api/         # optional
│       ├── components/  # optional
│       ├── hooks/       # optional
│       └── api/         # optional
├── locales/
│   ├── en/
│   │   ├── projects.json
│   │   └── projects.repositories.json
│   └── zh/
│       ├── projects.json
│       └── projects.repositories.json
└── shared/
    ├── ui/   # optional
    └── api/  # optional
```

## Precedence (when rules conflict)

1. `ui/AGENTS.md` (immutable stack + folder boundaries + forbidden items)
2. `ui/skills/project-discipline/SKILL.md` (entry point + rule map)
3. Individual rule documents in this folder

If you find a conflict, update the rule documents to match `AGENTS.md`.

## Topics

- **UI / Mantine**
  - `mantine.md` — Mantine v8 layout/theming/styling discipline

- **Routing / TanStack Router**
  - `tanstack-router.md` — file-based routing conventions; routes are adapters only

- **I18n / react-i18next**
  - `react-i18next.md` — one locale file per feature per language; feature-prefixed keys

- **Console route checklist**
  - `react-console.md` — behavior checklist for route wiring + console UX expectations
