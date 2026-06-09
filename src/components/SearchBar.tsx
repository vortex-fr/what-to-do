import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useChat } from './ChatContext';

export default function SearchBar({
  placeholder = 'Demande à Hi-5 : que veux-tu faire ?',
  big = true,
}: {
  placeholder?: string;
  big?: boolean;
}) {
  const [q, setQ] = useState('');
  const { openChat } = useChat();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        openChat(q || 'Surprends-moi');
        setQ('');
      }}
      className={`group flex w-full items-center gap-2 rounded-full bg-white/95 shadow-glow backdrop-blur ${
        big ? 'p-2 sm:p-2.5' : 'p-1.5'
      }`}
    >
      <span
        className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-teal-400 text-white ${
          big ? 'ml-1 h-10 w-10 sm:h-11 sm:w-11' : 'h-8 w-8'
        }`}
      >
        <img src="/assets/mascot.png" alt="" className={big ? 'h-7 w-7 object-contain' : 'h-5 w-5 object-contain'} />
      </span>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-transparent font-semibold text-ink outline-none placeholder:font-semibold placeholder:text-violet-300 ${
          big ? 'px-1 py-3 text-base sm:text-lg' : 'px-1 py-2'
        }`}
      />
      <button
        aria-label="Demander à Hi-5"
        className={`flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-br from-violet-500 to-teal-400 font-extrabold text-white shadow-card transition-transform hover:scale-105 active:scale-95 ${
          big ? 'px-5 py-3 text-sm sm:text-base' : 'px-3 py-2 text-sm'
        }`}
      >
        <Sparkles size={big ? 18 : 15} />
        <span className="hidden sm:inline">Demander</span>
      </button>
    </form>
  );
}
