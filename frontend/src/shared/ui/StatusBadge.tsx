import { TaskStatus } from "@/entities/task/model/types";

const CONFIG: Record<TaskStatus, { bg: string; text: string; dot: string; label: string }> = {
  idle:      { bg: "bg-gray-100",   text: "text-gray-700",  dot: "bg-gray-500",   label: "待機中" },
  running:   { bg: "bg-green-600",  text: "text-white",     dot: "bg-white",      label: "実行中" },
  completed: { bg: "bg-blue-600",   text: "text-white",     dot: "bg-white",      label: "完了"   },
  error:     { bg: "bg-red-600",    text: "text-white",     dot: "bg-white",      label: "エラー" },
  stopped:   { bg: "bg-yellow-400", text: "text-gray-900",  dot: "bg-gray-800",   label: "停止"   },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const c = CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-bold ${c.bg} ${c.text}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${c.dot} ${status === "running" ? "pulse-dot" : ""}`} />
      {c.label}
    </span>
  );
}
