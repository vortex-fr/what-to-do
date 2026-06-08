import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, User, Heart, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { useAuth, useFavorites } from '../lib/store';

const LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/evenements', label: 'Événements' },
  { to: '/mon-evenement', label: 'Mon événement' },
  { to: '/centre-aide', label: "Centre d'aide" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/evenements?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-[1000] transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-xl shadow-[0_6px_24px_-12px_rgba(80,50,140,.35)]' : 'bg-white/70 backdrop-blur-md'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        {/* Logo */}
        <Link to="/" className="no-tap relative z-10 shrink-0 pr-2">
          <Logo size={30} className="drop-shadow-sm" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `group relative text-[15px] font-bold uppercase tracking-wide transition-colors ${
                  isActive ? 'text-teal-400' : 'text-violet-700 hover:text-violet-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-[3px] rounded-full bg-gradient-to-r from-violet-500 to-teal-400 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            aria-label="Rechercher"
            className="grid h-10 w-10 place-items-center rounded-full bg-violet-500 text-white shadow-card transition-transform hover:scale-105 active:scale-95"
          >
            <Search size={18} />
          </button>

          <Link
            to="/favoris"
            aria-label="Favoris"
            className="relative hidden h-10 w-10 place-items-center rounded-full bg-violet-100 text-violet-600 transition-colors hover:bg-violet-200 sm:grid"
          >
            <Heart size={18} />
            {favorites.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-br from-[#ff9d6c] to-[#ff5e8a] px-1 text-[11px] font-extrabold text-white">
                {favorites.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/mon-evenement"
                className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-teal-400 text-sm font-extrabold text-white"
                title={user.name}
              >
                {user.name.slice(0, 1).toUpperCase()}
              </Link>
              <button
                onClick={logout}
                className="grid h-10 w-10 place-items-center rounded-full text-violet-500 hover:bg-violet-100"
                aria-label="Déconnexion"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/connexion"
              className="hidden items-center gap-2 rounded-full px-2 text-[15px] font-bold uppercase tracking-wide text-violet-700 hover:text-violet-500 sm:flex"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-violet-100 text-violet-600">
                <User size={18} />
              </span>
              Connexion
            </Link>
          )}

          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full text-violet-600 lg:hidden"
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Search drawer */}
      <AnimatePresence>
        {searchOpen && (
          <motion.form
            onSubmit={submitSearch}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-violet-100 bg-white/95 backdrop-blur"
          >
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
              <Search className="text-violet-400" size={20} />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Que veux-tu faire ce weekend ?"
                className="w-full bg-transparent py-1 text-lg outline-none placeholder:text-violet-300"
              />
              <button className="rounded-full bg-violet-500 px-5 py-2 font-bold text-white">
                OK
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-violet-100 bg-white px-4 pb-6 pt-2 shadow-float lg:hidden"
          >
            <div className="flex flex-col">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-3.5 text-lg font-bold uppercase tracking-wide ${
                      isActive ? 'bg-violet-100 text-violet-700' : 'text-violet-700'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-2 flex gap-2">
                <Link
                  to="/favoris"
                  onClick={() => setOpen(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-violet-100 px-4 py-3 font-bold text-violet-700"
                >
                  <Heart size={18} /> Favoris ({favorites.length})
                </Link>
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-teal-400 px-4 py-3 font-bold text-white"
                  >
                    <LogOut size={18} /> Quitter
                  </button>
                ) : (
                  <Link
                    to="/connexion"
                    onClick={() => setOpen(false)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-teal-400 px-4 py-3 font-bold text-white"
                  >
                    <User size={18} /> Connexion
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
