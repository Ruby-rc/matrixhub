import { Button } from '@mantine/core'
import { IconUserPlus } from '@tabler/icons-react'
import {
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import {
  getRouteApi,
  useRouterState,
} from '@tanstack/react-router'
import {
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import { useRouteListState } from '@/shared/hooks/useRouteListState'

import { BatchDeleteUsersModal } from '../components/BatchDeleteUsersModal'
import { CreateUserModal } from '../components/CreateUserModal'
import { DeleteUserModal } from '../components/DeleteUserModal'
import { ResetUserPasswordModal } from '../components/ResetUserPasswordModal'
import { UsersTable } from '../components/UsersTable'
import {
  adminUserKeys,
  usersQueryOptions,
} from '../users.query'
import { DEFAULT_USERS_PAGE } from '../users.schema'
import { getUserRowId } from '../users.utils'

import type { User } from '@matrixhub/api-ts/v1alpha1/user.pb'

const usersRouteApi = getRouteApi('/(auth)/admin/users')

export function UsersPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const navigate = usersRouteApi.useNavigate()
  const search = usersRouteApi.useSearch()
  const [createModalOpened, setCreateModalOpened] = useState(false)
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [batchDeleteUsers, setBatchDeleteUsers] = useState<User[] | null>(null)
  const {
    data,
    isFetching,
  } = useSuspenseQuery(usersQueryOptions(search))
  const {
    users,
    pagination,
  } = data
  const routeLoading = useRouterState({
    select: state => state.isLoading,
  })
  const loading = routeLoading || isFetching

  const refreshUsers = () => queryClient.invalidateQueries({
    queryKey: adminUserKeys.lists(),
  })

  const {
    rowSelection,
    setRowSelection,
    clearRowSelection,
    selectedCount,
    selectedRowIds,
    handleSearchChange,
    handleRefresh,
    handlePageChange,
  } = useRouteListState({
    search,
    navigate,
    records: users,
    getRecordId: getUserRowId,
    refresh: refreshUsers,
  })

  const selectedUsers = useMemo(() => {
    const selectedIds = new Set(selectedRowIds)

    return users.filter(user => selectedIds.has(getUserRowId(user)))
  }, [selectedRowIds, users])

  const handleCreate = () => {
    setCreateModalOpened(true)
  }

  const handleResetPassword = (user: User) => {
    setResetPasswordUser(user)
  }

  const handleDelete = (user: User) => {
    setDeleteUser(user)
  }

  const handleBatchDelete = () => {
    if (selectedUsers.length === 0) {
      return
    }

    setBatchDeleteUsers(selectedUsers)
  }

  return (
    <>
      <UsersTable
        records={users}
        pagination={pagination}
        loading={loading}
        page={search.page ?? DEFAULT_USERS_PAGE}
        searchValue={search.query ?? ''}
        onSearchChange={handleSearchChange}
        onRefresh={handleRefresh}
        onDelete={handleDelete}
        onResetPassword={handleResetPassword}
        onBatchDelete={handleBatchDelete}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onPageChange={handlePageChange}
        selectedCount={selectedCount}
        toolbarExtra={(
          <Button
            onClick={handleCreate}
            leftSection={<IconUserPlus size={16} />}
          >
            {t('routes.admin.users.toolbar.create')}
          </Button>
        )}
      />

      {createModalOpened && (
        <CreateUserModal
          opened={createModalOpened}
          onClose={() => {
            setCreateModalOpened(false)
          }}
        />
      )}

      {resetPasswordUser && (
        <ResetUserPasswordModal
          opened
          user={resetPasswordUser}
          onClose={() => {
            setResetPasswordUser(null)
          }}
        />
      )}

      {deleteUser && (
        <DeleteUserModal
          opened
          user={deleteUser}
          onClose={() => {
            setDeleteUser(null)
          }}
        />
      )}

      {batchDeleteUsers && batchDeleteUsers.length > 0 && (
        <BatchDeleteUsersModal
          opened
          users={batchDeleteUsers}
          onClose={() => {
            setBatchDeleteUsers(null)
          }}
          onSuccess={() => {
            clearRowSelection()
          }}
        />
      )}
    </>
  )
}
