import { mutationOptions } from '@tanstack/react-query'
import {
  Users,
  type User,
} from '@matrixhub/api-ts/v1alpha1/user.pb'

import i18n from '@/i18n'
import type { NotificationMeta } from '@/types/tanstack-query'

import { adminUserKeys } from './users.query'

import type {
  CreateUserInput,
  ResetUserPasswordInput,
} from './users.schema'

interface UserMutationTarget {
  id?: number
}

function requireUserId(id?: number) {
  if (id == null) {
    throw new Error(i18n.t('routes.admin.users.errors.missingUserId'))
  }

  return id
}

export function createUserMutationOptions() {
  return mutationOptions({
    mutationFn: (input: CreateUserInput) => Users.CreateUser(input),
    meta: {
      successMessage: i18n.t('routes.admin.users.notifications.createSuccess'),
      errorMessage: i18n.t('routes.admin.users.notifications.createError'),
      invalidates: [adminUserKeys.lists()],
    } satisfies NotificationMeta,
  })
}

export function resetUserPasswordMutationOptions() {
  return mutationOptions({
    mutationFn: ({
      id,
      password,
    }: UserMutationTarget & ResetUserPasswordInput) =>
      Users.ResetUserPassword({
        id: requireUserId(id),
        password,
      }),
    meta: {
      successMessage: i18n.t('routes.admin.users.notifications.resetPasswordSuccess'),
      errorMessage: i18n.t('routes.admin.users.notifications.resetPasswordError'),
      invalidates: [adminUserKeys.lists()],
    } satisfies NotificationMeta,
  })
}

export function deleteUserMutationOptions() {
  return mutationOptions({
    mutationFn: ({ id }: UserMutationTarget) =>
      Users.DeleteUser({
        id: requireUserId(id),
      }),
    meta: {
      successMessage: i18n.t('routes.admin.users.notifications.deleteSuccess'),
      errorMessage: i18n.t('routes.admin.users.notifications.deleteError'),
      invalidates: [adminUserKeys.lists()],
    } satisfies NotificationMeta,
  })
}

export function batchDeleteUsersMutationOptions() {
  return mutationOptions({
    mutationFn: async (users: readonly User[]) => {
      if (users.length === 0) {
        throw new Error(i18n.t('routes.admin.users.errors.noUsersSelected'))
      }

      const ids = users.map(user => requireUserId(user.id))

      await Promise.all(ids.map(id =>
        Users.DeleteUser({ id })))
    },
    meta: {
      successMessage: i18n.t('routes.admin.users.notifications.batchDeleteSuccess'),
      errorMessage: i18n.t('routes.admin.users.notifications.batchDeleteError'),
      invalidates: [adminUserKeys.lists()],
    } satisfies NotificationMeta,
  })
}
