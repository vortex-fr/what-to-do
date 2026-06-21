import { useCountdown, pad } from '../hooks/useCountdown';

export default function Countdown({
  target,
  end,
  gradient,
  size = 'md',
}: {
  target: string;
  end?: string;
  gradient: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { days, hours, minutes, seconds, phase } = useCountdown(target, end);

  const text =
    size === 'lg' ? 'text-base' : size === 'sm' ? 'text-[11px]' : 'text-[13px]';
  const py = size === 'lg' ? 'py-2.5' : 'py-1.5';

  if (phase === 'ended') {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-violet-200 px-4 font-extrabold tracking-wider text-violet-500 shadow-sm ${py} ${text}`}
      >
        ÉVÈNEMENT TERMINÉ
      </div>
    );
  }

  // pendant l'évènement : compteur « à l'envers » (temps écoulé) + pastille live
  if (phase === 'live') {
    return (
      <div
        className={`relative flex items-center justify-center gap-1.5 overflow-hidden rounded-full ${py} px-4 font-extrabold tabular-nums tracking-wide text-white shadow-sm ${text}`}
        style={{ background: gradient }}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        <span className="uppercase">En cours</span>
        <span className="opacity-90">·</span>
        {days > 0 && <span className="opacity-95">{pad(days)}J</span>}
        <span className="opacity-95">{pad(hours)}H</span>
        <span className="opacity-95">{pad(minutes)}M</span>
        <span className="opacity-95">{pad(seconds)}S</span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center gap-1 overflow-hidden rounded-full ${py} px-4 font-extrabold tabular-nums tracking-wide text-white shadow-sm ${text}`}
      style={{ background: gradient }}
    >
      <span>{pad(days)}J</span>
      <span className="opacity-90">{pad(hours)}H</span>
      <span className="opacity-90">{pad(minutes)}M</span>
      <span className="opacity-90">{pad(seconds)}S</span>
    </div>
  );
}
