import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { EVENTS, type WtdEvent } from '../data/events';
import { CAT_MAP, type CategoryId } from '../data/categories';
import { formatDateRange } from './format';

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
  const [alerts, setAlerts] = useState<CategoryId[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(ALERTS_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [notifications, setNotifications] = useState<Notif[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]');
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
  useEffect(() => {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  }, [alerts]);
  useEffect(() => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const toggleFav = useCallback((id: string) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }, []);
  const isFav = useCallback((id: string) => favorites.includes(id), [favorites]);

  const login = useCallback((email: string, name?: string) => {
    setUser({ email, name: name || email.split('@')[0] });
  }, []);
  const logout = useCallback(() => setUser(null), []);

  const pushNotif = useCallback((n: Omit<Notif, 'id' | 'ts' | 'read'>) => {
    setNotifications((list) =>
      [{ ...n, id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ts: Date.now(), read: false }, ...list].slice(0, 30)
    );
  }, []);

  // Alerte sauvegardée (façon anibis.ch) : en s'abonnant à une catégorie,
  // on reçoit tout de suite les prochains évènements qui matchent.
  const toggleAlert = useCallback(
    (cat: CategoryId) => {
      setAlerts((list) => {
        if (list.includes(cat)) return list.filter((c) => c !== cat);
        const upcoming = EVENTS.filter(
          (e) => e.category === cat && new Date(e.dateStart).getTime() > Date.now()
        )
          .sort((a, b) => +new Date(a.dateStart) - +new Date(b.dateStart))
          .slice(0, 2);
        setTimeout(() => {
          pushNotif({
            title: `🔔 Alerte « ${CAT_MAP[cat].label} » activée`,
            body: 'Tu seras averti·e des nouveaux évènements de cette catégorie.',
          });
          upcoming.forEach((e) =>
            pushNotif({
              title: `Nouveau : ${e.title}`,
              body: `${e.city} · ${formatDateRange(e.dateStart, e.dateEnd)}`,
              slug: e.slug,
            })
          );
        }, 0);
        return [...list, cat];
      });
    },
    [pushNotif]
  );

  const markAllRead = useCallback(() => {
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
  }, []);
  const clearNotifications = useCallback(() => setNotifications([]), []);

  const addMyEvent = useCallback(
    (e: WtdEvent) => {
      setMyEvents((list) => [e, ...list]);
      pushNotif({
        title: `Nouveau : ${e.title}`,
        body: `${e.city} · ${formatDateRange(e.dateStart, e.dateEnd)} — publié à l'instant`,
      });
    },
    [pushNotif]
  );
  const removeMyEvent = useCallback((id: string) => {
    setMyEvents((list) => list.filter((e) => e.id !== id));
  }, []);

  const favVal = useMemo(() => ({ favorites, toggleFav, isFav }), [favorites, toggleFav, isFav]);
  const authVal = useMemo(
    () => ({ user, login, logout, myEvents, addMyEvent, removeMyEvent }),
    [user, login, logout, myEvents, addMyEvent, removeMyEvent]
  );
  const notifVal = useMemo(
    () => ({ notifications, alerts, toggleAlert, markAllRead, clearNotifications }),
    [notifications, alerts, toggleAlert, markAllRead, clearNotifications]
  );

  return (
    <FavoritesContext.Provider value={favVal}>
      <AuthContext.Provider value={authVal}>
        <NotificationsContext.Provider value={notifVal}>{children}</NotificationsContext.Provider>
      </AuthContext.Provider>
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

/* ---------------- Notifications (alertes façon anibis.ch) ---------------- */
export interface Notif {
  id: string;
  title: string;
  body: string;
  ts: number;
  read: boolean;
  slug?: string;
}
interface NotifCtx {
  notifications: Notif[];
  alerts: CategoryId[];
  toggleAlert: (cat: CategoryId) => void;
  markAllRead: () => void;
  clearNotifications: () => void;
}
const NotificationsContext = createContext<NotifCtx | null>(null);
const ALERTS_KEY = 'wtd:alerts';
const NOTIF_KEY = 'wtd:notifs';

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications outside provider');
  return ctx;
}
