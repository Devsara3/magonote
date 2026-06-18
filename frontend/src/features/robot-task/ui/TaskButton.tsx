"use client";
import { TaskType } from "@/entities/task/model/types";

interface Props {
  taskType: TaskType;
  label: string;
  description: string;
  disabled: boolean;
  onClick: () => void;
}

export function TaskButton({ label, description, disabled, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        w-full rounded-2xl border-2 border-blue-400 bg-blue-50 p-6 text-left
        shadow-md transition-all duration-200
        hover:bg-blue-100 hover:shadow-lg
        disabled:cursor-not-allowed disabled:opacity-40
        active:scale-95
      "
    >
      <p className="text-xl font-bold text-blue-800">{label}</p>
      <p className="mt-1 text-sm text-blue-600">{description}</p>
    </button>
  );
}
