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

export function useTaskStore() {
  const [task, setTask] = useState<TaskState>(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(async () => {
      try {
        const state = await fetchTaskStatus();
        setTask(state);
        if (state.status !== "running") {
          clearInterval(pollingRef.current!);
          pollingRef.current = null;
        }
      } catch {
        // silently ignore polling errors
      }
    }, 2000);
  }, []);

  const execute = useCallback(
    async (taskType: TaskType) => {
      setError(null);
      setLoading(true);
      try {
        const state = await runTask(taskType);
        setTask(state);
        startPolling();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [startPolling]
  );

  const stop = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const state = await stopTask();
      setTask(state);
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial status on mount
  useEffect(() => {
    fetchTaskStatus().then(setTask).catch(() => {});
  }, []);

  return { task, error, loading, execute, stop };
}
