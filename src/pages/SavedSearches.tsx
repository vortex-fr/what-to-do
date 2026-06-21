import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Trash2, BellPlus, Tag, MapPin, BellRing } from 'lucide-react';
import { useNotifications } from '../lib/store';
import { CATEGORIES, CAT_MAP, REGION_GROUPS, type CategoryId } from '../data/categories';
import Mascot from '../components/Mascot';

export default function SavedSearches() {
  const { savedSearches, addSavedSearch, removeSavedSearch } = useNotifications();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [category, setCategory] = useState<CategoryId | ''>(
    (params.get('cat') as CategoryId) || ''
  );
  const [region, setRegion] = useState(params.get('region') ?? '');
  const [radius, setRadius] = useState('');
  const [flash, setFlash] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query && !category && !region) return;
    addSavedSearch({
      query: query.trim(),
      category: category || undefined,
      region: region || undefined,
      radius: radius ? Number(radius) : undefined,
    });
    setQuery('');
    setCategory('');
    setRegion('');
    setRadius('');
    setFlash(true);
    setTimeout(() => setFlash(false), 2500);
  };

  return (
    <motion.div initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-violet-600 to-violet-700 px-4 py-14 text-center text-white">
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-teal-400/30 blur-3xl" />
        <Mascot pose="conf" size={112} className="mx-auto drop-shadow-xl" />
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Mes recherches & alertes</h1>
        <p className="mx-auto mt-2 max-w-xl text-white/80">
          Sauvegarde une recherche (mot-clé, catégorie, région, rayon) et reçois une alerte dès
          qu'un nouvel évènement correspond. Comme sur Anibis, version sorties 🎉
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Form de création */}
        <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-card sm:p-7">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-ink">
            <BellPlus size={20} className="text-violet-500" /> Créer une alerte
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-2xl border-[1.5px] border-violet-100 bg-[#faf8ff] px-4 py-3 focus-within:border-violet-400 focus-within:bg-white">
              <Search size={18} className="text-violet-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Mot-clé (ex : techno, marathon, vin…)"
                className="w-full bg-transparent font-medium outline-none placeholder:text-violet-300"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId | '')}
                className="rounded-2xl border-[1.5px] border-violet-100 bg-[#faf8ff] px-3 py-3 font-medium outline-none focus:border-violet-400"
              >
                <option value="">Toutes catégories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="rounded-2xl border-[1.5px] border-violet-100 bg-[#faf8ff] px-3 py-3 font-medium outline-none focus:border-violet-400"
              >
                <option value="">Toute la Suisse</option>
                {REGION_GROUPS.map((g) => (
                  <optgroup key={g.canton} label={g.canton}>
                    {g.districts.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <select
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="rounded-2xl border-[1.5px] border-violet-100 bg-[#faf8ff] px-3 py-3 font-medium outline-none focus:border-violet-400"
              >
                <option value="">Rayon (km)</option>
                {[5, 10, 25, 50, 100].map((km) => (
                  <option key={km} value={km}>{km} km</option>
                ))}
              </select>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-teal-400 py-3.5 font-extrabold uppercase tracking-wide text-white shadow-card transition-transform hover:scale-[1.01] active:scale-95">
              <BellRing size={18} /> Activer l'alerte
            </button>
            {flash && (
              <p className="animate-pop rounded-full bg-teal-100 py-2.5 text-center font-bold text-teal-600">
                🔔 Alerte activée ! Tu seras averti·e des nouveaux évènements correspondants.
              </p>
            )}
          </div>
        </form>

        {/* Liste des recherches sauvegardées */}
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-violet-400">
            Recherches sauvegardées ({savedSearches.length})
          </h2>
          {savedSearches.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-card">
              <Mascot pose="empty" size={96} className="mx-auto" />
              <p className="mt-3 font-bold text-violet-600">Aucune recherche sauvegardée</p>
              <p className="text-violet-400">Crée ta première alerte ci-dessus pour ne rien rater.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedSearches.map((s) => (
                <div key={s.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-500">
                    <Search size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-ink">
                      {s.query ? `« ${s.query} »` : 'Tous les évènements'}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-600">
                        <Tag size={12} />
                        {s.category ? CAT_MAP[s.category].short : 'Toutes catégories'}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-600">
                        <MapPin size={12} />
                        {s.region ? s.region : 'Toute la Suisse'}
                        {s.radius ? ` · ${s.radius} km` : ''}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeSavedSearch(s.id)}
                    aria-label="Supprimer"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-rose-400 hover:bg-rose-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
