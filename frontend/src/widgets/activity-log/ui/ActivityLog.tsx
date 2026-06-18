import { Activity, ActivityKind, ActivityResult } from "@/entities/activity/model/types";

const KIND_LABEL: Record<ActivityKind, string> = {
  task:   "タスク実行",
  voice:  "音声入力",
  error:  "エラー",
  manual: "手動操作",
};

const TASK_LABEL: Record<string, string> = {
  spon_mix_1and2: "スポンジタスク",
  cup_1:          "カップタスク",
};

const RESULT_STYLE: Record<ActivityResult, string> = {
  completed: "text-gray-500",
  stopped:   "text-gray-500",
  error:     "text-red-600 font-semibold",
};

const RESULT_LABEL: Record<ActivityResult, string> = {
  completed: "完了",
  stopped:   "停止",
  error:     "エラー",
};

interface Props {
  activities: Activity[];
  roomName: string;
}

export function ActivityLog({ activities, roomName }: Props) {
  if (activities.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-200">
        <p className="text-sm text-gray-400">活動記録なし</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
        {roomName} の活動ログ
      </p>

      {/* timeline */}
      <div className="relative pl-5">
        {/* vertical line */}
        <div className="absolute inset-y-0 left-[7px] w-px bg-gray-200" />

        <div className="space-y-4">
          {activities.map((act) => {
            const isError = act.result === "error" || act.kind === "error";
            const time = new Date(act.timestamp).toLocaleTimeString("ja-JP", {
              hour: "2-digit", minute: "2-digit",
            });
            const date = new Date(act.timestamp).toLocaleDateString("ja-JP", {
              month: "numeric", day: "numeric",
            });

            return (
              <div key={act.id} className="relative">
                {/* timeline dot */}
                <span className={`absolute left-[-13px] top-[5px] h-3 w-3 rounded-full border-2 border-white ring-1 ${isError ? "bg-red-500 ring-red-300" : "bg-gray-400 ring-gray-200"}`} />

                <div className={`rounded-lg border px-4 py-3 ${isError ? "border-red-100 bg-red-50" : "border-gray-100 bg-white"}`}>
                  {/* header */}
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span className="font-mono text-sm font-bold text-gray-900">{time}</span>
                    <span className="text-xs text-gray-400">{date}</span>
                    <span className={`text-xs font-bold ${isError ? "text-red-600" : "text-gray-600"}`}>
                      {KIND_LABEL[act.kind]}
                    </span>
                    {act.taskLabel && (
                      <span className="text-xs font-semibold text-gray-700">
                        — {act.taskLabel ?? (act.taskName ? TASK_LABEL[act.taskName] : "")}
                      </span>
                    )}
                    <span className={`ml-auto text-xs ${RESULT_STYLE[act.result]}`}>
                      {RESULT_LABEL[act.result]}
                    </span>
                  </div>

                  {/* details */}
                  <div className="mt-1.5 space-y-0.5 text-sm text-gray-600">
                    {act.voiceText && (
                      <p>
                        <span className="font-semibold text-gray-400">音声 </span>
                        「{act.voiceText}」
                      </p>
                    )}
                    {act.durationSec !== undefined && (
                      <p>
                        <span className="font-semibold text-gray-400">時間 </span>
                        <span className="font-mono">{act.durationSec}秒</span>
                      </p>
                    )}
                    {act.note && (
                      <p className={isError ? "text-red-600" : ""}>{act.note}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
