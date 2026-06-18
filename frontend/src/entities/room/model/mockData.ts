import { Room } from "./types";
import { Activity } from "@/entities/activity/model/types";

export const MOCK_ROOMS: Room[] = [
  { id: "101", name: "101号室", patientName: "山田 花子", status: "idle",         lastActivityAt: "2026-06-18T14:45:00", robotId: "arm-101" },
  { id: "102", name: "102号室", patientName: "佐藤 次郎", status: "active",       lastActivityAt: "2026-06-18T15:02:00", robotId: "arm-102" },
  { id: "103", name: "103号室", patientName: "鈴木 三男", status: "idle",         lastActivityAt: "2026-06-18T13:15:00", robotId: "arm-103" },
  { id: "104", name: "104号室", patientName: "田中 四郎", status: "error",        lastActivityAt: "2026-06-18T12:00:00", robotId: "arm-104" },
  { id: "105", name: "105号室", patientName: "伊藤 五月", status: "disconnected", lastActivityAt: "2026-06-18T09:30:00", robotId: "arm-105" },
];

export const MOCK_ACTIVITIES: Activity[] = [
  // 102号室（現在 active）
  {
    id: "a-102-1", roomId: "102", timestamp: "2026-06-18T15:02:00",
    kind: "task", taskName: "cup_1", taskLabel: "カップタスク",
    voiceText: "喉が渇いた、水が飲みたい", durationSec: 47, result: "completed",
  },
  {
    id: "a-102-2", roomId: "102", timestamp: "2026-06-18T12:30:00",
    kind: "task", taskName: "spon_mix_1and2", taskLabel: "スポンジタスク",
    durationSec: 43, result: "completed", note: "ボタン操作",
  },
  {
    id: "a-102-3", roomId: "102", timestamp: "2026-06-18T09:15:00",
    kind: "task", taskName: "cup_1", taskLabel: "カップタスク",
    voiceText: "飲み物をください", durationSec: 50, result: "completed",
  },
  // 101号室
  {
    id: "a-101-1", roomId: "101", timestamp: "2026-06-18T14:45:00",
    kind: "task", taskName: "spon_mix_1and2", taskLabel: "スポンジタスク",
    voiceText: "お腹が空いた", durationSec: 44, result: "completed",
  },
  {
    id: "a-101-2", roomId: "101", timestamp: "2026-06-18T14:45:00",
    kind: "voice", voiceText: "お腹が空いた", result: "completed",
  },
  {
    id: "a-101-3", roomId: "101", timestamp: "2026-06-18T11:20:00",
    kind: "task", taskName: "cup_1", taskLabel: "カップタスク",
    durationSec: 48, result: "stopped", note: "看護師が緊急停止",
  },
  {
    id: "a-101-4", roomId: "101", timestamp: "2026-06-18T08:50:00",
    kind: "task", taskName: "spon_mix_1and2", taskLabel: "スポンジタスク",
    voiceText: "何か食べたい", durationSec: 46, result: "completed",
  },
  // 103号室
  {
    id: "a-103-1", roomId: "103", timestamp: "2026-06-18T13:15:00",
    kind: "task", taskName: "spon_mix_1and2", taskLabel: "スポンジタスク",
    voiceText: "スポンジ取ってください", durationSec: 45, result: "completed",
  },
  {
    id: "a-103-2", roomId: "103", timestamp: "2026-06-18T10:05:00",
    kind: "task", taskName: "cup_1", taskLabel: "カップタスク",
    durationSec: 50, result: "completed", note: "ボタン操作",
  },
  // 104号室
  {
    id: "a-104-1", roomId: "104", timestamp: "2026-06-18T12:00:00",
    kind: "error", result: "error", note: "接続タイムアウト — ロボット応答なし",
  },
  {
    id: "a-104-2", roomId: "104", timestamp: "2026-06-18T11:45:00",
    kind: "task", taskName: "cup_1", taskLabel: "カップタスク",
    durationSec: 12, result: "error", note: "実行中に通信切断",
  },
  // 105号室
  {
    id: "a-105-1", roomId: "105", timestamp: "2026-06-18T09:30:00",
    kind: "error", result: "error", note: "ロボット未接続 — /dev/ttyACM1 が見つかりません",
  },
];
