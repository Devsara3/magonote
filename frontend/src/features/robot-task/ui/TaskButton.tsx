"use client";
import { TaskType } from "@/entities/task/model/types";

interface Props {
  taskType: TaskType;
  label: string;
  description: string;
  icon: React.ReactNode;
  accentClass: string;
  glowClass: string;
  disabled: boolean;
  isActive: boolean;
  onClick: () => void;
}

export function TaskButton({
  label,
  description,
  icon,
  accentClass,
  glowClass,
  disabled,
  isActive,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "group relative w-full overflow-hidden rounded-2xl border p-6 text-left",
        "transition-all duration-300",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "active:scale-[0.98]",
        isActive
          ? `border-opacity-80 bg-slate-700/80 ${accentClass} ${glowClass}`
          : "border-slate-600/50 bg-slate-800/60 hover:border-slate-500 hover:bg-slate-700/70",
      ].join(" ")}
    >
      {/* Background gradient sweep on hover */}
      <div
        className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${accentClass} [mask-image:linear-gradient(to_bottom,transparent,rgba(0,0,0,0.06))]`}
      />

      <div className="relative flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accentClass} bg-opacity-20`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-base font-bold text-slate-100">{label}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            {description}
          </p>
        </div>
      </div>

      {isActive && (
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 dot-blink" />
          実行中...
        </div>
      )}
    </button>
  );
}
