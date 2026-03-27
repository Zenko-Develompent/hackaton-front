// entities/task/api/task.api.ts
import { api } from "@/shared/api/client";
import type {
  TaskStartResponse,
  TaskCompleteResponse,
  TaskRunnerConfig,
  TaskRunnerConfigResponse,
  TaskRunRequest,
  TaskRunResponse,
  TaskRewardsRequest,
  TaskRewardsResponse,
} from "../model/types";

export const taskApi = {
  start: (taskId: string) =>
    api().post<TaskStartResponse>(`/tasks/${taskId}/start`, undefined, {
      auth: true,
    }),

  complete: (taskId: string) =>
    api().post<TaskCompleteResponse>(`/tasks/${taskId}/complete`, undefined, {
      auth: true,
    }),

  updateRunner: (taskId: string, data: TaskRunnerConfig) =>
    api().put<TaskRunnerConfigResponse>(`/tasks/${taskId}/runner`, data, {
      auth: true,
    }),

  run: (taskId: string, data: TaskRunRequest) =>
    api().post<TaskRunResponse>(`/tasks/${taskId}/run`, data, {
      auth: true,
    }),

  updateRewards: (taskId: string, data: TaskRewardsRequest) =>
    api().put<TaskRewardsResponse>(`/tasks/${taskId}/rewards`, data, {
      auth: true,
    }),
};
