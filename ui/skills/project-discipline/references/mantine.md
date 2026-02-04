# Mantine v8 Discipline

Use Mantine v8 for all layout, spacing, and styling. Do not invent props; check docs when unsure.

## Layout and spacing

- Use Mantine primitives: Stack, Group, Flex, Box, Container.
- Use Mantine spacing props (gap, p, m, pt, pb, etc).
- Avoid raw divs when Mantine primitives exist.

## Styling and theme

- Use Mantine variants, colors, radius, and theme tokens.
- Do not hardcode colors, sizes, or fonts.
- Do not use other utility systems (no Tailwind).

## Reuse

- Put shared UI primitives in src/shared/ui.
- Extract repeated layout or shell patterns.

## Check docs

- First-time component usage.
- Unsure props for Group, Stack, NavLink, Drawer, Table, Form, Modal.
- About to invent a prop or style.

Docs: https://mantine.dev/llms.txt

## Forbidden

- Raw layout with div when Mantine primitives exist.
- Inline CSS for things Mantine already supports.
- Guessing component APIs.
