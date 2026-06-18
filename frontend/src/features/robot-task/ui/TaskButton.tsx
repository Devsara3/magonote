"use client";

interface Props {
  label: string;
  description: string;
  accentColor: string; // border + icon color class
  disabled: boolean;
  isActive: boolean;
  onClick: () => void;
}

export function TaskButton({ label, description, accentColor, disabled, isActive, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        // fat-finger: min 88px height via py-6
        "relative w-full rounded-xl border-2 bg-white px-6 py-6 text-left",
        "transition-colors duration-150",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "active:brightness-95",
        isActive
          ? `${accentColor} bg-opacity-5`
          : `border-gray-300 hover:border-gray-400`,
      ].join(" ")}
    >
      {/* left accent bar */}
      <span className={`absolute inset-y-0 left-0 w-1 rounded-l-xl ${accentColor.replace("border-", "bg-")}`} />

      <p className="text-base font-bold text-gray-900">{label}</p>
      <p className="mt-1 text-sm text-gray-600">{description}</p>

      {isActive && (
        <div className="mt-3 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
              style={{ animation: "ring-ping 1.2s cubic-bezier(0,0,0.2,1) infinite" }} />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
          <span className="text-sm font-semibold text-green-700">実行中</span>
        </div>
      )}
    </button>
  );
}
