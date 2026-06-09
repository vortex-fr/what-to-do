import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Facebook, Send, MessageCircle } from 'lucide-react';
import Logo from './Logo';

export default function Footer({ onChat }: { onChat: () => void }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <footer className="relative mt-20">
      {/* Newsletter band */}
      <div className="relative overflow-hidden rounded-t-[44px] bg-gradient-to-br from-teal-300 via-teal-400 to-teal-500 px-6 pb-12 pt-14 text-white sm:px-12">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <h3 className="max-w-md text-2xl font-extrabold uppercase leading-tight sm:text-3xl">
              Ne loupe plus aucun évènement avec notre newsletter !
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setDone(true);
              }}
              className="flex w-full max-w-md items-center gap-2 rounded-full bg-white p-1.5 shadow-lg"
            >
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="Ton adresse email"
                className="w-full bg-transparent px-5 py-2.5 text-ink outline-none placeholder:text-violet-300"
              />
              <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-teal-400 text-white transition-transform hover:scale-105 active:scale-95">
                <Send size={18} />
              </button>
            </form>
          </div>
          {done && (
            <p className="mt-3 animate-pop rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold lg:text-right">
              🎉 Merci ! Tu es bien inscrit·e à la newsletter.
            </p>
          )}

          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Logo size={48} />
              <p className="mt-4 max-w-xs text-sm text-white/85">
                La plateforme qui te dit quoi faire. Partout en Suisse, sors,
                vibre, partage.
              </p>
              <img
                src="/assets/mascot-run.png"
                alt=""
                className="pointer-events-none absolute -right-2 top-0 hidden h-24 w-24 animate-floaty object-contain drop-shadow-xl sm:block lg:-right-6 lg:h-28 lg:w-28"
              />
            </div>
            <div>
              <h4 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-white/70">
                À propos
              </h4>
              <ul className="space-y-2 text-[15px]">
                <li><Link className="hover:underline" to="/centre-aide">Qui sommes-nous</Link></li>
                <li><Link className="hover:underline" to="/evenements">Tous les évènements</Link></li>
                <li><Link className="hover:underline" to="/mon-evenement">Publier un évènement</Link></li>
                <li><Link className="hover:underline" to="/centre-aide">Centre d'aide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-white/70">
                Des questions ?
              </h4>
              <button
                onClick={onChat}
                className="group flex items-center gap-3 rounded-2xl bg-white/15 p-3 text-left transition-colors hover:bg-white/25"
              >
                <img
                  src="/assets/mascot.png"
                  alt="Hi-5"
                  className="h-12 w-12 animate-floaty object-contain drop-shadow"
                />
                <span className="text-[15px] font-semibold leading-tight underline-offset-2 group-hover:underline">
                  Engage une conversation<br />avec notre chatbot Hi-5
                </span>
                <MessageCircle size={18} className="ml-auto opacity-80" />
              </button>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-white/70">
                Retrouve-nous sur
              </h4>
              <div className="flex gap-3">
                {[Linkedin, Instagram, Facebook].map((Ic, i) => (
                  <a
                    key={i}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="grid h-11 w-11 place-items-center rounded-full bg-violet-500 text-white shadow-md transition-transform hover:-translate-y-1"
                  >
                    <Ic size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-white/25 pt-5 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 — Tous droits réservés</span>
            <span className="font-extrabold tracking-wide">WWW.WHAT-TO-DO.CH</span>
            <span>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Termes & conditions</a>
              {' · '}
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Politique de confidentialité</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
