"use client";
import { Room, RoomStatus } from "@/entities/room/model/types";

const STATUS: Record<RoomStatus, { dot: string; label: string; labelColor: string }> = {
  active:       { dot: "bg-green-500",  label: "動作中", labelColor: "text-green-700"  },
  idle:         { dot: "bg-gray-400",   label: "待機中", labelColor: "text-gray-500"   },
  error:        { dot: "bg-red-500",    label: "エラー", labelColor: "text-red-700"    },
  disconnected: { dot: "bg-gray-300",   label: "未接続", labelColor: "text-gray-400"   },
};

interface Props {
  rooms: Room[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function RoomList({ rooms, selectedId, onSelect }: Props) {
  return (
    <div className="space-y-1.5">
      {rooms.map((room) => {
        const s = STATUS[room.status];
        const isSelected = room.id === selectedId;
        const lastAt = new Date(room.lastActivityAt).toLocaleTimeString("ja-JP", {
          hour: "2-digit", minute: "2-digit",
        });

        return (
          <button
            key={room.id}
            onClick={() => onSelect(room.id)}
            className={[
              "w-full rounded-lg border px-4 py-3.5 text-left transition-colors",
              isSelected
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
            ].join(" ")}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">{room.name}</span>
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${s.dot} ${room.status === "active" ? "pulse-dot" : ""}`} />
                <span className={`text-xs font-semibold ${isSelected ? "text-gray-300" : s.labelColor}`}>
                  {s.label}
                </span>
              </div>
            </div>
            <p className={`mt-0.5 text-xs ${isSelected ? "text-gray-400" : "text-gray-500"}`}>
              {room.patientName} · {lastAt}
            </p>
          </button>
        );
      })}
    </div>
  );
}
