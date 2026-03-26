import {
  Button,
  PasswordInput,
  Stack,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { ModalWrapper } from '@/shared/components/ModalWrapper'

import { resetUserPasswordMutationOptions } from '../users.mutation'
import { resetUserPasswordFormSchema } from '../users.schema'
import { getFormFieldErrorMessage } from '../users.utils'

import type { User } from '@matrixhub/api-ts/v1alpha1/user.pb'

interface ResetUserPasswordActionProps {
  user: User
  disabled?: boolean
}

interface ResetUserPasswordModalProps {
  opened: boolean
  user: User
  onClose: () => void
}

function ResetUserPasswordModal({
  opened,
  user,
  onClose,
}: ResetUserPasswordModalProps) {
  const { t } = useTranslation()
  const mutation = useMutation(resetUserPasswordMutationOptions())
  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: resetUserPasswordFormSchema(),
    },
    onSubmit: async ({ value }) => {
      if (user.id == null) {
        throw new Error(t('routes.admin.users.errors.missingUserId'))
      }

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
      title={t('routes.admin.users.resetPasswordModal.title')}
      confirmLoading={form.state.isSubmitting}
      onConfirm={form.handleSubmit}
    >

      <Stack gap="lg">
        <form.Field name="password">
          {field => (
            <PasswordInput
              required
              autoComplete="new-password"
              label={t('routes.admin.users.form.password')}
              value={field.state.value}
              onChange={event => field.handleChange(event.currentTarget.value)}
              onBlur={field.handleBlur}
              error={getFormFieldErrorMessage(field.state.meta.errors?.[0])}
            />
          )}
        </form.Field>

        <form.Field name="confirmPassword">
          {field => (
            <PasswordInput
              required
              autoComplete="new-password"
              label={t('routes.admin.users.form.confirmPassword')}
              value={field.state.value}
              onChange={event => field.handleChange(event.currentTarget.value)}
              onBlur={field.handleBlur}
              error={getFormFieldErrorMessage(field.state.meta.errors?.[0])}
            />
          )}
        </form.Field>

      </Stack>
    </ModalWrapper>
  )
}

export function ResetUserPasswordAction({
  user,
  disabled,
}: ResetUserPasswordActionProps) {
  const { t } = useTranslation()
  const [opened, {
    open,
    close,
  }] = useDisclosure(false)

  return (
    <>
      <Button
        variant="transparent"
        size="compact-sm"
        color="blue"
        disabled={disabled}
        onClick={open}
      >
        {t('routes.admin.users.actions.resetPassword')}
      </Button>

      {opened && (
        <ResetUserPasswordModal
          opened
          user={user}
          onClose={close}
        />
      )}
    </>
  )
}
