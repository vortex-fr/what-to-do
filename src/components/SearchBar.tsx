import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({
  placeholder = 'Que veux-tu faire ce weekend ?',
  big = true,
}: {
  placeholder?: string;
  big?: boolean;
}) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate(`/evenements${q ? `?q=${encodeURIComponent(q)}` : ''}`);
      }}
      className={`group flex w-full items-center gap-2 rounded-full bg-white/95 shadow-glow backdrop-blur ${
        big ? 'p-2 sm:p-2.5' : 'p-1.5'
      }`}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-transparent font-semibold uppercase tracking-wide text-ink outline-none placeholder:font-semibold placeholder:text-violet-300 ${
          big ? 'px-5 py-3 text-base sm:text-lg' : 'px-4 py-2'
        }`}
      />
      <button
        aria-label="Rechercher"
        className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-teal-400 text-white shadow-card transition-transform hover:scale-105 active:scale-95 ${
          big ? 'h-12 w-12 sm:h-14 sm:w-14' : 'h-10 w-10'
        }`}
      >
        <Search size={big ? 24 : 18} />
      </button>
    </form>
  );
}
