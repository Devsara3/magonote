import { TaskType } from "@/entities/task/model/types";

export type VoicePhase =
  | "idle"
  | "recording"   // arecord 録音中 (5s)
  | "transcribing" // Whisper + GPT-4o 処理中
  | "done"
  | "error";

export interface VoiceResult {
  transcription: string;
  task_type: TaskType | null;
  reason: string;
  task_launched: boolean;
}
