import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, TrendingUp, Star, Users } from 'lucide-react';
import { EVENTS, type WtdEvent } from '../data/events';
import { CATEGORIES } from '../data/categories';
import { PremiumCard } from '../components/EventCard';
import EventModal from '../components/EventModal';
import SearchBar from '../components/SearchBar';
import CategoryIcon from '../components/CategoryIcon';

const HERO =
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=80';

export default function Home() {
  const [modal, setModal] = useState<WtdEvent | null>(null);
  const premium = EVENTS.filter((e) => e.premium);
  const trending = [...EVENTS].sort((a, b) => b.popularity - a.popularity).slice(0, 8);
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  return (
    <motion.div initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* ---------------- HERO ---------------- */}
      <section className="relative">
        <div className="relative h-[440px] overflow-hidden sm:h-[500px]">
          <img src={HERO} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-violet-950/55 via-violet-900/45 to-violet-950/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,30,80,.35),transparent_70%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-cloud via-transparent to-transparent" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <span className="mb-4 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur sm:text-sm">
              La plateforme qui te dit quoi faire
            </span>
            <motion.h1
              initial={{ y: 18 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 max-w-3xl text-center text-4xl font-extrabold leading-[1.05] text-white [text-shadow:0_2px_20px_rgba(40,20,70,.6)] sm:text-6xl"
            >
              Ta région bouge.<br />
              <span className="bg-gradient-to-r from-teal-200 via-white to-teal-200 bg-clip-text text-transparent">
                Ne rate plus rien.
              </span>
            </motion.h1>
            <motion.div
              initial={{ y: 18 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.22 }}
              className="w-full max-w-2xl"
            >
              <SearchBar />
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Ce weekend', 'Concerts', 'Gratuit', 'En famille', 'Près de moi'].map((t) => (
                  <Link
                    key={t}
                    to="/evenements"
                    className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/30"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- CATEGORIES ---------------- */}
      <section className="relative z-10 mx-auto -mt-6 max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-5 gap-1 rounded-[28px] bg-white/70 p-3 shadow-card backdrop-blur sm:gap-4 sm:p-6">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ y: 16 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="min-w-0"
            >
              <Link
                to={`/evenements?cat=${c.id}`}
                className="group flex flex-col items-center gap-1.5 text-center sm:gap-2"
              >
                <CategoryIcon
                  cat={c}
                  size={56}
                  className="!h-14 !w-14 transition-transform group-hover:-translate-y-1 group-hover:shadow-glow sm:!h-16 sm:!w-16"
                />
                <span
                  className="block w-full break-words text-[8.5px] font-extrabold uppercase leading-[1.1] sm:text-[13px]"
                  style={{ color: c.solid }}
                >
                  {c.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- PREMIUM ---------------- */}
      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold text-violet-400 sm:text-3xl">
            <Sparkles className="text-amber-400" fill="#fbbf24" size={26} />
            Évènements premium
          </h2>
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => scrollBy(-1)}
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-violet-500 shadow-card transition-colors hover:bg-violet-50"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-violet-500 shadow-card transition-colors hover:bg-violet-50"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="nice-scroll -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 pt-4 sm:-mx-3 sm:px-3"
        >
          {premium.map((ev) => (
            <div key={ev.id} className="w-[300px] shrink-0 snap-start sm:w-[330px]">
              <PremiumCard ev={ev} onOpen={setModal} />
            </div>
          ))}
          {/* Sponsored card */}
          <div className="w-[300px] shrink-0 snap-start sm:w-[330px]">
            <SponsoredCard />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/evenements"
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-400 to-violet-500 px-8 py-3.5 font-extrabold uppercase tracking-wide text-white shadow-card transition-transform hover:scale-105"
          >
            Voir plus d'évènements
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 rounded-[30px] bg-gradient-to-br from-violet-500 to-violet-700 p-6 text-white sm:grid-cols-4 sm:p-10">
          {[
            { n: '1 200+', l: 'évènements', i: Star },
            { n: '13', l: 'régions couvertes', i: TrendingUp },
            { n: '85 000', l: 'sorties réservées', i: Users },
            { n: '4.9/5', l: 'note des utilisateurs', i: Sparkles },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <s.i className="mx-auto mb-2 text-teal-300" size={28} />
              <div className="text-3xl font-extrabold sm:text-4xl">{s.n}</div>
              <div className="text-sm font-semibold text-white/75">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- TRENDING ---------------- */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-extrabold text-violet-400 sm:text-3xl">
          <TrendingUp className="text-teal-400" size={26} />
          Ça bouge en ce moment
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trending.slice(0, 4).map((ev) => (
            <PremiumCard key={ev.id} ev={ev} onOpen={setModal} />
          ))}
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-8 rounded-[34px] bg-white p-8 shadow-card sm:grid-cols-3 sm:p-12">
          {[
            { n: '1', t: 'Cherche', d: 'Dis à Hi-5 ou à la barre de recherche ce dont tu as envie.' },
            { n: '2', t: 'Découvre', d: 'Filtre par catégorie, région et date. La carte fait le reste.' },
            { n: '3', t: 'Sors', d: 'Mets en favoris, partage et profite. C\'est aussi simple que ça.' },
          ].map((s) => (
            <div key={s.n} className="text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-teal-400 text-2xl font-extrabold text-white shadow-card">
                {s.n}
              </div>
              <h3 className="text-xl font-extrabold text-ink">{s.t}</h3>
              <p className="mt-1 text-violet-700/70">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <EventModal ev={modal} onClose={() => setModal(null)} />
    </motion.div>
  );
}

function SponsoredCard() {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="card-glow group block h-full rounded-[26px] bg-white p-2.5 shadow-card"
      style={{ ['--glow' as string]: 'linear-gradient(135deg,#9fd16a,#3a9d6b)' }}
    >
      <div className="relative flex h-full flex-col items-center justify-center rounded-[20px] bg-gradient-to-b from-white to-emerald-50 p-6">
        <span className="absolute left-3 top-3 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-bold uppercase text-violet-500">
          Sponsorisé
        </span>
        <div className="mt-6 text-center">
          <div className="text-4xl font-extrabold tracking-tight text-slate-600">
            EASY<span className="text-emerald-500">-PROCESS</span>
          </div>
          <div className="mt-1 text-sm font-semibold tracking-[0.2em] text-emerald-600">
            ÉTUDE · SUIVI · GESTION
          </div>
          <div className="my-8 grid place-items-center">
            <div className="grid h-24 w-24 place-items-center rounded-2xl border-4 border-emerald-400 text-emerald-500">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mt-auto w-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 text-center font-extrabold uppercase tracking-wide text-white">
          www.easy-process.ch
        </div>
      </div>
    </a>
  );
}
