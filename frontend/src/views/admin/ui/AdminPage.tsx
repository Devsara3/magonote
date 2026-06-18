"use client";
import { useState } from "react";
import Link from "next/link";
import { RoomList } from "@/widgets/room-list/ui/RoomList";
import { ActivityLog } from "@/widgets/activity-log/ui/ActivityLog";
import { MOCK_ROOMS, MOCK_ACTIVITIES } from "@/entities/room/model/mockData";

function SummaryCard({ label, value, sub, color }: { label: string; value: number; sub: string; color: string }) {
  return (
    <div className="rounded-xl border-2 border-gray-200 bg-white px-5 py-4">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</p>
      <p className={`mt-1 text-3xl font-extrabold ${color}`}>{value}</p>
      <p className="text-xs font-semibold text-gray-500">{sub}</p>
    </div>
  );
}

export function AdminPage() {
  const [selectedRoomId, setSelectedRoomId] = useState(MOCK_ROOMS[0].id);

  const selectedRoom = MOCK_ROOMS.find((r) => r.id === selectedRoomId)!;
  const activities   = MOCK_ACTIVITIES
    .filter((a) => a.roomId === selectedRoomId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const activeCount       = MOCK_ROOMS.filter((r) => r.status === "active").length;
  const errorCount        = MOCK_ROOMS.filter((r) => r.status === "error" || r.status === "disconnected").length;
  const todayTaskCount    = MOCK_ACTIVITIES.filter((a) => a.kind === "task" && a.result === "completed").length;
  const todayVoiceCount   = MOCK_ACTIVITIES.filter((a) => a.voiceText).length;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8">

        {/* ── ヘッダー ── */}
        <header className="mb-6 border-b-2 border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">まごのて — スタッフ管理画面</h1>
              <p className="text-sm font-semibold text-gray-600">各病室のロボット稼働状況と活動ログ</p>
            </div>
            <Link
              href="/"
              className="rounded-xl border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:border-gray-400 hover:bg-gray-50 active:brightness-95"
            >
              ← 患者操作画面
            </Link>
          </div>
        </header>

        {/* ── サマリーカード ── */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard label="動作中"       value={activeCount}     sub="台のロボット"   color="text-green-600" />
          <SummaryCard label="要確認"       value={errorCount}      sub="エラー / 未接続" color="text-red-600"   />
          <SummaryCard label="本日 タスク"  value={todayTaskCount}  sub="回 完了"        color="text-blue-600"  />
          <SummaryCard label="本日 音声"    value={todayVoiceCount} sub="回 入力"        color="text-purple-600"/>
        </div>

        {/* ── メイン 2カラム ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">

          {/* 左: 病室リスト */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
              病室一覧 ({MOCK_ROOMS.length}室)
            </p>
            <RoomList
              rooms={MOCK_ROOMS}
              selectedId={selectedRoomId}
              onSelect={setSelectedRoomId}
            />
          </div>

          {/* 右: 活動ログ */}
          <div>
            {/* 選択病室のサブヘッダー */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-gray-200 bg-white px-5 py-4">
              <div>
                <p className="text-lg font-extrabold text-gray-900">{selectedRoom.name}</p>
                <p className="text-sm font-semibold text-gray-600">
                  患者: {selectedRoom.patientName} &nbsp;·&nbsp; ロボット ID: {selectedRoom.robotId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-500">最終動作</p>
                <p className="font-mono text-sm font-bold text-gray-900">
                  {new Date(selectedRoom.lastActivityAt).toLocaleTimeString("ja-JP", {
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <ActivityLog activities={activities} roomName={selectedRoom.name} />
          </div>
        </div>

        {/* ── フッター ── */}
        <footer className="mt-10 border-t-2 border-gray-100 pt-4 text-xs font-semibold text-gray-400">
          ※ 表示データはデモ用のモックデータです。実環境ではバックエンドAPIと連携します。
        </footer>

      </div>
    </div>
  );
}
