import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Msg {
  from: 'bot' | 'me';
  text: string;
  chips?: { label: string; to?: string; reply?: string }[];
}

const WELCOME: Msg = {
  from: 'bot',
  text: 'Salut, moi c\'est Hi-5 ! 🤙 Dis-moi ce qui te ferait kiffer ce weekend et je te trouve ça.',
  chips: [
    { label: '🎤 Un concert', reply: 'concert' },
    { label: '🍷 Sortir le soir', reply: 'soir' },
    { label: '🏃 Du sport', reply: 'sport' },
    { label: '👨‍👩‍👧 En famille', reply: 'famille' },
  ],
};

function botReply(input: string): Msg {
  const t = input.toLowerCase();
  if (/(concert|musique|celine|chant)/.test(t))
    return {
      from: 'bot',
      text: 'Excellent choix 🎶 « Comme Céline Dion » à La Chaux-de-Fonds devrait te plaire — un hommage live avec orchestre !',
      chips: [{ label: 'Voir l\'évènement', to: '/evenement/comme-celine-dion' }, { label: 'Tous les concerts', to: '/evenements?cat=culture' }],
    };
  if (/(soir|club|bar|night|nuit|fête|fete)/.test(t))
    return {
      from: 'bot',
      text: 'La nuit t\'appelle 🌙 « Fiver Night » au MAD Club, deux nuits de techno mélodique. Ça envoie !',
      chips: [{ label: 'Voir la soirée', to: '/evenement/fiver-night-2nights' }, { label: 'Vie nocturne', to: '/evenements?cat=gastronomie' }],
    };
  if (/(sport|cours|run|trail|vélo|velo|ski|yoga)/.test(t))
    return {
      from: 'bot',
      text: 'Allez, on bouge 🏃 La « Running Pléiade » longe le lac face aux Alpes. 5, 10 ou 21 km, à toi de voir !',
      chips: [{ label: 'Voir la course', to: '/evenement/running-pleiade' }, { label: 'Tout le sport', to: '/evenements?cat=sport' }],
    };
  if (/(famille|enfant|kids|enfants)/.test(t))
    return {
      from: 'bot',
      text: 'En famille, c\'est sacré 👨‍👩‍👧 L\'« Atelier cuisine enfants » à Lausanne va régaler les petits chefs.',
      chips: [{ label: 'Voir l\'atelier', to: '/evenement/atelier-cuisine-enfants' }, { label: 'Famille & Communauté', to: '/evenements?cat=famille' }],
    };
  return {
    from: 'bot',
    text: 'Je te trouve ça en deux secondes 🔎 Explore tous les évènements ou affine par catégorie !',
    chips: [
      { label: 'Tous les évènements', to: '/evenements' },
      { label: '🎤 Concert', reply: 'concert' },
      { label: '🍷 Soirée', reply: 'soir' },
    ],
  };
}

export default function Chatbot({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 99999, behavior: 'smooth' });
  }, [msgs, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: 'me', text }]);
    setInput('');
    setTimeout(() => setMsgs((m) => [...m, botReply(text)]), 450);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="fixed bottom-24 right-4 z-[1100] flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-float sm:right-6"
        >
          {/* header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-violet-500 to-teal-400 px-4 py-3 text-white">
            <img src="/assets/mascot.png" alt="Hi-5" className="h-11 w-11 object-contain drop-shadow" />
            <div className="leading-tight">
              <p className="font-extrabold">Hi-5</p>
              <p className="flex items-center gap-1.5 text-xs text-white/90">
                <span className="h-2 w-2 rounded-full bg-green-300" /> En ligne
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
                <div className="max-w-[85%]">
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-[15px] leading-snug shadow-sm ${
                      m.from === 'me'
                        ? 'rounded-br-md bg-gradient-to-br from-violet-500 to-violet-600 text-white'
                        : 'rounded-bl-md bg-white text-ink'
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.chips && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.chips.map((c, j) => (
                        <button
                          key={j}
                          onClick={() => {
                            if (c.to) {
                              navigate(c.to);
                              onClose();
                            } else if (c.reply) {
                              send(c.reply === c.label ? c.label : c.label);
                            }
                          }}
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
              placeholder="Écris ton message…"
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
