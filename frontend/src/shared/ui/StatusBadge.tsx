import { TaskStatus } from "@/entities/task/model/types";

const CONFIG: Record<TaskStatus, { pill: string; dot: string; label: string }> = {
  idle:      { pill: "bg-slate-100 text-slate-500",           dot: "bg-slate-400",   label: "待機中" },
  running:   { pill: "bg-emerald-50 text-emerald-700",        dot: "bg-emerald-500", label: "実行中" },
  completed: { pill: "bg-blue-50 text-blue-700",              dot: "bg-blue-500",    label: "完了"   },
  error:     { pill: "bg-red-50 text-red-700",                dot: "bg-red-500",     label: "エラー" },
  stopped:   { pill: "bg-amber-50 text-amber-700",            dot: "bg-amber-500",   label: "停止"   },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const c = CONFIG[status];
  const isRunning = status === "running";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${c.pill}`}>
      <span className="relative flex h-2 w-2">
        {isRunning && (
          <span className={`absolute inline-flex h-full w-full rounded-full ${c.dot} ring-ping opacity-75`}
            style={{ animation: "ring-ping 1.2s cubic-bezier(0,0,0.2,1) infinite" }} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${c.dot} ${isRunning ? "pulse-dot" : ""}`} />
      </span>
      {c.label}
    </span>
  );
}
