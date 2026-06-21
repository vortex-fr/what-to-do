import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, Sparkles, CheckCircle2, CopyPlus, UploadCloud, Wand2, X } from 'lucide-react';
import { CATEGORIES, REGIONS, CAT_MAP, type CategoryId } from '../data/categories';
import type { WtdEvent } from '../data/events';
import { useAuth } from '../lib/store';
import { PremiumCard } from '../components/EventCard';
import EventModal from '../components/EventModal';
import AddressAutocomplete from '../components/AddressAutocomplete';
import Mascot from '../components/Mascot';
import { optimizeImage, formatBytes, type OptimizedImage } from '../lib/image';

const CITY_COORDS: Record<string, [number, number]> = {
  Lausanne: [46.5197, 6.6323], Genève: [46.2044, 6.1432], Montreux: [46.4312, 6.9123],
  Vevey: [46.4628, 6.8419], Nyon: [46.3833, 6.2333], Fribourg: [46.8065, 7.1619],
  Neuchâtel: [46.993, 6.931], 'La Chaux-de-Fonds': [47.0998, 6.8255], Valais: [46.2331, 7.3599],
  Sion: [46.2331, 7.3599], Yverdon: [46.7785, 6.6411], Jura: [47.2564, 6.9956], Riviera: [46.43, 6.91],
};

const DEFAULT_IMG =
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80';

const empty = {
  title: '', category: 'culture' as CategoryId, sub: '', region: 'Lausanne',
  city: 'Lausanne', venue: '', date: '2026-07-01', time: '19:00',
  priceType: 'free' as 'free' | 'from' | 'fixed', priceFrom: '',
  capacity: '', ticketUrl: '', premium: true,
  image: '', description: '', tags: '',
  lat: null as number | null, lng: null as number | null,
};

export default function MyEvent() {
  const { user, myEvents, addMyEvent, removeMyEvent } = useAuth();
  const [form, setForm] = useState(empty);
  const [modal, setModal] = useState<WtdEvent | null>(null);
  const [flash, setFlash] = useState(false);
  const [imgInfo, setImgInfo] = useState<OptimizedImage | null>(null);
  const [imgBusy, setImgBusy] = useState(false);
  const [imgErr, setImgErr] = useState('');

  const set = (k: keyof typeof form, v: string | boolean | number | null) =>
    setForm((f) => ({ ...f, [k]: v }));
  const cat = CAT_MAP[form.category];

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setImgErr('');
    setImgBusy(true);
    try {
      const opt = await optimizeImage(file);
      setImgInfo(opt);
      setForm((f) => ({ ...f, image: opt.dataUrl }));
    } catch (e) {
      setImgErr(e instanceof Error ? e.message : 'Erreur image');
    } finally {
      setImgBusy(false);
    }
  };

  const preview: WtdEvent = {
    id: 'preview',
    slug: 'preview',
    title: form.title || 'Titre de ton évènement',
    category: form.category,
    sub: form.sub || cat.sub[0],
    region: form.region,
    city: form.city || form.region,
    venue: form.venue || 'Lieu à définir',
    lat: form.lat ?? (CITY_COORDS[form.city] ?? CITY_COORDS[form.region] ?? CITY_COORDS.Lausanne)[0],
    lng: form.lng ?? (CITY_COORDS[form.city] ?? CITY_COORDS[form.region] ?? CITY_COORDS.Lausanne)[1],
    image: form.image || DEFAULT_IMG,
    priceFrom: form.priceType === 'free' ? null : form.priceFrom ? Number(form.priceFrom) : null,
    priceType: form.priceType,
    ticketUrl: form.ticketUrl.trim() || undefined,
    dateStart: `${form.date}T${form.time}:00`,
    time: form.time,
    premium: form.premium,
    organizer: user?.name ?? 'Toi',
    popularity: 50,
    capacity: form.capacity ? Number(form.capacity) : 200,
    going: 0,
    short: form.description.slice(0, 90),
    description: form.description || 'Décris ton évènement pour donner envie au public de venir !',
    tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ev: WtdEvent = { ...preview, id: `my-${Date.now()}`, slug: `my-${Date.now()}` };
    addMyEvent(ev);
    setForm(empty);
    setImgInfo(null);
    setFlash(true);
    setTimeout(() => setFlash(false), 2500);
  };

  // Dupliquer un évènement pour l'an prochain (même contenu, date + 1 an)
  const duplicateNextYear = (e: WtdEvent) => {
    const nextStart = new Date(e.dateStart);
    nextStart.setFullYear(nextStart.getFullYear() + 1);
    const clone: WtdEvent = {
      ...e,
      id: `my-${Date.now()}`,
      slug: `my-${Date.now()}`,
      dateStart: nextStart.toISOString(),
      dateEnd: e.dateEnd
        ? (() => {
            const d = new Date(e.dateEnd);
            d.setFullYear(d.getFullYear() + 1);
            return d.toISOString();
          })()
        : undefined,
      going: 0,
    };
    addMyEvent(clone);
    setFlash(true);
    setTimeout(() => setFlash(false), 2500);
  };

  return (
    <motion.div initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-start gap-4">
        <Mascot pose="idea" size={84} className="hidden shrink-0 sm:block" />
        <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-teal-400">
          <Sparkles size={16} /> Espace organisateur
        </span>
        <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Publie ton évènement</h1>
        <p className="text-violet-700/70">
          Remplis le formulaire, vois l'aperçu en direct, et fais rayonner ton évènement partout en Suisse.
          {!user && <> <Link to="/connexion" className="font-bold text-violet-500 underline">Connecte-toi</Link> pour le sauvegarder.</>}
        </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <form onSubmit={submit} className="space-y-5 rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <Field label="Titre de l'évènement">
            <input required value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Ex : Concert au coucher du soleil" className="inp" />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Catégorie">
              <select value={form.category} onChange={(e) => { set('category', e.target.value); set('sub', ''); }} className="inp">
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Sous-catégorie">
              <select value={form.sub} onChange={(e) => set('sub', e.target.value)} className="inp">
                <option value="">— Choisir —</option>
                {cat.sub.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Région">
              <select value={form.region} onChange={(e) => { set('region', e.target.value); set('city', e.target.value); }} className="inp">
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Ville">
              <input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Ville" className="inp" />
            </Field>
          </div>

          <Field label="Lieu / Salle ou adresse">
            <AddressAutocomplete
              value={form.venue}
              onChange={(v) => set('venue', v)}
              onSelect={(p) =>
                setForm((f) => ({
                  ...f,
                  venue: p.venue || p.label.split(',')[0],
                  city: p.city || f.city,
                  lat: p.lat,
                  lng: p.lng,
                }))
              }
            />
            <p className="mt-1 text-xs text-violet-400">
              Salles connues + adresses de toute la Suisse (OpenStreetMap){form.lat ? ' · 📍 localisé sur la carte' : ''}
            </p>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Date"><input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} className="inp" /></Field>
            <Field label="Heure"><input type="time" value={form.time} onChange={(e) => set('time', e.target.value)} className="inp" /></Field>
          </div>

          {/* Prix : toutes les options (gratuit / dès / fixe) */}
          <Field label="Prix">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex gap-1 rounded-full bg-violet-100 p-1">
                {([
                  ['free', 'Gratuit'],
                  ['from', 'Dès…'],
                  ['fixed', 'Prix fixe'],
                ] as const).map(([v, l]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => set('priceType', v)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                      form.priceType === v ? 'bg-white text-violet-700 shadow' : 'text-violet-500'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {form.priceType !== 'free' && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.priceFrom}
                    onChange={(e) => set('priceFrom', e.target.value)}
                    placeholder={form.priceType === 'from' ? 'Dès… CHF' : 'CHF'}
                    className="inp !w-32"
                  />
                  <span className="font-bold text-violet-400">CHF</span>
                </div>
              )}
            </div>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Taille de l'évènement (places)">
              <input
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => set('capacity', e.target.value)}
                placeholder="Ex : 200"
                className="inp"
              />
            </Field>
            <Field label="URL billetterie (optionnel)">
              <input
                type="url"
                value={form.ticketUrl}
                onChange={(e) => set('ticketUrl', e.target.value)}
                placeholder="https://billetterie.ch/mon-event"
                className="inp"
              />
            </Field>
          </div>

          <Field label="Image de l'évènement">
            {form.image && form.image.startsWith('data:') ? (
              <div className="relative overflow-hidden rounded-2xl border-[1.5px] border-violet-100">
                <img src={form.image} alt="aperçu" className="h-44 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setForm((f) => ({ ...f, image: '' })); setImgInfo(null); }}
                  className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-rose-500 shadow hover:bg-white"
                >
                  <X size={16} />
                </button>
                {imgInfo && (
                  <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-xs font-semibold text-white">
                    <Wand2 size={14} className="text-teal-300" />
                    Optimisée : {formatBytes(imgInfo.originalBytes)} → {formatBytes(imgInfo.optimizedBytes)}
                    {imgInfo.saved > 0.02 && (
                      <span className="rounded-full bg-teal-400/90 px-2 py-0.5 text-[11px] font-extrabold text-white">
                        −{Math.round(imgInfo.saved * 100)}%
                      </span>
                    )}
                    <span className="ml-auto opacity-80">{imgInfo.width}×{imgInfo.height}</span>
                  </div>
                )}
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-violet-200 bg-[#faf8ff] px-4 py-7 text-center transition-colors hover:border-violet-400 hover:bg-violet-50">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                {imgBusy ? (
                  <span className="font-semibold text-violet-500">Optimisation en cours…</span>
                ) : (
                  <>
                    <UploadCloud className="text-violet-400" size={28} />
                    <span className="font-bold text-violet-600">Dépose une image ou clique pour choisir</span>
                    <span className="text-xs text-violet-400">
                      JPG, PNG… Même une image lourde : on la redimensionne et compresse automatiquement.
                    </span>
                  </>
                )}
              </label>
            )}
            {imgErr && <p className="mt-1 text-xs font-semibold text-rose-500">{imgErr}</p>}
          </Field>

          <Field label="Tags (séparés par des virgules)">
            <input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="Concert, Live, Été" className="inp" />
          </Field>

          <Field label="Description">
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} placeholder="Raconte ton évènement…" className="inp resize-none" />
          </Field>

          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={form.premium} onChange={(e) => set('premium', e.target.checked)} className="peer sr-only" />
            <span className="relative h-7 w-12 rounded-full bg-violet-200 transition-colors peer-checked:bg-violet-500">
              <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
            </span>
            <span className="font-semibold text-violet-700">Mettre en avant (premium ✨)</span>
          </label>

          <button className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-teal-400 py-4 font-extrabold uppercase tracking-wide text-white shadow-card transition-transform hover:scale-[1.01] active:scale-95">
            <PlusCircle size={20} /> Publier l'évènement
          </button>
          {flash && (
            <p className="flex animate-pop items-center justify-center gap-2 rounded-full bg-teal-100 py-2.5 font-bold text-teal-600">
              <CheckCircle2 size={18} /> Évènement publié ! Retrouve-le ci-contre.
            </p>
          )}
        </form>

        {/* Preview + my events */}
        <aside className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-violet-400">Aperçu en direct</h3>
            <PremiumCard ev={preview} onOpen={setModal} />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-violet-400">
              Mes évènements ({myEvents.length})
            </h3>
            {myEvents.length === 0 ? (
              <p className="rounded-2xl bg-white p-4 text-sm text-violet-400 shadow-card">
                Tu n'as pas encore publié d'évènement.
              </p>
            ) : (
              <div className="space-y-3">
                {myEvents.map((e) => (
                  <div key={e.id} className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-card">
                    <img src={e.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-ink">{e.title}</p>
                      <p className="truncate text-xs text-violet-400">
                        {e.city} · {new Date(e.dateStart).getFullYear()} · {CAT_MAP[e.category].short}
                      </p>
                    </div>
                    <button
                      onClick={() => duplicateNextYear(e)}
                      title="Dupliquer pour l'an prochain"
                      className="grid h-9 w-9 place-items-center rounded-full text-violet-500 hover:bg-violet-50"
                    >
                      <CopyPlus size={18} />
                    </button>
                    <button onClick={() => removeMyEvent(e.id)} title="Supprimer" className="grid h-9 w-9 place-items-center rounded-full text-rose-400 hover:bg-rose-50">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      <EventModal ev={modal} onClose={() => setModal(null)} />

      <style>{`.inp{width:100%;border-radius:1rem;border:1.5px solid #e6def5;background:#faf8ff;padding:.7rem 1rem;font-weight:500;outline:none;transition:border-color .2s}.inp:focus{border-color:#8b5fbf;background:#fff}`}</style>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-violet-700">{label}</span>
      {children}
    </label>
  );
}
