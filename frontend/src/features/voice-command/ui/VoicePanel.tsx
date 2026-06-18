"use client";
import { useVoiceStore } from "../model/useVoiceStore";

interface Props {
  disabled: boolean;
  onTaskLaunched: () => void;
}

const TASK_LABEL: Record<string, string> = {
  spon_mix_1and2: "おにぎりを取る",
  cup_1: "飲み物を取る",
};

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8"  y1="22" x2="16" y2="22" />
    </svg>
  );
}

export function VoicePanel({ disabled, onTaskLaunched }: Props) {
  const { phase, result, error, countdown, start, reset } = useVoiceStore(onTaskLaunched);

  const isIdle       = phase === "idle" || phase === "error";
  const isRecording  = phase === "recording";
  const isProcessing = phase === "transcribing";
  const isDone       = phase === "done";

  return (
    <div className="rounded-xl border-2 border-gray-200 bg-white p-5">
      <div className="flex flex-col items-center gap-4">

        {/* mic button — fat-finger: 88×88px */}
        <button
          onClick={isIdle ? start : reset}
          disabled={disabled || isRecording || isProcessing}
          className={[
            "flex h-[88px] w-[88px] items-center justify-center rounded-full border-4",
            "transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40",
            "active:brightness-90",
            isRecording
              ? "border-red-600 bg-red-600 text-white"
              : isDone
              ? "border-green-600 bg-green-600 text-white"
              : "border-gray-400 bg-white text-gray-700 hover:border-gray-600 hover:bg-gray-50",
          ].join(" ")}
        >
          {isProcessing ? (
            <span className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-blue-600 spin" />
          ) : isDone ? (
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <MicIcon />
          )}
        </button>

        {/* state label */}
        <div className="text-center">
          {isIdle && !error && (
            <p className="text-sm font-semibold text-gray-700">
              {disabled ? "タスク実行中は使用できません" : "ボタンを押して話しかけてください"}
            </p>
          )}
          {isRecording && (
            <div className="slide-up">
              <p className="text-base font-bold text-red-600">録音中...</p>
              <p className="mt-1 text-sm font-semibold text-gray-700">あと {countdown} 秒</p>
            </div>
          )}
          {isProcessing && (
            <p className="text-base font-bold text-blue-700">AI が解析中...</p>
          )}
          {isDone && (
            <p className="text-sm font-semibold text-gray-600">タップしてリセット</p>
          )}
        </div>

        {/* result */}
        {isDone && result && (
          <div className="w-full space-y-3 slide-up">
            {/* transcription */}
            <div className="rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-500">認識テキスト</p>
              <p className="text-base font-semibold text-gray-900">「{result.transcription}」</p>
            </div>

            {/* intent */}
            <div className={`rounded-lg border-2 px-4 py-3 ${result.task_type ? "border-blue-300 bg-blue-50" : "border-yellow-300 bg-yellow-50"}`}>
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-500">判定結果</p>
              {result.task_type ? (
                <div>
                  <p className="text-base font-bold text-gray-900">
                    {TASK_LABEL[result.task_type] ?? result.task_type}
                  </p>
                  <p className="text-sm text-gray-700">{result.reason}</p>
                </div>
              ) : (
                <p className="text-base font-semibold text-yellow-800">
                  対応タスクなし — {result.reason}
                </p>
              )}
            </div>

            {result.task_launched && (
              <div className="rounded-lg border-2 border-green-400 bg-green-50 px-4 py-3">
                <p className="text-base font-bold text-green-800">タスクを自動実行しました</p>
              </div>
            )}
          </div>
        )}

        {/* error */}
        {error && (
          <div className="w-full rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 slide-up">
            <p className="text-sm font-bold text-red-800">{error}</p>
            <button onClick={reset} className="mt-1 text-sm font-semibold text-red-700 underline">
              リセット
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
