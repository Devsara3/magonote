import { TaskControlPanel } from "@/widgets/task-control-panel/ui/TaskControlPanel";

function ArmIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth={1.5}>
      <path d="M6 26 L12 20 L18 14 L24 8" strokeLinecap="round" />
      <circle cx="24" cy="8" r="3" strokeWidth={2} />
      <path d="M12 20 L8 24 L10 26 L14 22" fill="currentColor" stroke="none" opacity="0.6" />
      <path d="M6 26 L10 28" strokeLinecap="round" strokeWidth={2.5} />
    </svg>
  );
}

export function DashboardPage() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0b0f1a 0%, #0f172a 50%, #0d1520 100%)" }}>
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-2xl px-4 py-10">
        {/* ── Header ── */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                <ArmIcon />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-100">
                  まごのて
                </h1>
                <p className="text-xs text-slate-500">
                  HRI Dashboard — Phase 1
                </p>
              </div>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-[10px] uppercase tracking-widest text-slate-600">
                Robot Arm Control
              </p>
              <p className="text-[10px] text-slate-700">so101_follower · /dev/ttyACM1</p>
            </div>
          </div>

          {/* Divider with glow */}
          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-slate-600/60 to-transparent" />
        </header>

        {/* ── Section label ── */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-600">
            タスク制御
          </span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        {/* ── Main panel ── */}
        <TaskControlPanel />

        {/* ── Footer ── */}
        <footer className="mt-10 text-center text-[10px] text-slate-700">
          LeRobot · so101_follower · camera index 4 · localhost:8000
        </footer>
      </div>
    </div>
  );
}
