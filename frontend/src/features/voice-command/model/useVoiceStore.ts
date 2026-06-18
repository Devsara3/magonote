"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { VoicePhase, VoiceResult } from "@/entities/voice/model/types";
import { sendVoiceCommand } from "../api/voiceApi";

const RECORD_SECONDS = 5;

export function useVoiceStore(onTaskLaunched?: () => void) {
  const [phase, setPhase] = useState<VoicePhase>("idle");
  const [result, setResult] = useState<VoiceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(RECORD_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback(() => {
    setCountdown(RECORD_SECONDS);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          setPhase("transcribing");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setResult(null);
    setPhase("recording");
    startCountdown();

    try {
      const res = await sendVoiceCommand(); // ~8-12s total
      setResult(res);
      setPhase("done");
      if (res.task_launched) onTaskLaunched?.();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setPhase("error");
    }
  }, [startCountdown, onTaskLaunched]);

  const reset = useCallback(() => {
    setPhase("idle");
    setResult(null);
    setError(null);
    setCountdown(RECORD_SECONDS);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  return { phase, result, error, countdown, start, reset };
}
