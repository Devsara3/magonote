"use client";
import { useVoiceStore } from "../model/useVoiceStore";

interface Props {
  disabled: boolean;
  onTaskLaunched: () => void;
}

const TASK_LABEL: Record<string, string> = {
  spon_mix_1and2: "スポンジタスク",
  cup_1: "カップタスク",
};

function MicIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`h-6 w-6 ${active ? "text-white" : "text-slate-600"}`}
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8"  y1="22" x2="16" y2="22" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="h-5 w-5 animate-spin text-violet-500" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={3} />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
  );
}

export function VoicePanel({ disabled, onTaskLaunched }: Props) {
  const { phase, result, error, countdown, start, reset } = useVoiceStore(onTaskLaunched);

  const isIdle        = phase === "idle" || phase === "error";
  const isRecording   = phase === "recording";
  const isProcessing  = phase === "transcribing";
  const isDone        = phase === "done";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* header */}
      <div className="mb-4 flex items-center gap-2">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-400">
          <path d="M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4zm-2 6a5 5 0 0 0 10 0H13a3 3 0 1 1-6 0H5z" />
        </svg>
        <span className="text-sm font-semibold text-slate-700">音声コマンド</span>
        <span className="ml-auto rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
          Whisper + GPT-4o
        </span>
      </div>

      {/* mic button */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={isIdle ? start : reset}
          disabled={disabled || isRecording || isProcessing}
          className={[
            "relative flex h-20 w-20 items-center justify-center rounded-full",
            "transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40",
            "shadow-md active:scale-95",
            isRecording
              ? "bg-red-500 shadow-red-200"
              : isDone
              ? "bg-emerald-500 shadow-emerald-200 hover:bg-emerald-600"
              : "bg-slate-100 hover:bg-slate-200 shadow-slate-200",
          ].join(" ")}
        >
          {/* ping ring while recording */}
          {isRecording && (
            <span className="absolute inset-0 rounded-full bg-red-400 opacity-40"
              style={{ animation: "ring-ping 1.2s cubic-bezier(0,0,0.2,1) infinite" }} />
          )}
          {isDone
            ? <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-white" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
            : <MicIcon active={isRecording} />
          }
        </button>

        {/* state label */}
        {isIdle && !error && (
          <p className="text-sm text-slate-500">
            {disabled ? "タスク実行中は使用不可" : "ボタンを押して話しかける"}
          </p>
        )}
        {isRecording && (
          <div className="flex flex-col items-center gap-1 fade-in">
            <p className="text-sm font-semibold text-red-600">録音中...</p>
            <p className="text-xs text-slate-400">あと {countdown} 秒</p>
          </div>
        )}
        {isProcessing && (
          <div className="flex items-center gap-2 fade-in">
            <SpinnerIcon />
            <p className="text-sm text-slate-600">AI が解析中...</p>
          </div>
        )}
        {isDone && (
          <p className="text-xs text-slate-400">タップでリセット</p>
        )}
      </div>

      {/* result */}
      {isDone && result && (
        <div className="mt-5 space-y-3 slide-up">
          {/* transcription */}
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              認識テキスト
            </p>
            <p className="text-sm text-slate-800">&ldquo;{result.transcription}&rdquo;</p>
          </div>

          {/* intent */}
          <div className={`rounded-xl px-4 py-3 ${result.task_type ? "bg-violet-50" : "bg-amber-50"}`}>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              判定結果
            </p>
            {result.task_type ? (
              <div className="flex items-center gap-2">
                <span className="inline-block rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-bold text-violet-700">
                  {TASK_LABEL[result.task_type] ?? result.task_type}
                </span>
                <span className="text-xs text-slate-500">{result.reason}</span>
              </div>
            ) : (
              <p className="text-sm text-amber-700">
                対応するタスクが見つかりませんでした — {result.reason}
              </p>
            )}
          </div>

          {result.task_launched && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              タスクを自動実行しました
            </div>
          )}
        </div>
      )}

      {/* error */}
      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 slide-up">
          <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-red-500">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.75-9.25a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
          </svg>
          <div>
            <p>{error}</p>
            <button onClick={reset} className="mt-1 text-xs underline text-red-600 hover:text-red-800">
              リセット
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
