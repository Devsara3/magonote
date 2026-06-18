import { TaskStatus } from "@/entities/task/model/types";

const STYLE: Record<TaskStatus, string> = {
  idle: "bg-gray-100 text-gray-600",
  running: "bg-blue-100 text-blue-700 animate-pulse",
  completed: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  stopped: "bg-yellow-100 text-yellow-700",
};

const LABEL: Record<TaskStatus, string> = {
  idle: "待機中",
  running: "実行中",
  completed: "完了",
  error: "エラー",
  stopped: "停止",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${STYLE[status]}`}
    >
      {LABEL[status]}
    </span>
  );
}
