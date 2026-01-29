# react-i18next Discipline

react-i18next is mandatory. Literal JSX strings are forbidden.

This project uses:

* **One locale file per feature, per language**
* **Feature-prefixed keys** via the locale filename mount
* Direct `useTranslation()` in feature pages/components

Example keys:

```
label.pageTitle
label.list.title
label.form.submit
label.detail.title
```

---

## Locale Layout

```
src/locales/{lang}/{feature}.json
```

## Namespace (resource bundle) mapping

Locale files are loaded via a glob and mounted into the `translation` resource bundle.

The **namespace** is derived from the file path under `src/locales/{lang}/`:

- `src/locales/en/about.json` → namespace `about`
- Nested files become dot-separated namespaces:
  - `src/locales/en/repo/blob.json` → namespace `repo.blob`

This means `t()` always uses:

```
t('{namespace}.{keyPath}')
```

Example:

- `src/locales/en/about.json` exports `{ "title": "...", "tagline": "...", "body": "..." }`
- usage: `t('about.title')`, `t('about.tagline')`, `t('about.body')`

Example (`src/locales/en/about.json`):

```json
{
  "title": "About MatrixHub",
  "tagline": "Community-first storage orchestration for AI deployments."
}
```

Rules:

* Locale filename MUST equal the feature name (this becomes the **feature prefix**).
* One file per feature, per language.
* The JSON file contains the feature's keys **without** an extra top-level `{feature}` wrapper.
* No shared/global locale files.

---

## Key Rules

* All translation lookups MUST use the feature prefix: `t('{feature}.{path}')`
* `{feature}` MUST match the locale filename exactly
* No cross-feature reuse
* No `common.*` / `shared.*`

Mapping:

```
routes/.../label.tsx
→ features/label
→ locales/{lang}/label.json
→ usage keys: label.*
```

---

## Usage

```tsx
const { t } = useTranslation()
t('about.title')
```

Rules:

* Use `useTranslation()` in features only
* In `src/routes`, translation is allowed **only** for route-level metadata (e.g. title/head). Do not render UI text from routes.
* Never inline JSX strings

Concrete example:

* `src/locales/en/about.json`:

  - exports `{ title, tagline, body }`
  - is mounted under the `about` feature prefix

* `src/features/about/pages/AboutPage.tsx`:

  - calls `t('about.title')`, `t('about.tagline')`, `t('about.body')`

---

## List / Form / Detail

Keep **one locale file per feature**, group by view inside the file:

```json
{
  "list": { "title": "Labels" },
  "form": { "submit": "Save" },
  "detail": { "title": "Detail" }
}
```

Usage:

```
label.list.*
label.form.*
label.detail.*
```

Do NOT split into multiple locale files per view.

---

## Adding a New Page

1. Route glue in `src/routes`
2. Page in `features/{name}/pages`
3. Locale in `src/locales/{lang}/{name}.json`
4. Add `{name}.*` keys
5. Use `useTranslation()` + `t('{name}.*')`

---

## Forbidden

* Keys without feature prefix
* Shared/global locale files
* Translation usage in `src/routes` for UI rendering (allowed only for route-level metadata like title/head)
* Domain translations in `src/shared`
* Literal JSX strings

**Summary**

```
route → feature → locale file → feature-prefixed keys (optional list/form/detail)
```
