import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const CONSENT_KEY = 'wtd:consent';

export default function CookieBanner() {
  const [seen, setSeen] = useState(() => localStorage.getItem(CONSENT_KEY) === '1');

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, '1');
    setSeen(true);
  };

  return (
    <AnimatePresence>
      {!seen && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="fixed bottom-4 left-4 z-[1080] w-[min(94vw,420px)] rounded-3xl border border-white/60 bg-white/95 p-4 shadow-float backdrop-blur sm:left-6"
        >
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-teal-400 text-white">
              <ShieldCheck size={20} />
            </span>
            <div className="text-[13.5px] leading-snug text-violet-900/80">
              <p className="font-extrabold text-ink">Ta vie privée, en deux mots</p>
              <p className="mt-0.5">
                Pas de cookies publicitaires ni de pisteurs : juste le stockage local de ton
                navigateur pour tes favoris et alertes.{' '}
                <Link to="/politique-de-confidentialite" className="font-bold text-violet-500 underline">
                  En savoir plus
                </Link>
              </p>
            </div>
          </div>
          <button
            onClick={accept}
            className="mt-3 w-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400 py-2.5 font-extrabold uppercase tracking-wide text-white transition-transform hover:scale-[1.01] active:scale-95"
          >
            Compris !
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
