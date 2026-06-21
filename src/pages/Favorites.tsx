import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { EVENTS, type WtdEvent } from '../data/events';
import { useFavorites } from '../lib/store';
import { PremiumCard } from '../components/EventCard';
import EventModal from '../components/EventModal';
import Mascot from '../components/Mascot';

export default function Favorites() {
  const { favorites } = useFavorites();
  const [modal, setModal] = useState<WtdEvent | null>(null);
  const favEvents = EVENTS.filter((e) => favorites.includes(e.id));

  return (
    <motion.div initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="flex items-center gap-3 text-3xl font-extrabold text-ink sm:text-4xl">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#ff9d6c] to-[#ff5e8a] text-white">
          <Heart fill="#fff" size={24} />
        </span>
        Mes favoris
      </h1>
      <p className="mt-2 text-violet-700/70">
        {favEvents.length > 0
          ? `${favEvents.length} évènement${favEvents.length > 1 ? 's' : ''} qui te font de l'œil.`
          : 'Ta liste est vide pour le moment.'}
      </p>

      {favEvents.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-3xl bg-white p-14 text-center shadow-card">
          <Mascot pose="idea-confetti" size={120} className="mx-auto" />
          <p className="mt-4 text-xl font-bold text-violet-600">Aucun favori… pour l'instant !</p>
          <p className="text-violet-400">Clique sur le ♥ des évènements qui te plaisent.</p>
          <Link to="/evenements" className="mt-5 rounded-full bg-gradient-to-r from-violet-500 to-teal-400 px-7 py-3 font-extrabold uppercase tracking-wide text-white shadow-card">
            Explorer les évènements
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favEvents.map((ev) => (
            <PremiumCard key={ev.id} ev={ev} onOpen={setModal} />
          ))}
        </div>
      )}

      <EventModal ev={modal} onClose={() => setModal(null)} />
    </motion.div>
  );
}
