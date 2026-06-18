import { TaskControlPanel } from "@/widgets/task-control-panel/ui/TaskControlPanel";

function LogoIcon() {
  return (
    <svg viewBox="0 0 36 36" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 28 L14 20 L20 14 L28 8" className="text-violet-500" stroke="currentColor" />
      <circle cx="28" cy="8" r="3" className="text-violet-500" stroke="currentColor" strokeWidth={2} />
      <path d="M14 20 L10 24 L12 27 L16 23" fill="currentColor" className="text-violet-300" stroke="none" />
      <path d="M8 28 L11 30" strokeWidth={2.5} className="text-slate-400" stroke="currentColor" />
    </svg>
  );
}

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-sky-400 to-emerald-400" />

      <div className="mx-auto max-w-2xl px-4 py-10">

        {/* ── Header ── */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200 text-violet-500">
              <LogoIcon />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">まごのて</h1>
              <p className="text-xs text-slate-400">HRI Dashboard — Phase 1</p>
            </div>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">so101 follower</p>
            <p className="text-[10px] text-slate-300">/dev/ttyACM1</p>
          </div>
        </header>

        {/* ── Section heading ── */}
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-sm font-semibold text-slate-700">タスク制御</h2>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* ── Main panel ── */}
        <TaskControlPanel />

        {/* ── Footer ── */}
        <footer className="mt-10 text-center text-[11px] text-slate-300">
          LeRobot · so101_follower · camera index 4 · localhost:8000
        </footer>

      </div>
    </div>
  );
}
