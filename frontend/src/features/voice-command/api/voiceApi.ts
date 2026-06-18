import { apiFetch } from "@/shared/api/apiClient";
import { VoiceResult } from "@/entities/voice/model/types";

export const sendVoiceCommand = () =>
  apiFetch<VoiceResult>("/api/voice-command", { method: "POST" });
