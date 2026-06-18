import { TaskControlPanel } from "@/widgets/task-control-panel/ui/TaskControlPanel";

export function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            まごのて HRI ダッシュボード
          </h1>
          <p className="mt-2 text-gray-500">
            自律型ロボットアーム制御システム — Phase 1 MVP
          </p>
        </header>
        <TaskControlPanel />
      </div>
    </main>
  );
}
