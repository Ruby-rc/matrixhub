# Mantine Components Discipline (V1)

Mantine v8 is the only component library in this project.

All layout, spacing, and styling MUST be expressed through Mantine components and theme tokens.
Do not invent props or approximate APIs by memory.

---

## Core Usage

### Layout

Use Mantine primitives instead of raw `<div>`:

* `Stack`, `Group`, `Flex`, `Box`, `Container`

Example:

```tsx
import { Stack, Group, Title, Button } from '@mantine/core'

export function LabelPage() {
  return (
    <Stack gap="md" mx="sm">
      <Group gap="sm">
        <Title order={3}>Labels</Title>
        <Button>Create</Button>
      </Group>
    </Stack>
  )
}
```

Rules:

* Use Mantine spacing props (`gap`, `p`, `m`, `pt`, `pb`)
* Prefer Mantine layout primitives over `<div>`
* Avoid inline styles when Mantine provides an equivalent

---

### Styling & Theme

Use Mantine props and theme tokens:

```tsx
<Button variant="light" c="blue">Save</Button>
```

Not:

```tsx
<Button style={{ background: '#1677ff' }}>
```

Rules:

* No hardcoded colors, radius, or font sizes
* No Tailwind or parallel utility systems
* Styling must go through Mantine variants / props / theme

---

## Reuse

Shared UI primitives live in `src/shared/ui`.

Rules:

* Repeated layout or shell patterns must be extracted
* Do not duplicate spacing/layout logic across features

---

## When You MUST Check Mantine Docs

Never guess Mantine APIs.

Consult Mantine docs / llms files when:

* Using a component for the first time
* Unsure about available props (e.g. `Group`, `Stack`, `NavLink`, `Drawer`)
* Working with Table / Form / Modal / Overlay
* Choosing variants, sizes, or colors(c)
* About to invent a prop name

LLM / AI usage

* Full LLM index (for agent consumption): [https://mantine.dev/llms.txt](https://mantine.dev/llms.txt)
* Use the full index when an AI agent must generate or validate API-level usage across many components. Use the curated "Recommended docs" links for human-reviewable implementation guidance.

---

## Forbidden

* Raw layout with `<div>` when Mantine primitives exist
* Hardcoded spacing, colors, or typography
* Inline CSS for things Mantine already supports
* Guessing component props without checking docs/source

---

**Summary**

* Layout = Mantine primitives
* Spacing = Mantine props
* Styling = Mantine theme
* Unsure API = check docs (never guess)
