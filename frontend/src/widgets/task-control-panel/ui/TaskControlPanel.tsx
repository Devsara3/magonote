"use client";
import { useTaskStore } from "@/features/robot-task/model/useTaskStore";
import { TaskButton } from "@/features/robot-task/ui/TaskButton";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { ElapsedTimer } from "@/shared/ui/ElapsedTimer";
import { ConnectionDot } from "@/shared/ui/ConnectionDot";

/* ---------- inline SVG icons ---------- */
function SpongeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-indigo-400" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="8" width="18" height="10" rx="2" />
      <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
      <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CupIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-cyan-400" stroke="currentColor" strokeWidth={1.8}>
      <path d="M6 2h12l-1.5 13A2 2 0 0 1 14.52 17H9.48a2 2 0 0 1-1.98-2L6 2z" />
      <path d="M18 5h1a2 2 0 0 1 0 4h-1" />
      <path d="M4 22h16" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  );
}

function RobotIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-slate-400" stroke="currentColor" strokeWidth={1.6}>
      <rect x="7" y="8" width="10" height="9" rx="1.5" />
      <circle cx="9.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
      <path d="M10 15.5h4" />
      <path d="M12 8V5" />
      <circle cx="12" cy="4" r="1" />
      <path d="M7 10H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2" />
      <path d="M17 10h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2" />
    </svg>
  );
}

/* ---------- main component ---------- */
export function TaskControlPanel() {
  const { task, error, loading, connection, elapsedMs, execute, stop } =
    useTaskStore();

  const isRunning = task.status === "running";
  const isIdle = task.status === "idle";

  return (
    <div className="space-y-4">
      {/* ── Status bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/50 bg-slate-800/50 px-5 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <RobotIcon />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">ステータス</span>
            <StatusBadge status={task.status} />
          </div>
          {isRunning && (
            <div className="flex items-center gap-2 fade-in">
              <span className="text-xs text-slate-500">経過時間</span>
              <ElapsedTimer ms={elapsedMs} />
            </div>
          )}
          {!isIdle && !isRunning && task.started_at && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>所要時間</span>
              <ElapsedTimer ms={elapsedMs} />
            </div>
          )}
        </div>
        <ConnectionDot status={connection} />
      </div>

      {/* ── Task buttons ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <TaskButton
          taskType="spon_mix_1and2"
          label="スポンジタスク"
          description="spon_mix_1and2 モデルを使用して物体を左へ押す（50s × 2エピソード）"
          icon={<SpongeIcon />}
          accentClass="border-indigo-500/60 bg-indigo-500/10"
          glowClass="glow-blue"
          disabled={isRunning || loading}
          isActive={isRunning && task.task_type === "spon_mix_1and2"}
          onClick={() => execute("spon_mix_1and2")}
        />
        <TaskButton
          taskType="cup_1"
          label="カップタスク"
          description="cup_1 モデルを使用して物体を左へ押す（50s × 2エピソード）"
          icon={<CupIcon />}
          accentClass="border-cyan-500/60 bg-cyan-500/10"
          glowClass="glow-green"
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
            slide-in-up glow-red
            flex w-full items-center justify-center gap-3
            rounded-2xl border border-red-500/70 bg-red-600/20 py-4
            text-base font-bold tracking-wide text-red-400
            transition-all duration-200
            hover:bg-red-600/35 hover:text-red-300
            disabled:opacity-50
            active:scale-[0.98]
          "
        >
          <StopIcon />
          緊急停止
        </button>
      )}

      {/* ── Error alert ── */}
      {error && (
        <div className="slide-in-up flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-red-400">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.75-9.25a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* ── Completion card ── */}
      {(task.status === "completed" || task.status === "stopped") && (
        <div className="slide-in-up rounded-xl border border-slate-600/50 bg-slate-800/60 px-5 py-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
            {task.status === "completed" ? "最終実行結果" : "停止記録"}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-300">
            <span>
              タスク:{" "}
              <span className="font-medium text-slate-100">
                {task.task_type}
              </span>
            </span>
            <span>
              開始:{" "}
              <span className="font-mono text-slate-200">
                {task.started_at
                  ? new Date(task.started_at).toLocaleTimeString("ja-JP")
                  : "—"}
              </span>
            </span>
            <span>
              終了:{" "}
              <span className="font-mono text-slate-200">
                {task.finished_at
                  ? new Date(task.finished_at).toLocaleTimeString("ja-JP")
                  : "—"}
              </span>
            </span>
            <span>
              所要:{" "}
              <span className="font-mono text-emerald-400">
                <ElapsedTimer ms={elapsedMs} />
              </span>
            </span>
          </div>
          {task.error_message && (
            <p className="mt-2 text-xs text-red-400">{task.error_message}</p>
          )}
        </div>
      )}
    </div>
  );
}
