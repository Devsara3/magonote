import Link from "next/link";
import { TaskControlPanel } from "@/widgets/task-control-panel/ui/TaskControlPanel";

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* ── ヘッダー ── */}
        <header className="mb-8 border-b-2 border-gray-200 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">まごのて</h1>
              <p className="text-sm font-semibold text-gray-600">ロボットアーム制御システム</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-bold text-gray-500">so101_follower</p>
                <p className="text-xs text-gray-400">/dev/ttyACM1</p>
              </div>
              <Link
                href="/admin"
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                スタッフ管理画面 →
              </Link>
            </div>
          </div>
        </header>

        {/* ── メインパネル ── */}
        <TaskControlPanel />

      </div>
    </div>
  );
}
