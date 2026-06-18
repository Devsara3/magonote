interface Props {
  ms: number;
}

export function ElapsedTimer({ ms }: Props) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60)
    .toString()
    .padStart(2, "0");
  const sec = (totalSec % 60).toString().padStart(2, "0");
  const centis = Math.floor((ms % 1000) / 10)
    .toString()
    .padStart(2, "0");

  return (
    <span className="font-mono text-emerald-400 tabular-nums">
      {min}:{sec}
      <span className="text-emerald-600">.{centis}</span>
    </span>
  );
}
