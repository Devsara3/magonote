import { apiFetch } from "@/shared/api/apiClient";
import { TaskState, TaskType } from "@/entities/task/model/types";

export const runTask = (taskType: TaskType) =>
  apiFetch<TaskState>(`/api/run-task/${taskType}`, { method: "POST" });

export const stopTask = () =>
  apiFetch<TaskState>("/api/stop-task", { method: "POST" });

export const fetchTaskStatus = () =>
  apiFetch<TaskState>("/api/task-status");
