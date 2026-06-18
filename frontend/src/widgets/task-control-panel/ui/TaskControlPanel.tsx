"use client";
import { useTaskStore } from "@/features/robot-task/model/useTaskStore";
import { TaskButton } from "@/features/robot-task/ui/TaskButton";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { ElapsedTimer } from "@/shared/ui/ElapsedTimer";
import { ConnectionDot } from "@/shared/ui/ConnectionDot";
import { VoicePanel } from "@/features/voice-command/ui/VoicePanel";

/* ── icons ── */
function SpongeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-violet-600" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <rect x="3" y="8" width="18" height="10" rx="2.5" />
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <circle cx="8.5"  cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="12"   cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="13" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function CupIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-sky-600" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <path d="M6 3h12l-2 14a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2L6 3z" />
      <path d="M18 6h1.5A1.5 1.5 0 0 1 21 7.5v1A1.5 1.5 0 0 1 19.5 10H18" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  );
}
function StopSquare() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <rect x="5" y="5" width="10" height="10" rx="1.5" />
    </svg>
  );
}

const SPON_ACCENT = {
  ring: "ring-violet-400",
  bg: "bg-violet-50",
  tag: "bg-violet-100",
  tagText: "text-violet-700",
  progress: "bg-violet-500",
};
const CUP_ACCENT = {
  ring: "ring-sky-400",
  bg: "bg-sky-50",
  tag: "bg-sky-100",
  tagText: "text-sky-700",
  progress: "bg-sky-500",
};

export function TaskControlPanel() {
  const { task, error, loading, connection, elapsedMs, execute, stop, startPolling } = useTaskStore();
  const isRunning = task.status === "running";
  const isDone    = task.status === "completed" || task.status === "stopped";

  return (
    <div className="space-y-4">

      {/* ── Status strip ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">ステータス</span>
            <StatusBadge status={task.status} />
          </div>
          {(isRunning || isDone) && (
            <div className="flex items-center gap-2 fade-in">
              <span className="text-xs text-slate-400">
                {isRunning ? "経過時間" : "所要時間"}
              </span>
              <ElapsedTimer ms={elapsedMs} />
            </div>
          )}
          {task.pid && isRunning && (
            <span className="text-xs text-slate-300">PID {task.pid}</span>
          )}
        </div>
        <ConnectionDot status={connection} />
      </div>

      {/* ── Task cards ── */}
      <div className="grid gap-3 sm:grid-cols-2">
        <TaskButton
          taskType="spon_mix_1and2"
          label="スポンジタスク"
          sublabel="spon_mix_1and2"
          description="物体を左へ押す — 50 s × 2 エピソード"
          icon={<SpongeIcon />}
          accent={SPON_ACCENT}
          disabled={isRunning || loading}
          isActive={isRunning && task.task_type === "spon_mix_1and2"}
          onClick={() => execute("spon_mix_1and2")}
        />
        <TaskButton
          taskType="cup_1"
          label="カップタスク"
          sublabel="cup_1"
          description="物体を左へ押す — 50 s × 2 エピソード"
          icon={<CupIcon />}
          accent={CUP_ACCENT}
          disabled={isRunning || loading}
          isActive={isRunning && task.task_type === "cup_1"}
          onClick={() => execute("cup_1")}
        />
      </div>

      {/* ── Emergency stop ── */}
      {isRunning && (
        <button
          onClick={stop}
          disabled={loading}
          className="
            slide-up flex w-full items-center justify-center gap-2
            rounded-2xl border border-red-200 bg-red-50 py-3.5
            text-sm font-bold text-red-600
            shadow-sm transition-all duration-200
            hover:bg-red-100 hover:shadow-md
            disabled:opacity-50 active:scale-[0.99]
          "
        >
          <StopSquare />
          緊急停止
        </button>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="slide-up flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-red-500">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.75-9.25a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* ── Result card ── */}
      {isDone && (
        <div className="slide-up rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-400">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {task.status === "completed" ? "実行結果" : "停止記録"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "タスク",   value: task.task_type ?? "—" },
              { label: "開始",     value: task.started_at  ? new Date(task.started_at).toLocaleTimeString("ja-JP")  : "—" },
              { label: "終了",     value: task.finished_at ? new Date(task.finished_at).toLocaleTimeString("ja-JP") : "—" },
              { label: "所要時間", value: null },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-slate-50 px-3 py-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{label}</p>
                {value !== null
                  ? <p className="mt-0.5 truncate font-mono text-sm font-semibold text-slate-700">{value}</p>
                  : <div className="mt-0.5"><ElapsedTimer ms={elapsedMs} /></div>
                }
              </div>
            ))}
          </div>
          {task.error_message && (
            <p className="mt-3 text-xs text-red-500">{task.error_message}</p>
          )}
        </div>
      )}

      {/* ── Divider ── */}
      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">または</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* ── Voice panel ── */}
      <VoicePanel
        disabled={isRunning || loading}
        onTaskLaunched={startPolling}
      />
    </div>
  );
}
