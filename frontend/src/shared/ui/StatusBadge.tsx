import { TaskStatus } from "@/entities/task/model/types";

const CONFIG: Record<
  TaskStatus,
  { bg: string; text: string; dot: string; dotAnim: string; label: string }
> = {
  idle: {
    bg: "bg-slate-700/60",
    text: "text-slate-300",
    dot: "bg-slate-400",
    dotAnim: "",
    label: "待機中",
  },
  running: {
    bg: "bg-emerald-900/50",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    dotAnim: "dot-blink glow-green",
    label: "実行中",
  },
  completed: {
    bg: "bg-blue-900/50",
    text: "text-blue-300",
    dot: "bg-blue-400",
    dotAnim: "",
    label: "完了",
  },
  error: {
    bg: "bg-red-900/50",
    text: "text-red-300",
    dot: "bg-red-400",
    dotAnim: "dot-blink",
    label: "エラー",
  },
  stopped: {
    bg: "bg-yellow-900/40",
    text: "text-yellow-300",
    dot: "bg-yellow-400",
    dotAnim: "",
    label: "停止",
  },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const c = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${c.bg} ${c.text}`}
    >
      <span className={`h-2 w-2 rounded-full ${c.dot} ${c.dotAnim}`} />
      {c.label}
    </span>
  );
}
