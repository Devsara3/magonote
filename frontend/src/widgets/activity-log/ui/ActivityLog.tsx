import { Activity, ActivityKind, ActivityResult } from "@/entities/activity/model/types";

/* ── icons ── */
function TaskIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M10 2a.75.75 0 0 1 .75.75v.258a33.186 33.186 0 0 1 6.668.83.75.75 0 0 1-.336 1.461 31.28 31.28 0 0 0-1.103-.232l1.702 7.545a.75.75 0 0 1-.387.832A4.981 4.981 0 0 1 15 14c-.825 0-1.606-.2-2.294-.556a.75.75 0 0 1-.387-.832l1.77-7.849a31.743 31.743 0 0 0-3.339-.254v9.505a20.727 20.727 0 0 1 3.78.501.75.75 0 1 1-.339 1.462A19.215 19.215 0 0 0 10 15.75a19.215 19.215 0 0 0-4.191.462.75.75 0 1 1-.338-1.462 20.727 20.727 0 0 1 3.779-.501V5.258a31.743 31.743 0 0 0-3.339.254l1.77 7.849a.75.75 0 0 1-.387.832A4.98 4.98 0 0 1 5 14a4.98 4.98 0 0 1-2.294-.556.75.75 0 0 1-.387-.832l1.702-7.545c-.37.069-.736.144-1.103.232a.75.75 0 0 1-.336-1.461 33.186 33.186 0 0 1 6.668-.83V2.75A.75.75 0 0 1 10 2z" />
    </svg>
  );
}
function MicIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4zm-2 6a5 5 0 0 0 10 0H13a3 3 0 1 1-6 0H5z" />
    </svg>
  );
}
function ErrorIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
    </svg>
  );
}
function ManualIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84z" />
    </svg>
  );
}

const KIND_CONFIG: Record<ActivityKind, { icon: React.ReactNode; iconBg: string; iconText: string; label: string }> = {
  task:   { icon: <TaskIcon />,   iconBg: "bg-blue-100",   iconText: "text-blue-700",  label: "タスク実行"  },
  voice:  { icon: <MicIcon />,    iconBg: "bg-purple-100", iconText: "text-purple-700",label: "音声入力"    },
  error:  { icon: <ErrorIcon />,  iconBg: "bg-red-100",    iconText: "text-red-700",   label: "エラー"      },
  manual: { icon: <ManualIcon />, iconBg: "bg-gray-100",   iconText: "text-gray-600",  label: "手動操作"    },
};

const RESULT_CONFIG: Record<ActivityResult, { badge: string; label: string }> = {
  completed: { badge: "bg-green-100 text-green-800", label: "完了" },
  stopped:   { badge: "bg-yellow-100 text-yellow-800", label: "停止" },
  error:     { badge: "bg-red-100 text-red-800",    label: "エラー" },
};

interface Props {
  activities: Activity[];
  roomName: string;
}

export function ActivityLog({ activities, roomName }: Props) {
  if (activities.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-gray-200">
        <p className="text-sm font-semibold text-gray-400">活動記録なし</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
        {roomName} の活動ログ（新しい順）
      </p>

      {activities.map((act) => {
        const k = KIND_CONFIG[act.kind];
        const r = RESULT_CONFIG[act.result];
        const time = new Date(act.timestamp).toLocaleTimeString("ja-JP", {
          hour: "2-digit", minute: "2-digit", second: "2-digit",
        });
        const date = new Date(act.timestamp).toLocaleDateString("ja-JP", {
          month: "numeric", day: "numeric",
        });

        return (
          <div
            key={act.id}
            className="rounded-xl border-2 border-gray-200 bg-white px-4 py-4"
          >
            {/* header row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* timestamp */}
              <div className="text-right">
                <p className="font-mono text-sm font-bold text-gray-900">{time}</p>
                <p className="font-mono text-xs text-gray-400">{date}</p>
              </div>
              {/* kind icon */}
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${k.iconBg} ${k.iconText}`}>
                {k.icon}
              </span>
              {/* kind label */}
              <span className="text-sm font-bold text-gray-800">{k.label}</span>
              {act.taskLabel && (
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-sm font-semibold text-gray-700">
                  {act.taskLabel}
                </span>
              )}
              {/* result badge */}
              <span className={`ml-auto rounded-md px-2.5 py-1 text-xs font-bold ${r.badge}`}>
                {r.label}
              </span>
            </div>

            {/* details */}
            <div className="mt-3 space-y-1.5 pl-12">
              {act.voiceText && (
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-purple-100 text-purple-700">
                    <MicIcon />
                  </span>
                  <p className="text-sm font-semibold text-gray-800">
                    「{act.voiceText}」
                  </p>
                </div>
              )}
              {act.durationSec !== undefined && (
                <p className="text-sm text-gray-600">
                  実行時間: <span className="font-mono font-bold text-gray-900">{act.durationSec}秒</span>
                </p>
              )}
              {act.note && (
                <p className="text-sm text-gray-600">{act.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
