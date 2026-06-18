export type TaskType = "spon_mix_1and2" | "cup_1";

export type TaskStatus =
  | "idle"
  | "running"
  | "completed"
  | "error"
  | "stopped";

export interface TaskState {
  status: TaskStatus;
  task_type: TaskType | null;
  pid: number | null;
  started_at: string | null;
  finished_at: string | null;
  error_message: string | null;
}
