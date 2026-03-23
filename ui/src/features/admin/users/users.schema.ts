import { z } from 'zod'

import i18n from '@/i18n'

export const DEFAULT_USERS_PAGE = 1
export const DEFAULT_USERS_PAGE_SIZE = 10

export const usersSearchSchema = z.object({
  page: z.coerce.number().int().positive().optional().catch(DEFAULT_USERS_PAGE),
  query: z.string().trim().optional().catch(undefined),
})

export type UsersSearch = z.infer<typeof usersSearchSchema>

export function normalizeUsersSearch(search: UsersSearch) {
  return {
    page: search.page ?? DEFAULT_USERS_PAGE,
    query: search.query || undefined,
  }
}

function requiredString(messageKey: string) {
  return z
    .string()
    .trim()
    .min(1, i18n.t(messageKey))
}

export const createUserSchema = z.object({
  username: requiredString('routes.admin.users.validation.usernameRequired'),
  password: requiredString('routes.admin.users.validation.passwordRequired'),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const resetUserPasswordSchema = z.object({
  password: requiredString('routes.admin.users.validation.passwordRequired'),
})

export type ResetUserPasswordInput = z.infer<typeof resetUserPasswordSchema>
