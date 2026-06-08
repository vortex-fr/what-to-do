import { useCountdown, pad } from '../hooks/useCountdown';

export default function Countdown({
  target,
  gradient,
  size = 'md',
}: {
  target: string;
  gradient: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { days, hours, minutes, seconds, done } = useCountdown(target);

  const text =
    size === 'lg' ? 'text-base' : size === 'sm' ? 'text-[11px]' : 'text-[13px]';
  const py = size === 'lg' ? 'py-2.5' : 'py-1.5';

  if (done) {
    return (
      <div
        className={`flex items-center justify-center rounded-full ${py} px-4 font-extrabold tracking-wider text-white shadow-sm ${text}`}
        style={{ background: gradient }}
      >
        ● EN COURS
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
