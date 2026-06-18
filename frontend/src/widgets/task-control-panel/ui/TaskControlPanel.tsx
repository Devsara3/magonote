"use client";
import { useTaskStore } from "@/features/robot-task/model/useTaskStore";
import { TaskButton } from "@/features/robot-task/ui/TaskButton";
import { StatusBadge } from "@/shared/ui/StatusBadge";

export function TaskControlPanel() {
  const { task, error, loading, execute, stop } = useTaskStore();
  const isRunning = task.status === "running";

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        ロボットタスク制御
      </h2>

      {/* Status */}
      <div className="mb-8 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-500">現在のステータス:</span>
        <StatusBadge status={task.status} />
        {task.pid && (
          <span className="text-xs text-gray-400">PID: {task.pid}</span>
        )}
      </div>

      {/* Task buttons */}
      <div className="grid gap-4 sm:grid-cols-2">
        <TaskButton
          taskType="spon_mix_1and2"
          label="スポンジタスク実行"
          description="spon_mix_1and2 モデルを使って物体を左へ押す"
          disabled={isRunning || loading}
          onClick={() => execute("spon_mix_1and2")}
        />
        <TaskButton
          taskType="cup_1"
          label="カップタスク実行"
          description="cup_1 モデルを使って物体を左へ押す"
          disabled={isRunning || loading}
          onClick={() => execute("cup_1")}
        />
      </div>

      {/* Stop button */}
      {isRunning && (
        <button
          onClick={stop}
          disabled={loading}
          className="
            mt-6 w-full rounded-2xl bg-red-500 py-4 text-lg font-bold text-white
            shadow-md transition-all duration-200
            hover:bg-red-600 hover:shadow-lg
            disabled:opacity-50
            active:scale-95
          "
        >
          緊急停止
        </button>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Completion message */}
      {(task.status === "completed" || task.status === "stopped") && (
        <div className="mt-4 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
          タスク完了: {task.task_type}（終了: {task.finished_at}）
        </div>
      )}
    </div>
  );
}
