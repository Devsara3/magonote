"use client";
import { useState } from "react";
import Link from "next/link";
import { RoomList } from "@/widgets/room-list/ui/RoomList";
import { ActivityLog } from "@/widgets/activity-log/ui/ActivityLog";
import { MOCK_ROOMS, MOCK_ACTIVITIES } from "@/entities/room/model/mockData";

export function AdminPage() {
  const [selectedRoomId, setSelectedRoomId] = useState(MOCK_ROOMS[0].id);

  const selectedRoom = MOCK_ROOMS.find((r) => r.id === selectedRoomId)!;
  const activities = MOCK_ACTIVITIES
    .filter((a) => a.roomId === selectedRoomId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const activeCount     = MOCK_ROOMS.filter((r) => r.status === "active").length;
  const errorCount      = MOCK_ROOMS.filter((r) => r.status === "error" || r.status === "disconnected").length;
  const todayTaskCount  = MOCK_ACTIVITIES.filter((a) => a.kind === "task" && a.result === "completed").length;
  const todayVoiceCount = MOCK_ACTIVITIES.filter((a) => a.voiceText).length;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* ── ヘッダー ── */}
        <header className="mb-6 border-b-2 border-gray-200 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">スタッフ管理画面</h1>
              <p className="text-sm text-gray-500">まごのて — ロボット稼働状況と活動ログ</p>
            </div>
            <Link
              href="/"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              ← 患者操作画面
            </Link>
          </div>
        </header>

        {/* ── サマリー ── */}
        <div className="mb-6 flex flex-wrap gap-8 border-b border-gray-100 pb-6">
          {[
            { label: "動作中",     value: activeCount,     unit: "台",  highlight: false },
            { label: "要確認",     value: errorCount,      unit: "台",  highlight: errorCount > 0 },
            { label: "本日タスク", value: todayTaskCount,  unit: "回",  highlight: false },
            { label: "本日音声",   value: todayVoiceCount, unit: "回",  highlight: false },
          ].map(({ label, value, unit, highlight }) => (
            <div key={label}>
              <p className="text-xs font-semibold text-gray-400">{label}</p>
              <p className={`mt-0.5 text-2xl font-extrabold ${highlight ? "text-red-600" : "text-gray-900"}`}>
                {value}<span className="ml-1 text-sm font-semibold text-gray-400">{unit}</span>
              </p>
            </div>
          ))}
        </div>

        {/* ── 2カラム: 病室リスト + 活動ログ ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">

          {/* 左: 病室リスト */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
              病室一覧 · {MOCK_ROOMS.length}室
            </p>
            <RoomList
              rooms={MOCK_ROOMS}
              selectedId={selectedRoomId}
              onSelect={setSelectedRoomId}
            />
          </div>

          {/* 右: 活動ログ */}
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <p className="text-base font-extrabold text-gray-900">
                  {selectedRoom.name} · {selectedRoom.patientName}
                </p>
                <p className="text-xs text-gray-400">
                  {selectedRoom.robotId} · 最終動作{" "}
                  {new Date(selectedRoom.lastActivityAt).toLocaleTimeString("ja-JP", {
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <ActivityLog activities={activities} roomName={selectedRoom.name} />
          </div>
        </div>

        <footer className="mt-12 text-xs text-gray-300">
          ※ デモ用モックデータ表示中
        </footer>
      </div>
    </div>
  );
}
