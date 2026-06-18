"use client";
import { Room, RoomStatus } from "@/entities/room/model/types";

const STATUS_CONFIG: Record<RoomStatus, { bg: string; text: string; dot: string; label: string }> = {
  active:       { bg: "bg-green-600", text: "text-white",    dot: "bg-white",      label: "動作中"  },
  idle:         { bg: "bg-gray-100",  text: "text-gray-700", dot: "bg-gray-500",   label: "待機中"  },
  error:        { bg: "bg-red-600",   text: "text-white",    dot: "bg-white",      label: "エラー"  },
  disconnected: { bg: "bg-gray-300",  text: "text-gray-600", dot: "bg-gray-500",   label: "未接続"  },
};

interface Props {
  rooms: Room[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function RoomList({ rooms, selectedId, onSelect }: Props) {
  return (
    <div className="space-y-2">
      {rooms.map((room) => {
        const s = STATUS_CONFIG[room.status];
        const isSelected = room.id === selectedId;
        const lastAt = new Date(room.lastActivityAt).toLocaleTimeString("ja-JP", {
          hour: "2-digit", minute: "2-digit",
        });

        return (
          <button
            key={room.id}
            onClick={() => onSelect(room.id)}
            className={[
              "w-full rounded-xl border-2 px-4 py-4 text-left transition-colors",
              "active:brightness-95",
              isSelected
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-base font-extrabold text-gray-900">{room.name}</span>
              <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${s.bg} ${s.text}`}>
                <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${s.dot} ${room.status === "active" ? "pulse-dot" : ""}`} />
                {s.label}
              </span>
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-600">{room.patientName}</p>
            <p className="mt-0.5 text-xs text-gray-400">最終動作 {lastAt}</p>
          </button>
        );
      })}
    </div>
  );
}
