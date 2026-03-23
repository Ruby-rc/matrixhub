import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import {
  Button,
  Group,
  PasswordInput,
  Stack,
  Text,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { ModalWrapper } from '@/shared/components/ModalWrapper'

import { resetUserPasswordMutationOptions } from '../users.mutation'
import { resetUserPasswordSchema } from '../users.schema'
import { getUserDisplayName } from '../users.utils'

import type { User } from '@matrixhub/api-ts/v1alpha1/user.pb'

interface ResetUserPasswordModalProps {
  opened: boolean
  user: User
  onClose: () => void
}

export function ResetUserPasswordModal({
  opened,
  user,
  onClose,
}: ResetUserPasswordModalProps) {
  const { t } = useTranslation()
  const mutation = useMutation(resetUserPasswordMutationOptions())
  const form = useForm({
    defaultValues: {
      password: '',
    },
    validators: {
      onChange: resetUserPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync({
        id: user.id,
        password: value.password,
      })
      onClose()
    },
  })

  return (
    <ModalWrapper
      opened={opened}
      onClose={onClose}
      type="info"
      title={t('routes.admin.users.resetPasswordModal.title')}
      footer={<></>}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <Stack gap="lg">
          <Text size="sm" c="dimmed">
            {t('routes.admin.users.resetPasswordModal.description', {
              username: getUserDisplayName(user),
            })}
          </Text>

          <form.Field name="password">
            {field => (
              <PasswordInput
                required
                autoFocus
                autoComplete="new-password"
                label={t('routes.admin.users.form.password')}
                value={field.state.value}
                onChange={event => field.handleChange(event.currentTarget.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors?.[0]?.toString()}
              />
            )}
          </form.Field>

          <Group justify="flex-end" gap="md">
            <Button
              type="button"
              color="default"
              variant="subtle"
              onClick={onClose}
            >
              {t('common.cancel')}
            </Button>

            <form.Subscribe selector={state => [
              state.canSubmit,
              state.isSubmitting,
              state.isPristine,
            ] as const}
            >
              {([canSubmit, isSubmitting, isPristine]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isPristine}
                  loading={isSubmitting}
                >
                  {t('routes.admin.users.resetPasswordModal.submit')}
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </ModalWrapper>
  )
}
