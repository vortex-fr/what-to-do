import { Mic, Beer, Bike, Store, Lightbulb, type LucideIcon } from 'lucide-react';
import type { Category } from '../data/categories';

const ICONS: Record<string, LucideIcon> = { Mic, Beer, Bike, Store, Lightbulb };

export default function CategoryIcon({
  cat,
  size = 64,
  active = true,
  className = '',
}: {
  cat: Category;
  size?: number;
  active?: boolean;
  className?: string;
}) {
  const Ic = ICONS[cat.icon] ?? Mic;
  return (
    <span
      className={`grid place-items-center rounded-full text-white shadow-card transition-all ${className}`}
      style={{
        width: size,
        height: size,
        background: active ? cat.gradient : 'linear-gradient(120deg,#d8cfe9,#cfe7e4)',
      }}
    >
      <Ic size={size * 0.42} strokeWidth={2} />
    </span>
  );
}
