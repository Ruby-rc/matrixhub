import {
  SyncTaskStatus,
  type SyncTask,
} from '@matrixhub/api-ts/v1alpha1/sync_policy.pb'

import i18n from '@/i18n'
import { toMilliseconds } from '@/shared/utils/date'
import { DEFAULT_PAGE_SIZE } from '@/utils/constants'

import { type ReplicationExecutionStatusFilterValue } from './executions.schema'

const SECOND_IN_MS = 1000
const MINUTE_IN_MS = 60 * SECOND_IN_MS
const HOUR_IN_MS = 60 * MINUTE_IN_MS

export function getReplicationExecutionRowId(task: SyncTask) {
  return String(task.id ?? `${task.startedTimestamp ?? '0'}-${task.status ?? 'unknown'}`)
}

export function parseReplicationId(replicationId: string) {
  const value = Number(replicationId)

  if (!Number.isInteger(value) || value < 1) {
    throw new Error(i18n.t('routes.admin.replications.executions.errors.invalidSyncPolicyId'))
  }

  return value
}

function toMs(value: string | number | undefined) {
  if (value == null) {
    return undefined
  }

  return toMilliseconds(value)
}

function parseNumericValue(value: string | number | undefined) {
  if (value == null) {
    return undefined
  }

  const numericValue = Number(value)

  return Number.isFinite(numericValue) ? numericValue : undefined
}

export function formatReplicationExecutionDuration(task: SyncTask) {
  const startedAt = toMs(task.startedTimestamp)
  const completedAt = toMs(task.completedTimestamp)
  const endedAt = completedAt ?? (
    task.status === SyncTaskStatus.SYNC_TASK_STATUS_RUNNING
      ? Date.now()
      : undefined
  )

  if (startedAt == null || endedAt == null || endedAt < startedAt) {
    return '-'
  }

  const durationMs = Math.max(0, endedAt - startedAt)

  if (durationMs < SECOND_IN_MS) {
    return `${Math.round(durationMs)} ms`
  }

  if (durationMs < MINUTE_IN_MS) {
    const seconds = durationMs / SECOND_IN_MS

    return Number.isInteger(seconds) ? `${seconds} s` : `${seconds.toFixed(1)} s`
  }

  if (durationMs < HOUR_IN_MS) {
    const minutes = Math.floor(durationMs / MINUTE_IN_MS)
    const seconds = Math.floor((durationMs % MINUTE_IN_MS) / SECOND_IN_MS)

    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`
  }

  const hours = Math.floor(durationMs / HOUR_IN_MS)
  const minutes = Math.floor((durationMs % HOUR_IN_MS) / MINUTE_IN_MS)

  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
}

export function formatReplicationExecutionSuccessRate(task: SyncTask) {
  const totalItems = parseNumericValue(task.totalItems)
  const successfulItems = parseNumericValue(task.successfulItems) ?? 0

  if (totalItems == null || totalItems <= 0) {
    return '-'
  }

  const successRate = (successfulItems / totalItems) * 100
  const roundedSuccessRate = Math.round(successRate * 10) / 10

  return `${Number.isInteger(roundedSuccessRate) ? roundedSuccessRate : roundedSuccessRate.toFixed(1)}%`
}

export function formatReplicationExecutionTotalItems(task: SyncTask) {
  const totalItems = parseNumericValue(task.totalItems)

  if (totalItems == null) {
    return '-'
  }

  return new Intl.NumberFormat().format(totalItems)
}

export function matchesReplicationExecutionStatus(
  task: SyncTask,
  status: ReplicationExecutionStatusFilterValue | undefined,
) {
  if (status == null) {
    return true
  }

  return task.status === status
}

export function paginateReplicationExecutions<T>(items: readonly T[], page: number) {
  const total = items.length
  const pages = total > 0 ? Math.ceil(total / DEFAULT_PAGE_SIZE) : 0
  const currentPage = pages > 0 ? Math.min(page, pages) : 1
  const startIndex = (currentPage - 1) * DEFAULT_PAGE_SIZE

  return {
    pageItems: items.slice(
      startIndex,
      startIndex + DEFAULT_PAGE_SIZE,
    ),
    pagination: {
      total,
      pages,
      page: currentPage,
      pageSize: DEFAULT_PAGE_SIZE,
    },
  }
}
