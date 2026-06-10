import { Heart, MapPin, CalendarDays, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import type { WtdEvent } from '../data/events';
import { CAT_MAP } from '../data/categories';
import { formatDateRange, formatPrice } from '../lib/format';
import { useFavorites } from '../lib/store';
import Countdown from './Countdown';

// Alternating phase so premium cards pulse out of sync (dynamic neon)
function neonDelay(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 1)) % 28;
  return `${-(h / 10).toFixed(2)}s`;
}

function PriceIcon() {
  return <span className="grid h-4 w-4 place-items-center font-extrabold text-violet-500">$</span>;
}

function Meta({ ev }: { ev: WtdEvent }) {
  return (
    <div className="space-y-2 text-[13.5px] text-violet-700/90">
      <div className="flex items-center gap-2">
        <CalendarDays size={15} className="shrink-0 text-violet-400" />
        <span className="font-semibold">
          {formatDateRange(ev.dateStart, ev.dateEnd)}
          {ev.time && !ev.dateEnd ? ` • ${ev.time}` : ''}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <MapPin size={15} className="shrink-0 text-violet-400" />
          <span className="font-semibold">{ev.city}</span>
        </span>
        <span className="flex items-center gap-1 font-semibold">
          <PriceIcon />
          {formatPrice(ev.priceFrom, ev.priceType)}
        </span>
      </div>
    </div>
  );
}

export function PremiumCard({ ev, onOpen }: { ev: WtdEvent; onOpen: (e: WtdEvent) => void }) {
  const cat = CAT_MAP[ev.category];
  const { isFav, toggleFav } = useFavorites();
  const fav = isFav(ev.id);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(ev)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(ev)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`card-glow group block w-full cursor-pointer rounded-[26px] bg-white p-2.5 text-left shadow-card ${ev.premium ? 'is-premium' : ''}`}
      style={{ ['--glow' as string]: cat.gradient, ['--neon-delay' as string]: neonDelay(ev.id) }}
    >
      {/* image */}
      <div className="relative overflow-hidden rounded-[20px]">
        <img
          src={ev.image}
          alt={ev.title}
          loading="lazy"
          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className="absolute left-0 top-3 rounded-r-full py-1.5 pl-3 pr-4 text-[12.5px] font-extrabold text-white shadow"
          style={{ background: cat.gradient }}
        >
          {cat.label}
        </span>
        <FavBtn fav={fav} onClick={() => toggleFav(ev.id)} />
        {ev.premium && (
          <Crown
            size={20}
            className="absolute right-3 top-12 text-amber-400 drop-shadow"
            fill="#fbbf24"
          />
        )}
      </div>

      <div className="px-1.5 pb-1.5 pt-3.5">
        <h3 className="mb-3 line-clamp-1 text-[19px] font-extrabold text-ink">{ev.title}</h3>
        <Meta ev={ev} />
        <div className="mt-3.5">
          <Countdown target={ev.dateStart} gradient={cat.gradient} />
        </div>
      </div>
    </motion.div>
  );
}

export function ListCard({ ev, onOpen }: { ev: WtdEvent; onOpen: (e: WtdEvent) => void }) {
  const cat = CAT_MAP[ev.category];
  const { isFav, toggleFav } = useFavorites();
  const fav = isFav(ev.id);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(ev)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(ev)}
      whileHover={{ y: -3 }}
      className={`card-glow group flex w-full cursor-pointer gap-3 rounded-[24px] bg-white p-2.5 text-left shadow-card ${ev.premium ? 'is-premium' : ''}`}
      style={{ ['--glow' as string]: cat.gradient, ['--neon-delay' as string]: neonDelay(ev.id) }}
    >
      <div className="relative w-32 shrink-0 overflow-hidden rounded-[18px] sm:w-44">
        <img
          src={ev.image}
          alt={ev.title}
          loading="lazy"
          className="h-full min-h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className="absolute left-0 top-2 rounded-r-full py-1 pl-2 pr-3 text-[11px] font-extrabold text-white shadow"
          style={{ background: cat.gradient }}
        >
          {cat.short}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between py-1 pr-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[18px] font-extrabold leading-tight text-ink">{ev.title}</h3>
          {ev.premium ? (
            <Crown size={18} className="shrink-0 text-amber-400" fill="#fbbf24" />
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFav(ev.id);
              }}
              className="shrink-0"
            >
              <Heart
                size={18}
                className={fav ? 'text-rose-500' : 'text-violet-300'}
                fill={fav ? '#f43f5e' : 'none'}
              />
            </button>
          )}
        </div>
        <div className="mt-2">
          <Meta ev={ev} />
        </div>
        <div className="mt-3 max-w-[280px]">
          <Countdown target={ev.dateStart} gradient={cat.gradient} size="sm" />
        </div>
      </div>
    </motion.div>
  );
}

function FavBtn({ fav, onClick }: { fav: boolean; onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label="Ajouter aux favoris"
      className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/85 backdrop-blur transition-transform hover:scale-110 active:scale-90"
    >
      <Heart
        size={18}
        className={fav ? 'text-rose-500' : 'text-violet-400'}
        fill={fav ? '#f43f5e' : 'none'}
      />
    </button>
  );
}
