"use client";
import { TaskType } from "@/entities/task/model/types";

interface Props {
  taskType: TaskType;
  label: string;
  sublabel: string;
  description: string;
  icon: React.ReactNode;
  accent: { ring: string; bg: string; tag: string; tagText: string; progress: string };
  disabled: boolean;
  isActive: boolean;
  onClick: () => void;
}

export function TaskButton({
  label, sublabel, description, icon, accent, disabled, isActive, onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "group relative w-full overflow-hidden rounded-2xl border bg-white text-left",
        "shadow-sm transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "hover:shadow-md hover:-translate-y-0.5",
        "active:translate-y-0 active:shadow-sm",
        isActive ? `${accent.ring} ring-2` : "border-slate-200 hover:border-slate-300",
      ].join(" ")}
    >
      {/* progress bar when active */}
      {isActive && (
        <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-slate-100">
          <div className={`h-full w-1/3 rounded-full ${accent.progress} progress-bar`} />
        </div>
      )}

      <div className="p-5">
        {/* icon + label */}
        <div className="flex items-start gap-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent.bg}`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-slate-800">{label}</p>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${accent.tag} ${accent.tagText}`}>
                {sublabel}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
          </div>
        </div>

        {/* running indicator */}
        {isActive && (
          <div className="mt-3 flex items-center gap-2 fade-in">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                style={{ animation: "ring-ping 1.2s cubic-bezier(0,0,0.2,1) infinite" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-600">実行中...</span>
          </div>
        )}
      </div>
    </button>
  );
}
