import {
  Anchor,
  Breadcrumbs,
  Text,
} from '@mantine/core'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { useRouteListState } from '@/shared/hooks/useRouteListState'
import { DEFAULT_PAGE } from '@/utils/constants'

import { replicationDetailQueryOptions } from '../../replications.query'
import { getReplicationDisplayName } from '../../replications.utils'
import { ReplicationExecutionsTable } from '../components/ReplicationExecutionsTable'
import {
  adminReplicationExecutionKeys,
  useReplicationExecutions,
} from '../executions.query'
import {
  matchesReplicationExecutionStatus,
  paginateReplicationExecutions,
  parseReplicationId,
} from '../executions.utils'

const replicationExecutionsRouteApi = getRouteApi('/(auth)/admin/replications_/$replicationId/executions')

export function ReplicationExecutionsPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const navigate = replicationExecutionsRouteApi.useNavigate()
  const search = replicationExecutionsRouteApi.useSearch()
  const { replicationId } = replicationExecutionsRouteApi.useParams()
  const syncPolicyId = parseReplicationId(replicationId)
  const { data: syncPolicy } = useSuspenseQuery(replicationDetailQueryOptions(syncPolicyId))
  const {
    data,
    isLoading,
    isFetching,
  } = useReplicationExecutions(syncPolicyId, search.query)

  const filteredExecutions = (data?.executions ?? []).filter(
    task => matchesReplicationExecutionStatus(task, search.status),
  )
  const {
    pageItems,
    pagination,
  } = paginateReplicationExecutions(
    filteredExecutions,
    search.page ?? DEFAULT_PAGE,
  )

  const refreshExecutions = () => queryClient.invalidateQueries({
    queryKey: adminReplicationExecutionKeys.lists(syncPolicyId),
  })

  const {
    onSearchChange,
    onRefresh,
    onPageChange,
    routeColumnFilterTableOptions,
  } = useRouteListState({
    search,
    navigate,
    records: pageItems,
    getRecordId: task => String(task.id ?? '-'),
    refresh: refreshExecutions,
    columnFilterSync: [
      {
        columnId: 'status',
        searchKey: 'status',
      },
    ],
  })

  return (
    <>
      <Breadcrumbs separator="/" separatorMargin="xs" mb="md">
        <Anchor
          underline="never"
          renderRoot={props => (
            <Link
              {...props}
              to="/admin/replications"
            />
          )}
        >
          {t('admin.replications')}
        </Anchor>
        <Text size="sm" fw={500}>
          {t('routes.admin.replications.executions.breadcrumb', {
            name: getReplicationDisplayName(syncPolicy),
          })}
        </Text>
      </Breadcrumbs>

      <ReplicationExecutionsTable
        syncPolicyId={syncPolicyId}
        data={pageItems}
        pagination={pagination}
        loading={isLoading}
        fetching={isFetching}
        page={pagination.page ?? DEFAULT_PAGE}
        searchValue={search.query ?? ''}
        onSearchChange={onSearchChange}
        onRefresh={onRefresh}
        onPageChange={onPageChange}
        tableOptions={routeColumnFilterTableOptions}
      />
    </>
  )
}
