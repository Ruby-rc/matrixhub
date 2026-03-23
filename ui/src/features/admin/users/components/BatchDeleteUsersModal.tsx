import { useMutation } from '@tanstack/react-query'
import {
  Button,
  Group,
  Stack,
  Text,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { ModalWrapper } from '@/shared/components/ModalWrapper'

import { batchDeleteUsersMutationOptions } from '../users.mutation'
import {
  getUserDisplayName,
  getUserRowId,
} from '../users.utils'

import type { User } from '@matrixhub/api-ts/v1alpha1/user.pb'

interface BatchDeleteUsersModalProps {
  opened: boolean
  users: readonly User[]
  onClose: () => void
  onSuccess: () => void
}

const PREVIEW_USER_COUNT = 5

export function BatchDeleteUsersModal({
  opened,
  users,
  onClose,
  onSuccess,
}: BatchDeleteUsersModalProps) {
  const { t } = useTranslation()
  const mutation = useMutation(batchDeleteUsersMutationOptions())
  const previewUsers = users.slice(0, PREVIEW_USER_COUNT)
  const remainingCount = users.length - previewUsers.length

  const handleDelete = async () => {
    await mutation.mutateAsync(users)
    onSuccess()
    onClose()
  }

  return (
    <ModalWrapper
      opened={opened}
      onClose={onClose}
      type="danger"
      title={t('routes.admin.users.batchDeleteModal.title')}
      footer={(
        <Group justify="flex-end" gap="md">
          <Button
            color="default"
            variant="subtle"
            onClick={onClose}
          >
            {t('common.cancel')}
          </Button>
          <Button
            color="red"
            loading={mutation.isPending}
            onClick={() => {
              void handleDelete()
            }}
          >
            {t('routes.admin.users.batchDeleteModal.submit', {
              count: users.length,
            })}
          </Button>
        </Group>
      )}
    >
      <Stack gap="md">
        <Text size="sm">
          {t('routes.admin.users.batchDeleteModal.description', {
            count: users.length,
          })}
        </Text>

        <Stack gap={4}>
          {previewUsers.map(user => (
            <Text
              key={getUserRowId(user)}
              size="sm"
              c="dimmed"
            >
              {getUserDisplayName(user)}
            </Text>
          ))}

          {remainingCount > 0 && (
            <Text size="sm" c="dimmed">
              {t('routes.admin.users.batchDeleteModal.more', {
                count: remainingCount,
              })}
            </Text>
          )}
        </Stack>
      </Stack>
    </ModalWrapper>
  )
}
