import {
  Button,
  Group,
  Stack,
  Text,
} from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { ModalWrapper } from '@/shared/components/ModalWrapper'

import { batchDeleteUsersMutationOptions } from '../users.mutation'
import { getUserDisplayName } from '../users.utils'

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
            loading={mutation.isPending}
            onClick={handleDelete}
          >
            {t('common.confirm')}
          </Button>
        </Group>
      )}
    >
      <Stack gap="md">
        <Text size="sm">
          {t('routes.admin.users.batchDeleteModal.description', {
            usernames: previewUsers.map(getUserDisplayName).join(', '),
            count: users.length,
          })}
        </Text>
      </Stack>
    </ModalWrapper>
  )
}
