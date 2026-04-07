import { SyncPolicy } from '@matrixhub/api-ts/v1alpha1/sync_policy.pb'
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from '@tanstack/react-query'

import { REPLICATION_EXECUTIONS_FETCH_PAGE_SIZE } from './executions.schema'

export const adminReplicationExecutionKeys = {
  all: ['admin', 'replications', 'executions'] as const,
  lists: (syncPolicyId: number) => [...adminReplicationExecutionKeys.all, syncPolicyId, 'list'] as const,
  list: (syncPolicyId: number, query: string | undefined) =>
    [...adminReplicationExecutionKeys.lists(syncPolicyId), query ?? ''] as const,
}

async function fetchAllReplicationExecutions(
  syncPolicyId: number,
  query: string | undefined,
) {
  // Fetch every page once so the local status filter and client pagination stay
  // accurate until the backend exposes status-based filtering.
  const firstResponse = await SyncPolicy.ListSyncTasks({
    syncPolicyId,
    page: 1,
    pageSize: REPLICATION_EXECUTIONS_FETCH_PAGE_SIZE,
    search: query,
  })

  const totalPages = Math.max(firstResponse.pagination?.pages ?? 1, 1)

  if (totalPages === 1) {
    return firstResponse.syncTasks ?? []
  }

  const nextPageResponses = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) => SyncPolicy.ListSyncTasks({
      syncPolicyId,
      page: index + 2,
      pageSize: REPLICATION_EXECUTIONS_FETCH_PAGE_SIZE,
      search: query,
    })),
  )

  return [
    ...(firstResponse.syncTasks ?? []),
    ...nextPageResponses.flatMap(response => response.syncTasks ?? []),
  ]
}

export function replicationExecutionsQueryOptions(
  syncPolicyId: number,
  query: string | undefined,
) {
  return queryOptions({
    queryKey: adminReplicationExecutionKeys.list(syncPolicyId, query),
    queryFn: async () => ({
      executions: await fetchAllReplicationExecutions(syncPolicyId, query),
    }),
  })
}

export function useReplicationExecutions(
  syncPolicyId: number,
  query: string | undefined,
) {
  return useQuery({
    ...replicationExecutionsQueryOptions(syncPolicyId, query),
    placeholderData: keepPreviousData,
  })
}
