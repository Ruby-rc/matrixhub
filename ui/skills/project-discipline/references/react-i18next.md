# react-i18next Discipline

react-i18next is mandatory. Do not use literal JSX strings.

## Locale layout

- One locale file per feature, per language.
- Path: src/locales/{lang}/{feature}.json
- Nested files become dot namespaces, for example src/locales/en/repo/blob.json -> namespace repo.blob.

## Key rules

- Use t('{feature}.{path}') where feature matches the locale filename.
- Locale JSON contains feature keys without a top-level {feature} wrapper.
- No shared or global locale files.
- No cross-feature reuse (no common.* or shared.*).

## Usage

- Use useTranslation() in features.
- Routes may use t() for route-level metadata and for trivial static pages (see tanstack-router.md).

## List / form / detail

- Keep one locale file per feature and group keys under list/form/detail.

## Adding a new page

1. Route glue in src/routes.
2. Page in src/features/{name}/pages unless it is trivial and static.
3. Locale in src/locales/{lang}/{name}.json.
4. Use t('{name}.*') in the page (feature or route).
