import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { WtdEvent } from '../data/events';
import { CAT_MAP } from '../data/categories';
import { interpret } from '../lib/assistant';
import { formatDateRange, formatPrice } from '../lib/format';

interface Msg {
  from: 'bot' | 'me';
  text: string;
  events?: WtdEvent[];
  filterUrl?: string;
  chips?: { label: string; reply: string }[];
}

const WELCOME: Msg = {
  from: 'bot',
  text: 'Salut, moi c\'est Hi-5 ! 🤙 Dis-moi ce qui te ferait kiffer et je te trouve l\'évènement parfait — partout en Suisse.',
  chips: [
    { label: '🎤 Un concert ce week-end', reply: 'un concert ce week-end' },
    { label: '🍷 Sortir ce soir', reply: 'sortir boire un verre ce soir' },
    { label: '🏃 Du sport', reply: 'faire du sport' },
    { label: '🎟️ Gratuit', reply: 'des évènements gratuits' },
  ],
};

export default function Chatbot({
  open,
  onClose,
  seed,
}: {
  open: boolean;
  onClose: () => void;
  seed: { q: string; n: number } | null;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastSeed = useRef<number>(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 99999, behavior: 'smooth' });
  }, [msgs, open, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: 'me', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const r = interpret(text);
      setTyping(false);
      setMsgs((m) => [
        ...m,
        {
          from: 'bot',
          text: r.text,
          events: r.events,
          filterUrl: r.events.length ? r.filterUrl : undefined,
        },
      ]);
    }, 500);
  };

  // react to a seeded query coming from the hero / nav search
  useEffect(() => {
    if (seed && seed.n !== lastSeed.current) {
      lastSeed.current = seed.n;
      send(seed.q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 30, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="fixed bottom-24 right-4 z-[1100] flex h-[72vh] max-h-[620px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-float sm:right-6"
        >
          {/* header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-violet-500 to-teal-400 px-4 py-3 text-white">
            <img src="/assets/mascot.png" alt="Hi-5" className="h-11 w-11 object-contain drop-shadow" />
            <div className="leading-tight">
              <p className="flex items-center gap-1.5 font-extrabold">
                Hi-5 <Sparkles size={14} className="text-amber-200" />
              </p>
              <p className="flex items-center gap-1.5 text-xs text-white/90">
                <span className="h-2 w-2 rounded-full bg-green-300" /> Ton assistant sorties
              </p>
            </div>
            <button onClick={onClose} className="ml-auto rounded-full p-1.5 hover:bg-white/20">
              <X size={20} />
            </button>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="nice-scroll flex-1 space-y-3 overflow-y-auto bg-cloud p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[88%]">
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-[15px] leading-snug shadow-sm ${
                      m.from === 'me'
                        ? 'rounded-br-md bg-gradient-to-br from-violet-500 to-violet-600 text-white'
                        : 'rounded-bl-md bg-white text-ink'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* event result cards */}
                  {m.events && m.events.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {m.events.map((ev) => {
                        const cat = CAT_MAP[ev.category];
                        return (
                          <button
                            key={ev.id}
                            onClick={() => {
                              navigate(`/evenement/${ev.slug}`);
                              onClose();
                            }}
                            className="flex w-full items-center gap-2.5 rounded-2xl border border-violet-100 bg-white p-2 text-left transition-colors hover:bg-violet-50"
                          >
                            <img src={ev.image} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-bold text-ink">{ev.title}</span>
                              <span className="block truncate text-xs text-violet-400">
                                {formatDateRange(ev.dateStart, ev.dateEnd)} · {ev.city}
                              </span>
                            </span>
                            <span
                              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white"
                              style={{ background: cat.gradient }}
                            >
                              {formatPrice(ev.priceFrom) === 'Gratuit' ? 'GRATUIT' : `${ev.priceFrom}.-`}
                            </span>
                          </button>
                        );
                      })}
                      {m.filterUrl && (
                        <Link
                          to={m.filterUrl}
                          onClick={onClose}
                          className="block rounded-full bg-gradient-to-r from-violet-500 to-teal-400 px-4 py-2 text-center text-sm font-bold text-white"
                        >
                          Voir tous les résultats →
                        </Link>
                      )}
                    </div>
                  )}

                  {/* suggestion chips */}
                  {m.chips && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.chips.map((c, j) => (
                        <button
                          key={j}
                          onClick={() => send(c.reply)}
                          className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-sm font-semibold text-violet-600 transition-colors hover:bg-violet-50"
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-2 w-2 animate-bounce rounded-full bg-violet-300"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-violet-100 bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Demande-moi quoi faire…"
              className="w-full rounded-full bg-cloud px-4 py-2.5 outline-none placeholder:text-violet-300"
            />
            <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-teal-400 text-white">
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
