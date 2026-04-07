import { Text } from '@mantine/core'
import {
  SyncTaskStatus,
  TriggerType,
  type SyncTask,
} from '@matrixhub/api-ts/v1alpha1/sync_policy.pb'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { DataTable, type DataTableProps } from '@/shared/components/DataTable'
import { StatusIndicator } from '@/shared/components/StatusIndicator'
import { formatDateTime } from '@/shared/utils/date'

import { StopReplicationExecutionAction } from './StopReplicationExecutionAction'
import { replicationExecutionStatusFilterValues } from '../executions.schema'
import {
  formatReplicationExecutionDuration,
  formatReplicationExecutionSuccessRate,
  formatReplicationExecutionTotalItems,
  getReplicationExecutionRowId,
} from '../executions.utils'

import type { MRT_ColumnDef } from 'mantine-react-table'

type ExecutionCellProps = Parameters<NonNullable<MRT_ColumnDef<SyncTask>['Cell']>>[0]

type ReplicationExecutionsTableProps = Omit<
  DataTableProps<SyncTask>,
  'columns' | 'renderToolbar' | 'searchPlaceholder' | 'searchValue' | 'onSearchChange'
> & {
  syncPolicyId: number
  searchValue: string
  onSearchChange: (value: string) => void
}

function ExecutionTaskCell({ row }: ExecutionCellProps) {
  if (row.original.id == null) {
    return <Text fw={600}>-</Text>
  }

  return <Text fw={600}>{row.original.id}</Text>
}

function ExecutionStatusCell({ row }: ExecutionCellProps) {
  const { t } = useTranslation()
  const status = row.original.status

  if (status === SyncTaskStatus.SYNC_TASK_STATUS_RUNNING) {
    return (
      <StatusIndicator
        type="info"
        label={t('routes.admin.replications.executions.status.running')}
      />
    )
  }

  if (status === SyncTaskStatus.SYNC_TASK_STATUS_STOPPED) {
    return (
      <StatusIndicator
        type="warning"
        label={t('routes.admin.replications.executions.status.stopped')}
      />
    )
  }

  if (status === SyncTaskStatus.SYNC_TASK_STATUS_SUCCEEDED) {
    return (
      <StatusIndicator
        type="success"
        label={t('routes.admin.replications.executions.status.succeeded')}
      />
    )
  }

  if (status === SyncTaskStatus.SYNC_TASK_STATUS_FAILED) {
    return (
      <StatusIndicator
        type="danger"
        label={t('routes.admin.replications.executions.status.failed')}
      />
    )
  }

  return (
    <StatusIndicator
      label={t('routes.admin.replications.executions.status.unknown')}
    />
  )
}

function ExecutionActionsCell({
  row,
  table,
}: ExecutionCellProps) {
  const syncPolicyId = (
    table.options.meta as { syncPolicyId?: number } | undefined
  )?.syncPolicyId

  if (syncPolicyId == null) {
    return <Text size="sm">-</Text>
  }

  return (
    <StopReplicationExecutionAction
      syncPolicyId={syncPolicyId}
      task={row.original}
      disabled={row.original.id == null}
    />
  )
}

export function ReplicationExecutionsTable({
  syncPolicyId,
  searchValue,
  onSearchChange,
  onRefresh,
  fetching = false,
  tableOptions,
  ...props
}: ReplicationExecutionsTableProps) {
  const { t } = useTranslation()
  const columns = useMemo<MRT_ColumnDef<SyncTask>[]>(() => [
    {
      id: 'taskId',
      header: t('routes.admin.replications.executions.table.taskId'),
      Cell: ExecutionTaskCell,
      size: 130,
    },
    {
      accessorKey: 'status',
      header: t('routes.admin.replications.executions.table.status'),
      Cell: ExecutionStatusCell,
      enableColumnFilter: true,
      filterFn: 'equals',
      filterVariant: 'select',
      mantineFilterSelectProps: {
        data: replicationExecutionStatusFilterValues.map(value => ({
          value,
          label: t(`routes.admin.replications.executions.status.${value.replace('SYNC_TASK_STATUS_', '').toLowerCase()}`),
        })),
        placeholder: t('routes.admin.replications.executions.filters.status'),
      },
      size: 110,
    },
    {
      id: 'triggerType',
      header: t('routes.admin.replications.executions.table.triggerType'),
      accessorFn: row => (
        row.triggerType === TriggerType.TRIGGER_TYPE_SCHEDULED
          ? t('routes.admin.replications.trigger.scheduled')
          : t('routes.admin.replications.trigger.manual')
      ),
      size: 110,
    },
    {
      id: 'startedTimestamp',
      header: t('routes.admin.replications.executions.table.startedAt'),
      accessorFn: row => formatDateTime(row.startedTimestamp, 'YYYY/M/D HH:mm'),
      size: 150,
    },
    {
      id: 'duration',
      header: t('routes.admin.replications.executions.table.duration'),
      accessorFn: row => formatReplicationExecutionDuration(row),
      size: 150,
    },
    {
      id: 'successRate',
      header: t('routes.admin.replications.executions.table.successRate'),
      accessorFn: row => formatReplicationExecutionSuccessRate(row),
      size: 120,
    },
    {
      id: 'totalItems',
      header: t('routes.admin.replications.executions.table.totalItems'),
      accessorFn: row => formatReplicationExecutionTotalItems(row),
      size: 100,
    },
    {
      id: 'actions',
      header: t('routes.admin.replications.executions.table.actions'),
      Cell: ExecutionActionsCell,
      size: 126,
    },
  ], [t])

  return (
    <DataTable
      {...props}
      columns={columns}
      emptyTitle={t('routes.admin.replications.executions.table.empty')}
      fetching={fetching}
      getRowId={getReplicationExecutionRowId}
      onRefresh={onRefresh}
      searchPlaceholder={t('routes.admin.replications.executions.searchPlaceholder')}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      tableOptions={{
        ...tableOptions,
        meta: {
          ...(tableOptions?.meta as object | undefined),
          syncPolicyId,
        },
      }}
    />
  )
}
