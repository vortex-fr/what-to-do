import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, Sparkles, CheckCircle2, ImageIcon } from 'lucide-react';
import { CATEGORIES, REGIONS, CAT_MAP, type CategoryId } from '../data/categories';
import type { WtdEvent } from '../data/events';
import { useAuth } from '../lib/store';
import { PremiumCard } from '../components/EventCard';
import EventModal from '../components/EventModal';

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
  city: 'Lausanne', venue: '', date: '2026-07-01', time: '19:00', priceFrom: '', premium: true,
  image: '', description: '', tags: '',
};

export default function MyEvent() {
  const { user, myEvents, addMyEvent, removeMyEvent } = useAuth();
  const [form, setForm] = useState(empty);
  const [modal, setModal] = useState<WtdEvent | null>(null);
  const [flash, setFlash] = useState(false);

  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));
  const cat = CAT_MAP[form.category];

  const preview: WtdEvent = {
    id: 'preview',
    slug: 'preview',
    title: form.title || 'Titre de ton évènement',
    category: form.category,
    sub: form.sub || cat.sub[0],
    region: form.region,
    city: form.city || form.region,
    venue: form.venue || 'Lieu à définir',
    lat: (CITY_COORDS[form.city] ?? CITY_COORDS[form.region] ?? CITY_COORDS.Lausanne)[0],
    lng: (CITY_COORDS[form.city] ?? CITY_COORDS[form.region] ?? CITY_COORDS.Lausanne)[1],
    image: form.image || DEFAULT_IMG,
    priceFrom: form.priceFrom ? Number(form.priceFrom) : null,
    dateStart: `${form.date}T${form.time}:00`,
    time: form.time,
    premium: form.premium,
    organizer: user?.name ?? 'Toi',
    popularity: 50,
    capacity: 200,
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
    setFlash(true);
    setTimeout(() => setFlash(false), 2500);
  };

  return (
    <motion.div initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-1">
        <span className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-teal-400">
          <Sparkles size={16} /> Espace organisateur
        </span>
        <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Publie ton évènement</h1>
        <p className="text-violet-700/70">
          Remplis le formulaire, vois l'aperçu en direct, et fais rayonner ton évènement en Suisse romande.
          {!user && <> <Link to="/connexion" className="font-bold text-violet-500 underline">Connecte-toi</Link> pour le sauvegarder.</>}
        </p>
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

          <Field label="Lieu / Salle">
            <input value={form.venue} onChange={(e) => set('venue', e.target.value)} placeholder="Ex : Salle Métropole" className="inp" />
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Date"><input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} className="inp" /></Field>
            <Field label="Heure"><input type="time" value={form.time} onChange={(e) => set('time', e.target.value)} className="inp" /></Field>
            <Field label="Prix (CHF)"><input type="number" min="0" value={form.priceFrom} onChange={(e) => set('priceFrom', e.target.value)} placeholder="Gratuit" className="inp" /></Field>
          </div>

          <Field label="Image (URL)">
            <div className="flex items-center gap-2">
              <ImageIcon className="text-violet-300" size={20} />
              <input value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="https://… (laisse vide pour une image par défaut)" className="inp" />
            </div>
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
                      <p className="truncate text-xs text-violet-400">{e.city} · {CAT_MAP[e.category].short}</p>
                    </div>
                    <button onClick={() => removeMyEvent(e.id)} className="grid h-9 w-9 place-items-center rounded-full text-rose-400 hover:bg-rose-50">
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
