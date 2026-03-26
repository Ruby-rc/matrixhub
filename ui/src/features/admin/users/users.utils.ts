import type { User } from '@matrixhub/api-ts/v1alpha1/user.pb'

interface FormFieldIssue {
  message?: string
}

type FormFieldError = string | FormFieldIssue | readonly FormFieldIssue[] | null | undefined

export function getUserRowId(user: User) {
  return String(user.id ?? user.username ?? user.email ?? '-')
}

export function getUserDisplayName(user: User) {
  return user.username ?? user.email ?? `#${user.id ?? '-'}`
}

export function getFormFieldErrorMessage(error: FormFieldError) {
  if (typeof error === 'string') {
    return error
  }

  if (Array.isArray(error)) {
    return getFormFieldErrorMessage(error[0])
  }

  if (
    error != null
    && typeof error === 'object'
    && 'message' in error
    && typeof error.message === 'string'
  ) {
    return error.message
  }

  return undefined
}
