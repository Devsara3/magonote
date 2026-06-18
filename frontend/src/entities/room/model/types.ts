export type RoomStatus = "active" | "idle" | "error" | "disconnected";

export interface Room {
  id: string;
  name: string;
  patientName: string;
  status: RoomStatus;
  lastActivityAt: string; // ISO datetime
  robotId: string;
}
