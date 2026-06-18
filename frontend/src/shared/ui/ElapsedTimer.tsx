export function ElapsedTimer({ ms }: { ms: number }) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60).toString().padStart(2, "0");
  const sec = (totalSec % 60).toString().padStart(2, "0");
  return (
    <span className="font-mono text-lg font-bold tabular-nums text-gray-900">
      {min}:{sec}
    </span>
  );
}
