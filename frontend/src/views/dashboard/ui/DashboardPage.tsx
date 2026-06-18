import Link from "next/link";
import { TaskControlPanel } from "@/widgets/task-control-panel/ui/TaskControlPanel";

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4 py-8">

        {/* ── ヘッダー ── */}
        <header className="mb-6 border-b-2 border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">まごのて</h1>
              <p className="text-sm font-semibold text-gray-600">ロボットアーム制御システム</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Link
                href="/admin"
                className="rounded-xl border-2 border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-600 hover:border-gray-400 hover:bg-gray-50 active:brightness-95"
              >
                スタッフ管理画面 →
              </Link>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-500">so101_follower</p>
                <p className="text-xs text-gray-400">/dev/ttyACM1</p>
              </div>
            </div>
          </div>
        </header>

        {/* ── メインパネル ── */}
        <TaskControlPanel />

      </div>
    </div>
  );
}
