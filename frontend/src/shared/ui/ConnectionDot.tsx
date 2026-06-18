import { ConnectionStatus } from "@/features/robot-task/model/useTaskStore";

const CONFIG: Record<
  ConnectionStatus,
  { color: string; label: string; anim: string }
> = {
  connected: {
    color: "bg-emerald-400",
    label: "API 接続中",
    anim: "glow-green",
  },
  disconnected: {
    color: "bg-red-500",
    label: "API 未接続",
    anim: "glow-red",
  },
  checking: {
    color: "bg-yellow-400",
    label: "確認中...",
    anim: "dot-blink",
  },
};

export function ConnectionDot({ status }: { status: ConnectionStatus }) {
  const c = CONFIG[status];
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${c.color} ${c.anim}`} />
      <span className="text-xs text-slate-400">{c.label}</span>
    </div>
  );
}
