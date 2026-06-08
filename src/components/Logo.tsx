import { MapPin } from 'lucide-react';

/**
 * Faithful recreation of the What-to-do.ch bubble-script wordmark:
 * white fill + purple 3D outline, two lines, with a map-pin as the "dot".
 */
export default function Logo({
  size = 32,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`logo-wordmark ${className}`}
      style={{ fontSize: size }}
      aria-label="What-to-do.ch"
    >
      <span className="l1 ink">What-to</span>
      <span className="l2">
        <span className="ink">-do</span>
        <MapPin
          className="logo-pin inline-block align-middle"
          size={size * 0.42}
          fill="#8b5fbf"
          strokeWidth={2.5}
          style={{ margin: '0 -0.02em' }}
        />
        <span className="ink">ch</span>
      </span>
    </span>
  );
}
