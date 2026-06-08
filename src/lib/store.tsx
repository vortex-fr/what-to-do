import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { WtdEvent } from '../data/events';

/* ---------------- Favorites ---------------- */
interface FavCtx {
  favorites: string[];
  toggleFav: (id: string) => void;
  isFav: (id: string) => boolean;
}
const FavoritesContext = createContext<FavCtx | null>(null);

const FAV_KEY = 'wtd:favorites';

export function StoreProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [user, setUser] = useState<User | null>(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch {
      return null;
    }
  });
  const [myEvents, setMyEvents] = useState<WtdEvent[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(MYEV_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }, [user]);
  useEffect(() => {
    localStorage.setItem(MYEV_KEY, JSON.stringify(myEvents));
  }, [myEvents]);

  const toggleFav = useCallback((id: string) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }, []);
  const isFav = useCallback((id: string) => favorites.includes(id), [favorites]);

  const login = useCallback((email: string, name?: string) => {
    setUser({ email, name: name || email.split('@')[0] });
  }, []);
  const logout = useCallback(() => setUser(null), []);

  const addMyEvent = useCallback((e: WtdEvent) => {
    setMyEvents((list) => [e, ...list]);
  }, []);
  const removeMyEvent = useCallback((id: string) => {
    setMyEvents((list) => list.filter((e) => e.id !== id));
  }, []);

  const favVal = useMemo(() => ({ favorites, toggleFav, isFav }), [favorites, toggleFav, isFav]);
  const authVal = useMemo(
    () => ({ user, login, logout, myEvents, addMyEvent, removeMyEvent }),
    [user, login, logout, myEvents, addMyEvent, removeMyEvent]
  );

  return (
    <FavoritesContext.Provider value={favVal}>
      <AuthContext.Provider value={authVal}>{children}</AuthContext.Provider>
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites outside provider');
  return ctx;
}

/* ---------------- Auth + My events ---------------- */
export interface User {
  email: string;
  name: string;
}
interface AuthCtx {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  myEvents: WtdEvent[];
  addMyEvent: (e: WtdEvent) => void;
  removeMyEvent: (id: string) => void;
}
const AuthContext = createContext<AuthCtx | null>(null);
const USER_KEY = 'wtd:user';
const MYEV_KEY = 'wtd:myevents';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside provider');
  return ctx;
}
