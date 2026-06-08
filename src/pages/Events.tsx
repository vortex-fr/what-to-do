import { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, SlidersHorizontal, X, ChevronDown, MapPin, Map as MapIcon,
  List as ListIcon, CalendarDays, Tag,
} from 'lucide-react';
import { EVENTS, type WtdEvent } from '../data/events';
import { CATEGORIES, CAT_MAP, REGIONS, type CategoryId } from '../data/categories';
import { ListCard } from '../components/EventCard';
import EventModal from '../components/EventModal';
import CategoryIcon from '../components/CategoryIcon';

const MapView = lazy(() => import('../components/MapView'));

type Sort = 'popularite' | 'avenir' | 'region' | 'categories';
type DateF = 'all' | 'weekend' | 'week' | 'month';

const HERO =
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=2000&q=80';

export default function Events() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [cats, setCats] = useState<Set<CategoryId>>(
    new Set((params.get('cat')?.split(',').filter(Boolean) as CategoryId[]) ?? [])
  );
  const [regions, setRegions] = useState<Set<string>>(new Set());
  const [subs, setSubs] = useState<Set<string>>(new Set());
  const [dateF, setDateF] = useState<DateF>('all');
  const [sort, setSort] = useState<Sort>('popularite');
  const [modal, setModal] = useState<WtdEvent | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setQuery(params.get('q') ?? '');
    const c = params.get('cat')?.split(',').filter(Boolean) as CategoryId[] | undefined;
    if (c) setCats(new Set(c));
  }, [params]);

  const toggle = <T,>(set: Set<T>, val: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setter(next);
  };

  const reset = () => {
    setQuery('');
    setCats(new Set());
    setRegions(new Set());
    setSubs(new Set());
    setDateF('all');
    setParams({});
  };

  const filtered = useMemo(() => {
    const now = new Date();
    let list = EVENTS.filter((e) => {
      if (cats.size && !cats.has(e.category)) return false;
      if (regions.size && !regions.has(e.region)) return false;
      if (subs.size && !subs.has(e.sub)) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${e.title} ${e.city} ${e.sub} ${e.tags.join(' ')} ${e.organizer}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (dateF !== 'all') {
        const d = new Date(e.dateStart);
        const diff = (d.getTime() - now.getTime()) / 86400000;
        if (dateF === 'weekend' && (diff < 0 || diff > 9)) return false;
        if (dateF === 'week' && (diff < 0 || diff > 7)) return false;
        if (dateF === 'month' && (diff < 0 || diff > 31)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === 'popularite') return b.popularity - a.popularity;
      if (sort === 'avenir') return +new Date(a.dateStart) - +new Date(b.dateStart);
      if (sort === 'region') return a.region.localeCompare(b.region);
      return a.category.localeCompare(b.category) || b.popularity - a.popularity;
    });
    return list;
  }, [cats, regions, subs, query, dateF, sort]);

  const activeChips = [
    ...[...cats].map((c) => ({ k: 'cat' as const, v: c, label: CAT_MAP[c].label })),
    ...[...regions].map((r) => ({ k: 'region' as const, v: r, label: r })),
    ...[...subs].map((s) => ({ k: 'sub' as const, v: s, label: s })),
  ];

  return (
    <motion.div initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative h-56 overflow-hidden sm:h-64">
        <img src={HERO} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/30 to-violet-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-cloud to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-2xl items-center gap-2 rounded-full bg-white/95 p-2 shadow-glow"
          >
            <Search className="ml-3 text-violet-400" size={22} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Dis-nous ce que tu cherches !"
              className="w-full bg-transparent py-2.5 font-semibold uppercase tracking-wide outline-none placeholder:text-violet-300"
            />
            <button className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-teal-400 text-white">
              <Search size={22} />
            </button>
          </form>
        </div>
      </section>

      {/* Category circles */}
      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
        <div className="flex items-start justify-between gap-3 overflow-x-auto pb-2 sm:justify-center sm:gap-10">
          {CATEGORIES.map((c) => {
            const on = cats.has(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle(cats, c.id, setCats)}
                className="group flex shrink-0 flex-col items-center gap-2"
              >
                <CategoryIcon
                  cat={c}
                  size={66}
                  active={on || cats.size === 0}
                  className={`transition-transform group-hover:-translate-y-1 ${on ? 'ring-4 ring-offset-2' : ''}`}
                />
                <span
                  className="max-w-[90px] text-center text-[11px] font-extrabold uppercase leading-tight"
                  style={{ color: on || cats.size === 0 ? c.solid : '#a99fc0' }}
                >
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filter bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <Dropdown
            id="dates"
            open={openDrop === 'dates'}
            setOpen={(o) => setOpenDrop(o ? 'dates' : null)}
            icon={<CalendarDays size={16} />}
            label={dateF === 'all' ? 'Dates' : { weekend: 'Ce weekend', week: 'Cette semaine', month: 'Ce mois' }[dateF]}
          >
            {([
              ['all', 'Toutes les dates'],
              ['weekend', 'Ce weekend'],
              ['week', 'Cette semaine'],
              ['month', 'Ce mois-ci'],
            ] as [DateF, string][]).map(([v, l]) => (
              <DropItem key={v} active={dateF === v} onClick={() => { setDateF(v); setOpenDrop(null); }}>
                {l}
              </DropItem>
            ))}
          </Dropdown>

          <Dropdown
            id="region"
            open={openDrop === 'region'}
            setOpen={(o) => setOpenDrop(o ? 'region' : null)}
            icon={<MapPin size={16} />}
            label={regions.size ? `Région (${regions.size})` : 'Région'}
          >
            <div className="max-h-64 overflow-y-auto">
              {REGIONS.map((r) => (
                <DropItem key={r} active={regions.has(r)} onClick={() => toggle(regions, r, setRegions)} check>
                  {r}
                </DropItem>
              ))}
            </div>
          </Dropdown>

          <Dropdown
            id="cat"
            open={openDrop === 'cat'}
            setOpen={(o) => setOpenDrop(o ? 'cat' : null)}
            icon={<Tag size={16} />}
            label={cats.size ? `Catégories (${cats.size})` : 'Catégories'}
          >
            {CATEGORIES.map((c) => (
              <DropItem key={c.id} active={cats.has(c.id)} onClick={() => toggle(cats, c.id, setCats)} check>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: c.solid }} />
                  {c.label}
                </span>
              </DropItem>
            ))}
          </Dropdown>

          {(activeChips.length > 0 || dateF !== 'all' || query) && (
            <button
              onClick={reset}
              className="rounded-full bg-violet-100 px-4 py-2 text-sm font-bold text-violet-600 transition-colors hover:bg-violet-200"
            >
              Réinitialiser
            </button>
          )}

          <button
            onClick={() => setShowFilters((s) => !s)}
            className="ml-auto flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-violet-600 shadow-card lg:hidden"
          >
            <SlidersHorizontal size={16} /> Sous-catégories
          </button>
        </div>

        {/* Active chips */}
        {activeChips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {activeChips.map((c) => (
              <button
                key={`${c.k}-${c.v}`}
                onClick={() => {
                  if (c.k === 'cat') toggle(cats, c.v as CategoryId, setCats);
                  if (c.k === 'region') toggle(regions, c.v, setRegions);
                  if (c.k === 'sub') toggle(subs, c.v, setSubs);
                }}
                className="flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-sm font-semibold text-violet-600"
              >
                {c.label}
                <X size={14} />
              </button>
            ))}
          </div>
        )}

        {/* Sort */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-bold uppercase tracking-wide text-violet-400">Trier selon :</span>
          {([
            ['popularite', 'Popularité'],
            ['avenir', 'À venir'],
            ['region', 'Région'],
            ['categories', 'Catégories'],
          ] as [Sort, string][]).map(([v, l]) => (
            <button
              key={v}
              onClick={() => setSort(v)}
              className={`rounded-full px-4 py-1.5 font-bold transition-colors ${
                sort === v ? 'bg-violet-500 text-white shadow-card' : 'text-violet-500 hover:bg-violet-100'
              }`}
            >
              {l}
            </button>
          ))}
          <span className="ml-auto font-semibold text-violet-400">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</span>
        </div>

        {/* Mobile list/map toggle */}
        <div className="mt-4 flex gap-2 rounded-full bg-violet-100 p-1 lg:hidden">
          {([['list', 'Liste', ListIcon], ['map', 'Carte', MapIcon]] as const).map(([v, l, Ic]) => (
            <button
              key={v}
              onClick={() => setMobileView(v)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2 font-bold ${
                mobileView === v ? 'bg-white text-violet-600 shadow' : 'text-violet-500'
              }`}
            >
              <Ic size={16} /> {l}
            </button>
          ))}
        </div>
      </section>

      {/* Main grid */}
      <section className="mx-auto mt-5 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[260px_1fr_minmax(0,42%)]">
          {/* Sub-category tree */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="nice-scroll max-h-[70vh] space-y-4 overflow-y-auto rounded-3xl bg-white p-5 shadow-card lg:sticky lg:top-24">
              {CATEGORIES.map((c) => (
                <div key={c.id}>
                  <button
                    onClick={() => toggle(cats, c.id, setCats)}
                    className="flex items-center gap-2 text-sm font-extrabold uppercase"
                    style={{ color: c.solid }}
                  >
                    <span className="h-3 w-3 rounded-full" style={{ background: c.gradient }} />
                    {c.label}
                  </button>
                  <ul className="mt-1.5 space-y-0.5 pl-5">
                    {c.sub.map((s) => (
                      <li key={s}>
                        <button
                          onClick={() => toggle(subs, s, setSubs)}
                          className={`text-left text-[13.5px] transition-colors hover:text-violet-600 ${
                            subs.has(s) ? 'font-bold text-violet-600' : 'text-violet-900/60'
                          }`}
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          {/* List */}
          <div className={`${mobileView === 'list' ? 'block' : 'hidden'} space-y-4 lg:block`}>
            {filtered.length === 0 && (
              <div className="rounded-3xl bg-white p-10 text-center shadow-card">
                <img src="/assets/mascot.png" alt="" className="mx-auto h-20 w-20 object-contain opacity-80" />
                <p className="mt-3 text-lg font-bold text-violet-600">Aucun évènement trouvé</p>
                <p className="text-violet-400">Essaie d'élargir tes filtres ou demande à Hi-5 !</p>
                <button onClick={reset} className="mt-4 rounded-full bg-violet-500 px-6 py-2.5 font-bold text-white">
                  Réinitialiser les filtres
                </button>
              </div>
            )}
            {filtered.map((ev, i) => (
              <motion.div
                key={ev.id}
                initial={{ y: 14 }}
                animate={{ y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                onMouseEnter={() => setActive(ev.id)}
                onMouseLeave={() => setActive(null)}
              >
                <ListCard ev={ev} onOpen={setModal} />
              </motion.div>
            ))}
          </div>

          {/* Map */}
          <div className={`${mobileView === 'map' ? 'block' : 'hidden'} lg:block`}>
            <div className="overflow-hidden rounded-3xl shadow-card lg:sticky lg:top-24">
              <div className="relative h-[60vh] min-h-[420px] lg:h-[calc(100vh-7rem)]">
                <div className="pointer-events-none absolute left-1/2 top-3 z-[500] -translate-x-1/2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-violet-500 shadow">
                  Clique sur la carte pour interagir
                </div>
                <Suspense fallback={<div className="grid h-full place-items-center bg-violet-50 text-violet-400">Chargement de la carte…</div>}>
                  <MapView events={filtered} activeId={active} onSelect={setModal} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EventModal ev={modal} onClose={() => setModal(null)} />
    </motion.div>
  );
}

/* ---- Dropdown primitives ---- */
function Dropdown({
  open, setOpen, icon, label, children,
}: {
  id: string; open: boolean; setOpen: (o: boolean) => void;
  icon: React.ReactNode; label: string; children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
          open ? 'border-violet-400 bg-violet-50 text-violet-600' : 'border-violet-200 bg-white text-violet-600'
        }`}
      >
        {icon}
        {label}
        <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-30 mt-2 w-60 origin-top animate-pop rounded-2xl border border-violet-100 bg-white p-1.5 shadow-float">
            {children}
          </div>
        </>
      )}
    </div>
  );
}

function DropItem({
  children, active, onClick, check,
}: {
  children: React.ReactNode; active?: boolean; onClick: () => void; check?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${
        active ? 'bg-violet-100 text-violet-700' : 'text-violet-900/70 hover:bg-violet-50'
      }`}
    >
      {children}
      {check && <span className={`grid h-4 w-4 place-items-center rounded-md border ${active ? 'border-violet-500 bg-violet-500 text-white' : 'border-violet-200'}`}>{active && '✓'}</span>}
    </button>
  );
}
