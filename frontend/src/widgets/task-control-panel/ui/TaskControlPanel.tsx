"use client";
import { useTaskStore } from "@/features/robot-task/model/useTaskStore";
import { TaskButton } from "@/features/robot-task/ui/TaskButton";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { ElapsedTimer } from "@/shared/ui/ElapsedTimer";
import { ConnectionDot } from "@/shared/ui/ConnectionDot";
import { VoicePanel } from "@/features/voice-command/ui/VoicePanel";

export function TaskControlPanel() {
  const { task, error, loading, connection, elapsedMs, execute, stop, startPolling } = useTaskStore();
  const isRunning = task.status === "running";
  const isDone    = task.status === "completed" || task.status === "stopped";

  return (
    <div className="space-y-4">

      {/* ── 1. 緊急停止（最優先・最上部） ── */}
      {isRunning && (
        <button
          onClick={stop}
          disabled={loading}
          className="
            slide-up w-full rounded-xl bg-red-600 py-6
            text-xl font-extrabold tracking-wide text-white
            shadow-md
            hover:bg-red-700 active:bg-red-800
            disabled:opacity-60
          "
        >
          ■ 緊急停止
        </button>
      )}

      {/* ── 2. ステータスバー ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-gray-200 bg-white px-5 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">ステータス</span>
            <StatusBadge status={task.status} />
          </div>
          {(isRunning || isDone) && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">
                {isRunning ? "経過時間" : "所要時間"}
              </span>
              <ElapsedTimer ms={elapsedMs} />
            </div>
          )}
        </div>
        <ConnectionDot status={connection} />
      </div>

      {/* ── 3. タスクボタン ── */}
      <div className="grid gap-3 sm:grid-cols-2">
        <TaskButton
          label="スポンジタスク"
          description="spon_mix_1and2 モデル — 物体を左へ押す"
          accentColor="border-blue-600"
          disabled={isRunning || loading}
          isActive={isRunning && task.task_type === "spon_mix_1and2"}
          onClick={() => execute("spon_mix_1and2")}
        />
        <TaskButton
          label="カップタスク"
          description="cup_1 モデル — 物体を左へ押す"
          accentColor="border-cyan-600"
          disabled={isRunning || loading}
          isActive={isRunning && task.task_type === "cup_1"}
          onClick={() => execute("cup_1")}
        />
      </div>

      {/* ── 4. エラー表示 ── */}
      {error && (
        <div className="slide-up rounded-xl border-2 border-red-300 bg-red-50 px-4 py-4 text-sm font-semibold text-red-800">
          エラー: {error}
        </div>
      )}

      {/* ── 5. 完了記録 ── */}
      {isDone && (
        <div className="slide-up rounded-xl border-2 border-gray-200 bg-gray-50 px-5 py-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
            {task.status === "completed" ? "実行完了" : "停止記録"}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "タスク",   value: task.task_type ?? "—" },
              { label: "開始",     value: task.started_at  ? new Date(task.started_at).toLocaleTimeString("ja-JP")  : "—" },
              { label: "終了",     value: task.finished_at ? new Date(task.finished_at).toLocaleTimeString("ja-JP") : "—" },
              { label: "所要時間", value: null },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                <p className="text-xs font-bold text-gray-500">{label}</p>
                {value !== null
                  ? <p className="mt-0.5 truncate font-mono text-sm font-bold text-gray-900">{value}</p>
                  : <div className="mt-0.5"><ElapsedTimer ms={elapsedMs} /></div>
                }
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 6. 音声コマンド（セカンダリ） ── */}
      <div className="border-t-2 border-gray-100 pt-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">音声コマンド</p>
        <VoicePanel
          disabled={isRunning || loading}
          onTaskLaunched={startPolling}
        />
      </div>

    </div>
  );
}
