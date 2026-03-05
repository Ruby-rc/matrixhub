/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as MatrixhubV1alpha1Registry from "./registry.pb"
import * as MatrixhubV1alpha1Utils from "./utils.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum ReplicationPolicyType {
  REPLICATION_POLICY_TYPE_UNSPECIFIED = "REPLICATION_POLICY_TYPE_UNSPECIFIED",
  REPLICATION_POLICY_TYPE_PULL_BASE = "REPLICATION_POLICY_TYPE_PULL_BASE",
  REPLICATION_POLICY_TYPE_PUSH_BASE = "REPLICATION_POLICY_TYPE_PUSH_BASE",
}

export enum ResourceType {
  RESOURCE_TYPE_UNSPECIFIED = "RESOURCE_TYPE_UNSPECIFIED",
  RESOURCE_TYPE_MODEL = "RESOURCE_TYPE_MODEL",
  RESOURCE_TYPE_DATASET = "RESOURCE_TYPE_DATASET",
  RESOURCE_TYPE_ALL = "RESOURCE_TYPE_ALL",
}

export enum triggerType {
  TRIGGER_TYPE_UNSPECIFIED = "TRIGGER_TYPE_UNSPECIFIED",
  TRIGGER_TYPE_MANUAL = "TRIGGER_TYPE_MANUAL",
  TRIGGER_TYPE_SCHEDULED = "TRIGGER_TYPE_SCHEDULED",
}

export enum ReplicationExecutionStatus {
  REPLICATION_EXECUTION_STATUS_UNSPECIFIED = "REPLICATION_EXECUTION_STATUS_UNSPECIFIED",
  REPLICATION_EXECUTION_STATUS_RUNNING = "REPLICATION_EXECUTION_STATUS_RUNNING",
  REPLICATION_EXECUTION_STATUS_SUCCEEDED = "REPLICATION_EXECUTION_STATUS_SUCCEEDED",
  REPLICATION_EXECUTION_STATUS_FAILED = "REPLICATION_EXECUTION_STATUS_FAILED",
  REPLICATION_EXECUTION_STATUS_STOPPED = "REPLICATION_EXECUTION_STATUS_STOPPED",
}

export type PullBasePolicy = {
  sourceRegistryId?: number
  resourceName?: string
  resourceType?: ResourceType
  targetResourceName?: string
  sourceRegistry?: MatrixhubV1alpha1Registry.Registry
}

export type PushBasePolicy = {
  resourceName?: string
  resourceType?: ResourceType
  targetRegistryId?: number
  targetResourceName?: string
  targetRegistry?: MatrixhubV1alpha1Registry.Registry
}


type BaseReplicationItem = {
  id?: number
  name?: string
  description?: string
  policyType?: ReplicationPolicyType
  triggerType?: triggerType
  bandwidth?: string
  isOverwrite?: boolean
  isDisabled?: boolean
}

export type ReplicationItem = BaseReplicationItem
  & OneOf<{ pullBasePolicy: PullBasePolicy; pushBasePolicy: PushBasePolicy }>


type BaseCreateReplicationRequest = {
  name?: string
  description?: string
  policyType?: ReplicationPolicyType
  triggerType?: triggerType
  bandwidth?: string
  isOverwrite?: boolean
}

export type CreateReplicationRequest = BaseCreateReplicationRequest
  & OneOf<{ pullBasePolicy: PullBasePolicy; pushBasePolicy: PushBasePolicy }>

export type CreateReplicationResponse = {
  replication?: ReplicationItem
}


type BaseUpdateReplicationRequest = {
  replicationId?: number
  name?: string
  description?: string
  triggerType?: triggerType
  bandwidth?: string
  isOverwrite?: boolean
  isDisabled?: boolean
}

export type UpdateReplicationRequest = BaseUpdateReplicationRequest
  & OneOf<{ pullBasePolicy: PullBasePolicy; pushBasePolicy: PushBasePolicy }>

export type UpdateReplicationResponse = {
  replication?: ReplicationItem
}

export type DeleteReplicationRequest = {
  replicationId?: number
}

export type DeleteReplicationResponse = {
  replication?: ReplicationItem
}

export type ListReplicationsRequest = {
  page?: number
  pageSize?: number
  search?: string
}

export type ListReplicationsResponse = {
  replications?: ReplicationItem[]
  pagination?: MatrixhubV1alpha1Utils.Pagination
}

export type CreateReplicationExecutionRequest = {
  replicationId?: number
}

export type CreateReplicationExecutionResponse = {
  id?: number
}

export type ReplicationExecution = {
  id?: number
  replicationId?: number
  triggerType?: triggerType
  status?: ReplicationExecutionStatus
  startedTimestamp?: string
  completedTimestamp?: string
  totalItems?: string
  successfulItems?: string
}

export type ListReplicationExecutionsRequest = {
  replicationId?: number
  page?: number
  pageSize?: number
  search?: string
}

export type ListReplicationExecutionsResponse = {
  executions?: ReplicationExecution[]
  pagination?: MatrixhubV1alpha1Utils.Pagination
}

export type StopReplicationExecutionRequest = {
  replicationId?: number
  executionId?: number
}

export type StopReplicationExecutionResponse = {
  execution?: ReplicationExecution
}

export class Replication {
  static ListReplications(req: ListReplicationsRequest, initReq?: fm.InitReq): Promise<ListReplicationsResponse> {
    return fm.fetchReq<ListReplicationsRequest, ListReplicationsResponse>(`/api/v1alpha1/replications?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static CreateReplication(req: CreateReplicationRequest, initReq?: fm.InitReq): Promise<CreateReplicationResponse> {
    return fm.fetchReq<CreateReplicationRequest, CreateReplicationResponse>(`/api/v1alpha1/replications`, {...initReq, method: "POST", body: JSON.stringify(req, fm.replacer)})
  }
  static UpdateReplication(req: UpdateReplicationRequest, initReq?: fm.InitReq): Promise<UpdateReplicationResponse> {
    return fm.fetchReq<UpdateReplicationRequest, UpdateReplicationResponse>(`/api/v1alpha1/replications/${req["replicationId"]}`, {...initReq, method: "PUT", body: JSON.stringify(req, fm.replacer)})
  }
  static DeleteReplication(req: DeleteReplicationRequest, initReq?: fm.InitReq): Promise<DeleteReplicationResponse> {
    return fm.fetchReq<DeleteReplicationRequest, DeleteReplicationResponse>(`/api/v1alpha1/replications/${req["replicationId"]}`, {...initReq, method: "DELETE"})
  }
  static CreateReplicationExecution(req: CreateReplicationExecutionRequest, initReq?: fm.InitReq): Promise<CreateReplicationExecutionResponse> {
    return fm.fetchReq<CreateReplicationExecutionRequest, CreateReplicationExecutionResponse>(`/api/v1alpha1/replications/${req["replicationId"]}/executions`, {...initReq, method: "POST"})
  }
  static ListReplicationExecutions(req: ListReplicationExecutionsRequest, initReq?: fm.InitReq): Promise<ListReplicationExecutionsResponse> {
    return fm.fetchReq<ListReplicationExecutionsRequest, ListReplicationExecutionsResponse>(`/api/v1alpha1/replications/${req["replicationId"]}/executions?${fm.renderURLSearchParams(req, ["replicationId"])}`, {...initReq, method: "GET"})
  }
  static StopReplicationExecution(req: StopReplicationExecutionRequest, initReq?: fm.InitReq): Promise<StopReplicationExecutionResponse> {
    return fm.fetchReq<StopReplicationExecutionRequest, StopReplicationExecutionResponse>(`/api/v1alpha1/replications/${req["replicationId"]}/executions/${req["executionId"]}/stop`, {...initReq, method: "POST"})
  }
}