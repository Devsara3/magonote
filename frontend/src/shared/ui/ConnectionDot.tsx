import { ConnectionStatus } from "@/features/robot-task/model/useTaskStore";

const CONFIG: Record<ConnectionStatus, { dot: string; label: string }> = {
  connected:    { dot: "bg-emerald-500", label: "API 接続中"  },
  disconnected: { dot: "bg-red-500",     label: "API 未接続"  },
  checking:     { dot: "bg-amber-400",   label: "確認中..."   },
};

export function ConnectionDot({ status }: { status: ConnectionStatus }) {
  const c = CONFIG[status];
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${c.dot} ${status === "checking" ? "pulse-dot" : ""}`} />
      <span className="text-xs text-slate-400">{c.label}</span>
    </div>
  );
}
