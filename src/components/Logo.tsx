/**
 * Official What-to-do.ch wordmark by Ben (extracted from the brand PDF).
 * Transparent PNG — works on light and dark backgrounds.
 */
export default function Logo({
  size = 44,
  className = '',
}: {
  size?: number; // rendered height in px
  className?: string;
}) {
  return (
    <img
      src="/assets/logo.png"
      alt="What-to-do.ch"
      draggable={false}
      style={{ height: size, filter: 'drop-shadow(0 2px 4px rgba(70,55,110,.28))' }}
      className={`w-auto select-none ${className}`}
    />
  );
}
