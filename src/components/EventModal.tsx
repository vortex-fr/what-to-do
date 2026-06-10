import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, CalendarDays, Crown, Heart } from 'lucide-react';
import type { WtdEvent } from '../data/events';
import { CAT_MAP } from '../data/categories';
import { formatLongDate, formatPrice } from '../lib/format';
import { useFavorites } from '../lib/store';
import Countdown from './Countdown';

export default function EventModal({
  ev,
  onClose,
}: {
  ev: WtdEvent | null;
  onClose: () => void;
}) {
  const { isFav, toggleFav } = useFavorites();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    if (ev) document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [ev, onClose]);

  return createPortal(
    <AnimatePresence>
      {ev && (
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[1200] grid place-items-center overflow-y-auto bg-violet-900/40 p-4 backdrop-blur-sm"
        >
          <ModalInner ev={ev} onClose={onClose} fav={isFav(ev.id)} toggleFav={() => toggleFav(ev.id)} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function ModalInner({
  ev,
  onClose,
  fav,
  toggleFav,
}: {
  ev: WtdEvent;
  onClose: () => void;
  fav: boolean;
  toggleFav: () => void;
}) {
  const cat = CAT_MAP[ev.category];
  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      initial={{ scale: 0.94, y: 16 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.94, opacity: 0, y: 16 }}
      transition={{ type: 'spring', damping: 24, stiffness: 280 }}
      className="card-glow relative my-auto w-full max-w-md rounded-[30px] bg-white p-3 shadow-float"
      style={{ ['--glow' as string]: cat.gradient }}
    >
      <button
        onClick={onClose}
        className="absolute -right-2 -top-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-teal-400 text-white shadow-lg transition-transform hover:rotate-90"
      >
        <X size={22} />
      </button>

      {/* image */}
      <div className="relative overflow-hidden rounded-[22px]">
        <img src={ev.image} alt={ev.title} className="h-52 w-full object-cover" />
        <span
          className="absolute left-0 top-3 rounded-r-full py-1.5 pl-3 pr-4 text-sm font-extrabold text-white shadow"
          style={{ background: cat.gradient }}
        >
          {cat.label}
        </span>
        {ev.premium && (
          <Crown size={24} className="absolute right-3 top-3 text-amber-400 drop-shadow" fill="#fbbf24" />
        )}
        <button
          onClick={toggleFav}
          className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur"
        >
          <Heart size={18} className={fav ? 'text-rose-500' : 'text-violet-400'} fill={fav ? '#f43f5e' : 'none'} />
        </button>
      </div>

      {/* countdown straddling */}
      <div className="relative z-[1] mx-auto -mt-5 w-fit min-w-[60%]">
        <Countdown target={ev.dateStart} gradient={cat.gradient} size="lg" />
      </div>

      <div className="px-3 pb-3 pt-4">
        <h2 className="text-2xl font-extrabold text-ink">{ev.title}</h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-violet-900/70">{ev.description}</p>

        <Link
          to={`/evenement/${ev.slug}`}
          onClick={onClose}
          className="mt-5 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-violet-600 px-6 py-3.5 font-extrabold uppercase tracking-wide text-white shadow-card transition-transform hover:scale-[1.02] active:scale-95"
        >
          Savoir plus de l'évènement
        </Link>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-y-3 border-t border-violet-100 pt-4 text-[13.5px] font-semibold text-violet-800">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={15} className="text-violet-400" />
            {formatLongDate(ev.dateStart)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={15} className="text-violet-400" />
            {ev.city}
          </span>
          <span className="flex items-center gap-1">
            <span className="font-extrabold text-violet-500">$</span>
            {formatPrice(ev.priceFrom, ev.priceType)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
