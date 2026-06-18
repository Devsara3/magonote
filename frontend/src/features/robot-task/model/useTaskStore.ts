"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { TaskState, TaskType } from "@/entities/task/model/types";
import { runTask, stopTask, fetchTaskStatus } from "../api/taskApi";

const INITIAL: TaskState = {
  status: "idle",
  task_type: null,
  pid: null,
  started_at: null,
  finished_at: null,
  error_message: null,
};

export type ConnectionStatus = "connected" | "disconnected" | "checking";

export function useTaskStore() {
  const [task, setTask] = useState<TaskState>(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [connection, setConnection] = useState<ConnectionStatus>("checking");
  const [elapsedMs, setElapsedMs] = useState(0);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const startElapsedTimer = useCallback((startedAt: string | null) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const base = startedAt ? new Date(startedAt).getTime() : Date.now();
    startTimeRef.current = base;
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - base);
    }, 100);
  }, []);

  const stopElapsedTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const applyTaskState = useCallback(
    (state: TaskState) => {
      setTask(state);
      if (state.status === "running") {
        startElapsedTimer(state.started_at);
      } else {
        stopElapsedTimer();
        if (state.started_at && state.finished_at) {
          setElapsedMs(
            new Date(state.finished_at).getTime() -
              new Date(state.started_at).getTime()
          );
        }
      }
    },
    [startElapsedTimer, stopElapsedTimer]
  );

  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(async () => {
      try {
        const state = await fetchTaskStatus();
        setConnection("connected");
        applyTaskState(state);
        if (state.status !== "running") {
          clearInterval(pollingRef.current!);
          pollingRef.current = null;
        }
      } catch {
        setConnection("disconnected");
      }
    }, 2000);
  }, [applyTaskState]);

  const execute = useCallback(
    async (taskType: TaskType) => {
      setError(null);
      setLoading(true);
      setElapsedMs(0);
      try {
        const state = await runTask(taskType);
        applyTaskState(state);
        startPolling();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [applyTaskState, startPolling]
  );

  const stop = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const state = await stopTask();
      applyTaskState(state);
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [applyTaskState]);

  // Initial fetch
  useEffect(() => {
    fetchTaskStatus()
      .then((state) => {
        setConnection("connected");
        applyTaskState(state);
        if (state.status === "running") startPolling();
      })
      .catch(() => setConnection("disconnected"));
  }, [applyTaskState, startPolling]);

  // Periodic connection health check (every 10s when idle)
  useEffect(() => {
    const id = setInterval(async () => {
      if (pollingRef.current) return; // polling already covers it
      try {
        await fetchTaskStatus();
        setConnection("connected");
      } catch {
        setConnection("disconnected");
      }
    }, 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return { task, error, loading, connection, elapsedMs, execute, stop, startPolling };
}
