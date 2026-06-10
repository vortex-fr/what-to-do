import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, BellRing, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../lib/store';
import { CATEGORIES } from '../data/categories';

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'à l\'instant';
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  return `il y a ${Math.floor(s / 86400)} j`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, alerts, toggleAlert, markAllRead, clearNotifications } = useNotifications();
  const unread = notifications.filter((n) => !n.read).length;

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) setTimeout(markAllRead, 1200);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        aria-label="Notifications"
        className="relative grid h-10 w-10 place-items-center rounded-full bg-violet-100 text-violet-600 transition-colors hover:bg-violet-200"
      >
        {unread > 0 ? <BellRing size={18} /> : <Bell size={18} />}
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-br from-[#ff9d6c] to-[#ff5e8a] px-1 text-[11px] font-extrabold text-white">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              className="absolute right-0 top-full z-50 mt-2 w-[min(92vw,380px)] overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-float"
            >
              {/* Header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-violet-500 to-teal-400 px-4 py-3 text-white">
                <span className="font-extrabold">Notifications</span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold hover:bg-white/30"
                  >
                    <Trash2 size={13} /> Vider
                  </button>
                )}
              </div>

              {/* Alertes (anibis-style) */}
              <div className="border-b border-violet-100 px-4 py-3">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-violet-400">
                  Mes alertes — sois averti·e des nouveaux évènements
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((c) => {
                    const on = alerts.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleAlert(c.id)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                          on ? 'border-transparent text-white' : 'border-violet-200 text-violet-500 hover:bg-violet-50'
                        }`}
                        style={on ? { background: c.gradient } : undefined}
                      >
                        {on ? '🔔 ' : ''}
                        {c.short}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Liste */}
              <div className="nice-scroll max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <img src="/assets/mascot.png" alt="" className="mx-auto h-16 w-16 object-contain opacity-80" />
                    <p className="mt-2 text-sm font-bold text-violet-500">Rien pour l'instant</p>
                    <p className="text-xs text-violet-400">Active une alerte ci-dessus pour être averti·e !</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const inner = (
                      <div className={`px-4 py-3 transition-colors hover:bg-violet-50 ${n.read ? '' : 'bg-violet-50/70'}`}>
                        <div className="flex items-start gap-2">
                          {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-400" />}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-ink">{n.title}</p>
                            <p className="truncate text-xs text-violet-500">{n.body}</p>
                            <p className="mt-0.5 text-[11px] text-violet-300">{timeAgo(n.ts)}</p>
                          </div>
                        </div>
                      </div>
                    );
                    return n.slug ? (
                      <Link key={n.id} to={`/evenement/${n.slug}`} onClick={() => setOpen(false)} className="block border-b border-violet-50 last:border-0">
                        {inner}
                      </Link>
                    ) : (
                      <div key={n.id} className="border-b border-violet-50 last:border-0">{inner}</div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
