import { ConnectionStatus } from "@/features/robot-task/model/useTaskStore";

const CONFIG: Record<ConnectionStatus, { dot: string; label: string }> = {
  connected:    { dot: "bg-green-500", label: "API 接続中"  },
  disconnected: { dot: "bg-red-600",   label: "API 未接続"  },
  checking:     { dot: "bg-yellow-500",label: "確認中..."   },
};

export function ConnectionDot({ status }: { status: ConnectionStatus }) {
  const c = CONFIG[status];
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${c.dot} ${status === "checking" ? "pulse-dot" : ""}`} />
      <span className="text-sm font-medium text-gray-700">{c.label}</span>
    </div>
  );
}
