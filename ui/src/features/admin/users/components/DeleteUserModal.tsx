import { useMutation } from '@tanstack/react-query'
import {
  Button,
  Group,
  Stack,
  Text,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { ModalWrapper } from '@/shared/components/ModalWrapper'

import { deleteUserMutationOptions } from '../users.mutation'
import { getUserDisplayName } from '../users.utils'

import type { User } from '@matrixhub/api-ts/v1alpha1/user.pb'

interface DeleteUserModalProps {
  opened: boolean
  user: User
  onClose: () => void
}

export function DeleteUserModal({
  opened,
  user,
  onClose,
}: DeleteUserModalProps) {
  const { t } = useTranslation()
  const mutation = useMutation(deleteUserMutationOptions())

  const handleDelete = async () => {
    await mutation.mutateAsync({ id: user.id })
    onClose()
  }

  return (
    <ModalWrapper
      opened={opened}
      onClose={onClose}
      type="danger"
      title={t('routes.admin.users.deleteModal.title')}
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
            {t('routes.admin.users.deleteModal.submit')}
          </Button>
        </Group>
      )}
    >
      <Stack gap="sm">
        <Text size="sm">
          {t('routes.admin.users.deleteModal.description', {
            username: getUserDisplayName(user),
          })}
        </Text>
      </Stack>
    </ModalWrapper>
  )
}
