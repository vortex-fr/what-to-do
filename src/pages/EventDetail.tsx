import { useState, lazy, Suspense } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, CalendarDays, Clock, Users, Heart, Share2, Ticket, Check, ExternalLink, Sparkles,
} from 'lucide-react';
import { getEvent, EVENTS, type WtdEvent } from '../data/events';
import { CAT_MAP } from '../data/categories';
import { formatLongDate, formatPrice } from '../lib/format';
import { useFavorites } from '../lib/store';
import Countdown from '../components/Countdown';
import { PremiumCard } from '../components/EventCard';
import EventModal from '../components/EventModal';
import Mascot from '../components/Mascot';

const MapView = lazy(() => import('../components/MapView'));

export default function EventDetail() {
  const { slug } = useParams();
  const ev = getEvent(slug ?? '');
  const navigate = useNavigate();
  const { isFav, toggleFav } = useFavorites();
  const [booked, setBooked] = useState(false);
  const [modal, setModal] = useState<WtdEvent | null>(null);
  const [copied, setCopied] = useState(false);

  if (!ev) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <Mascot pose="empty" size={120} className="mx-auto" />
        <h1 className="mt-4 text-2xl font-extrabold">Évènement introuvable</h1>
        <Link to="/evenements" className="mt-4 inline-block rounded-full bg-violet-500 px-6 py-3 font-bold text-white">
          Voir tous les évènements
        </Link>
      </div>
    );
  }

  const cat = CAT_MAP[ev.category];
  const fav = isFav(ev.id);
  const similar = EVENTS.filter((e) => e.category === ev.category && e.id !== ev.id).slice(0, 4);
  const pct = Math.round((ev.going / ev.capacity) * 100);

  const share = async () => {
    setCopied(true);
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch { /* noop */ }
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative h-[360px] overflow-hidden sm:h-[440px]">
        <img src={ev.image} alt={ev.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-violet-950/85 via-violet-900/30 to-violet-900/20" />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-bold text-violet-600 backdrop-blur transition-transform hover:scale-105 sm:left-6"
        >
          <ArrowLeft size={18} /> Retour
        </button>
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-6xl px-4 pb-6 sm:px-6">
          <span
            className="inline-block rounded-full px-3 py-1.5 text-sm font-extrabold text-white shadow"
            style={{ background: cat.gradient }}
          >
            {cat.label} · {ev.sub}
          </span>
          <h1 className="mt-3 flex flex-wrap items-center gap-3 text-3xl font-extrabold text-white drop-shadow sm:text-5xl">
            {ev.title}
            {ev.premium && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white backdrop-blur">
                <Sparkles size={14} className="text-amber-300" fill="#fcd34d" /> Premium
              </span>
            )}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 font-semibold text-white/90">
            <span className="flex items-center gap-1.5"><MapPin size={16} /> {ev.venue}, {ev.city}</span>
            <span className="flex items-center gap-1.5"><CalendarDays size={16} /> {formatLongDate(ev.dateStart)}</span>
            {ev.time && <span className="flex items-center gap-1.5"><Clock size={16} /> {ev.time}</span>}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left */}
          <div>
            <div className="mb-6 w-fit">
              <Countdown target={ev.dateStart} end={ev.dateEnd} gradient={cat.gradient} size="lg" />
            </div>

            <h2 className="text-2xl font-extrabold text-ink">À propos de l'évènement</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-violet-900/75">{ev.description}</p>
            <p className="mt-3 text-[16px] leading-relaxed text-violet-900/75">
              Organisé par <span className="font-bold text-violet-600">{ev.organizer}</span>. Places
              limitées, réservation conseillée. Retrouve toutes les infos pratiques et l'accès ci-dessous.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {ev.tags.map((t) => (
                <span key={t} className="rounded-full bg-violet-100 px-3.5 py-1.5 text-sm font-semibold text-violet-600">
                  #{t}
                </span>
              ))}
            </div>

            {/* Info tiles */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { i: CalendarDays, l: 'Date', v: formatLongDate(ev.dateStart) },
                { i: Clock, l: 'Heure', v: ev.time ?? '—' },
                { i: MapPin, l: 'Lieu', v: ev.city },
                { i: Ticket, l: 'Prix', v: formatPrice(ev.priceFrom, ev.priceType) },
              ].map((t) => (
                <div key={t.l} className="rounded-2xl bg-white p-4 shadow-card">
                  <t.i className="text-teal-400" size={20} />
                  <div className="mt-2 text-xs font-bold uppercase text-violet-300">{t.l}</div>
                  <div className="text-sm font-bold text-ink">{t.v}</div>
                </div>
              ))}
            </div>

            {/* Map */}
            <h2 className="mb-3 mt-10 text-2xl font-extrabold text-ink">Où ça se passe</h2>
            <div className="h-72 overflow-hidden rounded-3xl shadow-card">
              <Suspense fallback={<div className="grid h-full place-items-center bg-violet-50 text-violet-400">Carte…</div>}>
                <MapView events={[ev]} activeId={ev.id} onSelect={() => {}} />
              </Suspense>
            </div>
          </div>

          {/* Sticky booking */}
          <aside>
            <div className="card-glow rounded-3xl bg-white p-6 shadow-card lg:sticky lg:top-24" style={{ ['--glow' as string]: cat.gradient }}>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs font-bold uppercase text-violet-300">
                    {ev.priceFrom === null || ev.priceType === 'free'
                      ? 'Entrée'
                      : ev.priceType === 'fixed'
                        ? 'Prix'
                        : 'À partir de'}
                  </div>
                  <div className="text-3xl font-extrabold text-ink">
                    {ev.priceFrom === null || ev.priceType === 'free' ? 'Gratuit' : `${ev.priceFrom}.-`}
                    {ev.priceFrom !== null && ev.priceType !== 'free' && (
                      <span className="text-base font-bold text-violet-400"> CHF</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleFav(ev.id)} className="grid h-11 w-11 place-items-center rounded-full bg-violet-100 transition-transform hover:scale-105">
                    <Heart size={20} className={fav ? 'text-rose-500' : 'text-violet-400'} fill={fav ? '#f43f5e' : 'none'} />
                  </button>
                  <button onClick={share} className="grid h-11 w-11 place-items-center rounded-full bg-violet-100 text-violet-500 transition-transform hover:scale-105">
                    {copied ? <Check size={20} className="text-teal-500" /> : <Share2 size={20} />}
                  </button>
                </div>
              </div>

              {/* attendance */}
              <div className="mt-5">
                <div className="mb-1.5 flex items-center justify-between text-sm font-semibold text-violet-600">
                  <span className="flex items-center gap-1.5"><Users size={15} /> {ev.going} participants</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-violet-100">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cat.gradient }} />
                </div>
                <p className="mt-1.5 text-xs text-violet-400">{ev.capacity - ev.going} places restantes</p>
              </div>

              {/* Mascotte "achat abouti" une fois réservé (corr. Ben) */}
              {booked && (
                <div className="mt-4 flex animate-pop items-center gap-3 rounded-2xl bg-teal-50 p-3">
                  <Mascot pose="money" size={60} animated={false} className="shrink-0" />
                  <div>
                    <p className="font-extrabold text-teal-700">C'est validé ! 🎉</p>
                    <p className="text-xs text-teal-600">On se voit sur place — hâte de t'y voir !</p>
                  </div>
                </div>
              )}

              {ev.ticketUrl ? (
                <>
                  <a
                    href={ev.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 py-4 font-extrabold uppercase tracking-wide text-white shadow-card transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    <Ticket size={20} /> Billetterie officielle <ExternalLink size={16} />
                  </a>
                  <button
                    onClick={() => setBooked((b) => !b)}
                    className={`mt-2.5 flex w-full items-center justify-center gap-2 rounded-full border-2 py-3 font-bold transition-colors ${
                      booked
                        ? 'border-teal-400 bg-teal-50 text-teal-600'
                        : 'border-violet-200 text-violet-600 hover:bg-violet-50'
                    }`}
                  >
                    {booked ? <><Check size={18} /> Tu y es !</> : <>＋ J'y vais</>}
                  </button>
                  <p className="mt-3 text-center text-xs text-violet-400">
                    Billetterie externe gérée par l'organisateur.
                  </p>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setBooked((b) => !b)}
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full py-4 font-extrabold uppercase tracking-wide text-white shadow-card transition-transform hover:scale-[1.02] active:scale-95 ${
                      booked ? 'bg-teal-500' : 'bg-gradient-to-r from-violet-500 to-violet-600'
                    }`}
                  >
                    {booked ? <><Check size={20} /> Tu y es !</> : <><Ticket size={20} /> Je réserve</>}
                  </button>
                  <p className="mt-3 text-center text-xs text-violet-400">
                    Réservation simulée — aucune transaction réelle.
                  </p>
                </>
              )}
            </div>
          </aside>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-extrabold text-violet-400">Dans le même esprit</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((e) => (
                <PremiumCard key={e.id} ev={e} onOpen={setModal} />
              ))}
            </div>
          </div>
        )}
      </section>

      <EventModal ev={modal} onClose={() => setModal(null)} />
    </motion.div>
  );
}
