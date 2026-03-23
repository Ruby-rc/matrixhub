import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import {
  Button,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { ModalWrapper } from '@/shared/components/ModalWrapper'

import { createUserMutationOptions } from '../users.mutation'
import { createUserSchema } from '../users.schema'

interface CreateUserModalProps {
  opened: boolean
  onClose: () => void
}

export function CreateUserModal({
  opened,
  onClose,
}: CreateUserModalProps) {
  const { t } = useTranslation()
  const mutation = useMutation(createUserMutationOptions())
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    validators: {
      onChange: createUserSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value)
      onClose()
    },
  })

  return (
    <ModalWrapper
      opened={opened}
      onClose={onClose}
      type="info"
      title={t('routes.admin.users.createModal.title')}
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
            {t('routes.admin.users.createModal.description')}
          </Text>

          <form.Field name="username">
            {field => (
              <TextInput
                required
                autoFocus
                autoComplete="username"
                label={t('routes.admin.users.form.username')}
                value={field.state.value}
                onChange={event => field.handleChange(event.currentTarget.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.errors?.[0]?.toString()}
              />
            )}
          </form.Field>

          <form.Field name="password">
            {field => (
              <PasswordInput
                required
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
                  {t('routes.admin.users.createModal.submit')}
                </Button>
              )}
            </form.Subscribe>
          </Group>
        </Stack>
      </form>
    </ModalWrapper>
  )
}
