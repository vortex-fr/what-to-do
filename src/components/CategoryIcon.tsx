import type { Category, CategoryId } from '../data/categories';

/** Official category icons by Ben (extracted from the brand PDF). */
const ICON_IMG: Record<CategoryId, string> = {
  culture: '/assets/caticon_1.png',
  gastronomie: '/assets/caticon_2.png',
  sport: '/assets/caticon_3.png',
  famille: '/assets/caticon_4.png',
  business: '/assets/caticon_5.png',
};

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
  return (
    <img
      src={ICON_IMG[cat.id]}
      alt={cat.label}
      draggable={false}
      style={{ width: size, height: size }}
      className={`select-none rounded-full object-contain transition-all ${
        active ? '' : 'opacity-50 grayscale'
      } ${className}`}
    />
  );
}
