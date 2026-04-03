type LocaleResource = Record<string, unknown>

const modules = import.meta.glob<Record<string, LocaleResource>>(
  '../locales/**/*.json',
  {
    eager: true,
  },
)

/**
 * Sets a value at a specific deep path within a target object.
 * Creates nested objects as needed and merges values if an object already exists at the path.
 */
function setDeep(obj: LocaleResource, path: string[], value: LocaleResource) {
  let current = obj as Record<string, unknown>

  for (let i = 0; i < path.length - 1; i++) {
    const segment = path[i]

    if (!current[segment] || typeof current[segment] !== 'object') {
      current[segment] = {}
    }
    current = current[segment] as Record<string, unknown>
  }

  const lastSegment = path[path.length - 1]
  const existingValue = current[lastSegment]

  if (
    existingValue
    && typeof existingValue === 'object'
    && !Array.isArray(existingValue)
  ) {
    current[lastSegment] = {
      ...existingValue,
      ...value,
    }
  } else {
    current[lastSegment] = value
  }
}

/**
 * Dynamically loads and structures locale files based on directory hierarchy.
 * Converts path-based structures (e.g., shared/components/A.json) into nested objects.
 */
export function loadLocale(lang: string) {
  const result: LocaleResource = {}

  for (const path in modules) {
    if (!path.includes(`/${lang}/`)) {
      continue
    }

    // Extract relative path from language directory, e.g., "shared/components/RouterErrorComponent"
    const pathSegments = path
      .split(`/${lang}/`)[1]
      .replace(/\.json$/, '')
      .split('/')

    const moduleContent = modules[path].default

    if (moduleContent) {
      setDeep(result, pathSegments, moduleContent)
    }
  }

  if (!Object.keys(result).length) {
    throw new Error(`Missing locale: ${lang}`)
  }

  return result
}
