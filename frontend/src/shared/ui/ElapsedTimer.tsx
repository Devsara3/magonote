export function ElapsedTimer({ ms }: { ms: number }) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60).toString().padStart(2, "0");
  const sec = (totalSec % 60).toString().padStart(2, "0");
  const cs  = Math.floor((ms % 1000) / 10).toString().padStart(2, "0");
  return (
    <span className="font-mono tabular-nums text-slate-700">
      {min}:{sec}<span className="text-slate-400">.{cs}</span>
    </span>
  );
}
