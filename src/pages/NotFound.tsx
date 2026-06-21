import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home as HomeIcon, Search } from 'lucide-react';

type Lang = 'fr' | 'de' | 'it' | 'en';

const LANGS: { id: Lang; label: string }[] = [
  { id: 'fr', label: 'FR' },
  { id: 'de', label: 'DE' },
  { id: 'it', label: 'IT' },
  { id: 'en', label: 'EN' },
];

const T: Record<Lang, { back: string; explore: string; lost: string }> = {
  fr: { back: "Retour à l'accueil", explore: 'Explorer les évènements', lost: 'Oops, cette page est introuvable.' },
  de: { back: 'Zurück zur Startseite', explore: 'Veranstaltungen entdecken', lost: 'Hoppla, diese Seite gibt es nicht.' },
  it: { back: 'Torna alla home', explore: 'Esplora gli eventi', lost: 'Ops, questa pagina non esiste.' },
  en: { back: 'Back to home', explore: 'Explore events', lost: 'Oops, this page does not exist.' },
};

export default function NotFound() {
  const [lang, setLang] = useState<Lang>('fr');
  const t = T[lang];

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative grid min-h-[calc(100vh-4rem)] place-items-center overflow-hidden px-4 py-12"
    >
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-violet-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-teal-300/40 blur-3xl" />

      <div className="relative w-full max-w-xl text-center">
        {/* language switch */}
        <div className="mb-6 flex justify-center gap-1.5">
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`rounded-full px-3 py-1 text-sm font-bold transition-colors ${
                lang === l.id ? 'bg-violet-500 text-white shadow-card' : 'bg-white text-violet-500 hover:bg-violet-100'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <motion.img
          key={lang}
          src={`/assets/404/${lang}.png`}
          alt="Erreur 404"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          className="mx-auto w-full max-w-md drop-shadow-xl"
        />

        <p className="mt-4 text-lg font-semibold text-violet-700/70">{t.lost}</p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-teal-400 px-7 py-3.5 font-extrabold uppercase tracking-wide text-white shadow-card transition-transform hover:scale-105"
          >
            <HomeIcon size={18} /> {t.back}
          </Link>
          <Link
            to="/evenements"
            className="flex items-center justify-center gap-2 rounded-full border-2 border-violet-200 px-7 py-3 font-bold text-violet-600 transition-colors hover:bg-violet-50"
          >
            <Search size={18} /> {t.explore}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
