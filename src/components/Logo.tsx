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
      style={{
        height: size,
        filter:
          'drop-shadow(0 1px 0 rgba(93,79,140,.45)) drop-shadow(0 -1px 0 rgba(93,79,140,.25)) drop-shadow(0 3px 7px rgba(70,55,110,.35))',
      }}
      className={`w-auto select-none ${className}`}
    />
  );
}
