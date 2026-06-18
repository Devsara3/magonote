export type ActivityKind = "task" | "voice" | "error" | "manual";
export type ActivityResult = "completed" | "stopped" | "error";

export interface Activity {
  id: string;
  roomId: string;
  timestamp: string; // ISO datetime
  kind: ActivityKind;
  taskName?: string;       // "spon_mix_1and2" | "cup_1"
  taskLabel?: string;      // "スポンジタスク" | "カップタスク"
  voiceText?: string;      // Whisper 認識テキスト
  durationSec?: number;    // 実行秒数
  result: ActivityResult;
  note?: string;
}
