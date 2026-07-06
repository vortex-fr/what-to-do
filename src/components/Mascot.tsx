/** Hi-5 mascot — poses by Ben (public/assets/hi5). Animated with the
 *  "salve" rhythm: 2-3 quick moves then a 3-4s pause. */

export type Hi5Pose =
  | 'party' | 'yoga' | 'money' | 'garden' | 'climb' | 'stop' | 'conf'
  | 'silence' | 'app' | 'alpi' | 'movie' | 'streetfood' | 'couture'
  | 'confiance' | 'graduation' | 'drum' | 'cook' | 'foot' | 'wine'
  | 'idea' | 'idea-confetti' | 'empty' | 'chill' | 'shaka';

/** Pose recommandée par catégorie (pour les vues filtrées). */
export const POSE_BY_CATEGORY: Record<string, Hi5Pose> = {
  culture: 'drum',
  gastronomie: 'wine',
  sport: 'foot',
  famille: 'garden',
  business: 'confiance',
};

export default function Mascot({
  pose = 'app',
  size = 96,
  animated = true,
  delay,
  className = '',
  alt = 'Hi-5',
}: {
  pose?: Hi5Pose;
  size?: number;
  animated?: boolean;
  delay?: 1 | 2;
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={`/assets/hi5/${pose}.png`}
      alt={alt}
      draggable={false}
      style={{ width: size, height: size }}
      className={`select-none object-contain ${animated ? 'hi5-anim' : ''} ${
        delay ? `delay-${delay}` : ''
      } ${className}`}
    />
  );
}
