import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, CheckCircle2, CopyPlus, Trash2, UploadCloud, Wand2, X, Search,
  ArrowRight, ArrowLeft, ShieldCheck, PlusCircle, Calendar, Gem, Check,
} from 'lucide-react';
import { CATEGORIES, REGIONS, CAT_MAP, type CategoryId } from '../data/categories';
import { EVENTS, type WtdEvent } from '../data/events';
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
  dateEnd: '', timeEnd: '',
  priceType: 'free' as 'free' | 'from' | 'fixed', priceFrom: '',
  capacity: '', ticketUrl: '',
  image: '', description: '', tags: '',
  lat: null as number | null, lng: null as number | null,
  orgName: '', orgEmail: '', orgPhone: '', cgu: false,
};

const STEPS = ["L'événement", 'Organisateur', 'Détails', 'Publication'];

/** Tarif premium dégressif — « plus t'en prends, moins c'est cher ». */
const NORMAL_RATE = 3.0; // prix normal /jour (référence pour l'économie)
function premiumRate(days: number): number {
  if (days >= 30) return 2.2;
  if (days >= 14) return 2.5;
  if (days >= 7) return 2.7;
  return 2.9;
}

export default function MyEvent() {
  const { user, myEvents, addMyEvent, removeMyEvent } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(empty);
  const [modal, setModal] = useState<WtdEvent | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [imgInfo, setImgInfo] = useState<OptimizedImage | null>(null);
  const [imgBusy, setImgBusy] = useState(false);
  const [imgErr, setImgErr] = useState('');
  const [claimQuery, setClaimQuery] = useState('');
  const [premiumDays, setPremiumDays] = useState(23);
  const [premiumMode, setPremiumMode] = useState<'days' | 'dates' | 'untilEnd'>('days');
  const [premiumStart, setPremiumStart] = useState('');
  const [premiumEnd, setPremiumEnd] = useState('');

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

  // Phase 1 : évènements existants au nom proche
  const matches = useMemo(() => {
    const q = claimQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return EVENTS.filter((e) => e.title.toLowerCase().includes(q)).slice(0, 5);
  }, [claimQuery]);

  const buildEvent = (premium: boolean): WtdEvent => ({
    id: `my-${Date.now()}`,
    slug: `my-${Date.now()}`,
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
    dateEnd: form.dateEnd ? `${form.dateEnd}T${form.timeEnd || form.time}:00` : undefined,
    time: form.time,
    premium,
    organizer: form.orgName || user?.name || 'Toi',
    popularity: 50,
    capacity: form.capacity ? Number(form.capacity) : 200,
    going: 0,
    short: form.description.slice(0, 90),
    description: form.description || 'Décris ton évènement pour donner envie au public de venir !',
    tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
  });

  const preview = buildEvent(true);

  const publish = (premium: boolean) => {
    addMyEvent(buildEvent(premium));
    setForm(empty);
    setImgInfo(null);
    setStep(1);
    setFlash(premium ? '✨ Ton annonce premium est en ligne !' : 'Ton évènement est publié !');
    setTimeout(() => setFlash(null), 3500);
    window.scrollTo({ top: 0 });
  };

  const duplicateNextYear = (e: WtdEvent) => {
    const nextStart = new Date(e.dateStart);
    nextStart.setFullYear(nextStart.getFullYear() + 1);
    addMyEvent({
      ...e,
      id: `my-${Date.now()}`,
      slug: `my-${Date.now()}`,
      dateStart: nextStart.toISOString(),
      dateEnd: e.dateEnd ? new Date(new Date(e.dateEnd).setFullYear(new Date(e.dateEnd).getFullYear() + 1)).toISOString() : undefined,
      going: 0,
    });
    setFlash('Évènement dupliqué pour l\'an prochain !');
    setTimeout(() => setFlash(null), 3000);
  };

  // nombre de jours effectif selon le mode
  const daysFromDates = (() => {
    if (!premiumStart || !premiumEnd) return 0;
    const d = Math.round(
      (new Date(premiumEnd).getTime() - new Date(premiumStart).getTime()) / 86400000
    ) + 1;
    return d > 0 ? d : 0;
  })();
  const untilEndDays = (() => {
    if (!form.dateEnd && !form.date) return 0;
    const endTs = new Date(`${form.dateEnd || form.date}T23:59:59`).getTime();
    const d = Math.ceil((endTs - Date.now()) / 86400000);
    return d > 0 ? d : 1;
  })();
  const effectiveDays =
    premiumMode === 'days' ? premiumDays : premiumMode === 'dates' ? daysFromDates : untilEndDays;
  const rate = premiumRate(effectiveDays);
  const total = effectiveDays * rate;
  const saved = effectiveDays * (NORMAL_RATE - rate);

  const canNext =
    (step === 2 && form.orgName && form.orgEmail) ||
    (step === 3 && form.title && form.sub && form.cgu) ||
    step === 1;

  return (
    <motion.div initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* En-tête */}
      <div className="mb-6 flex items-start gap-4">
        <Mascot pose="idea" size={84} className="hidden shrink-0 sm:block" />
        <div>
          <span className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-teal-400">
            <Sparkles size={16} /> Espace organisateur
          </span>
          <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Publie ton évènement</h1>
          <p className="text-violet-700/70">
            En 4 étapes simples.
            {!user && <> <Link to="/connexion" className="font-bold text-violet-500 underline">Connecte-toi</Link> pour sauvegarder tes évènements.</>}
          </p>
        </div>
      </div>

      {flash && (
        <p className="mb-6 flex animate-pop items-center justify-center gap-2 rounded-2xl bg-teal-100 py-3 font-bold text-teal-600">
          <CheckCircle2 size={18} /> {flash}
        </p>
      )}

      {/* Stepper */}
      <div className="mb-8 flex items-center">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <button
                onClick={() => n < step && setStep(n)}
                className="flex shrink-0 flex-col items-center gap-1.5"
                disabled={n > step}
              >
                <span
                  className={`grid h-10 w-10 place-items-center rounded-full text-sm font-extrabold transition-colors ${
                    active
                      ? 'bg-gradient-to-br from-violet-500 to-teal-400 text-white shadow-card'
                      : done
                        ? 'bg-teal-400 text-white'
                        : 'bg-violet-100 text-violet-400'
                  }`}
                >
                  {done ? <Check size={18} /> : n}
                </span>
                <span className={`hidden text-xs font-bold sm:block ${active ? 'text-violet-700' : 'text-violet-400'}`}>
                  {label}
                </span>
              </button>
              {n < STEPS.length && (
                <span className={`mx-2 h-0.5 flex-1 rounded-full ${done ? 'bg-teal-400' : 'bg-violet-100'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <AnimatePresence mode="wait">
            {/* -------------------- PHASE 1 -------------------- */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
                <h2 className="text-xl font-extrabold text-ink">Ton événement existe-t-il déjà sur What-to-do.ch ?</h2>
                <p className="mt-1 text-violet-700/70">Vérifie avant de créer un doublon — tu pourras le revendiquer.</p>

                <div className="mt-5 flex items-center gap-2 rounded-2xl border-[1.5px] border-violet-100 bg-[#faf8ff] px-4 py-3 focus-within:border-violet-400 focus-within:bg-white">
                  <Search size={18} className="text-violet-400" />
                  <input
                    value={claimQuery}
                    onChange={(e) => setClaimQuery(e.target.value)}
                    placeholder="Cherche le nom de ton événement…"
                    className="w-full bg-transparent font-medium outline-none placeholder:text-violet-300"
                  />
                </div>

                {matches.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {matches.map((e) => (
                      <div key={e.id} className="flex items-center gap-3 rounded-2xl border border-violet-100 p-2.5">
                        <img src={e.image} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-ink">{e.title}</p>
                          <p className="truncate text-xs text-violet-400">{e.city} · {CAT_MAP[e.category].short}</p>
                        </div>
                        <button
                          onClick={() => navigate(`/verification-organisateur?event=${e.slug}`)}
                          className="shrink-0 rounded-full bg-gradient-to-r from-violet-500 to-teal-400 px-4 py-2 text-sm font-bold text-white"
                        >
                          Je gère cet event
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {claimQuery.trim().length >= 2 && matches.length === 0 && (
                  <p className="mt-4 rounded-2xl bg-violet-50 p-3 text-sm text-violet-500">
                    Aucun événement existant à ce nom. Crée-le ci-dessous 👇
                  </p>
                )}

                <button
                  onClick={() => { setForm((f) => ({ ...f, title: claimQuery || f.title })); setStep(2); }}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-teal-400 py-4 font-extrabold uppercase tracking-wide text-white shadow-card transition-transform hover:scale-[1.01]"
                >
                  <PlusCircle size={20} /> Créer un nouvel événement
                </button>
              </motion.div>
            )}

            {/* -------------------- PHASE 2 -------------------- */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 rounded-3xl bg-white p-6 shadow-card sm:p-8">
                <div>
                  <h2 className="text-xl font-extrabold text-ink">Tes informations d'organisateur</h2>
                  <p className="mt-1 text-violet-700/70">Pour te contacter et sécuriser la gestion de ton événement.</p>
                </div>
                <Field label="Nom / Organisation">
                  <input required value={form.orgName} onChange={(e) => set('orgName', e.target.value)} placeholder="Ex : Association Culturelle Léman" className="inp" />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Email">
                    <input required type="email" value={form.orgEmail} onChange={(e) => set('orgEmail', e.target.value)} placeholder="toi@exemple.ch" className="inp" />
                  </Field>
                  <Field label="Téléphone">
                    <input type="tel" value={form.orgPhone} onChange={(e) => set('orgPhone', e.target.value)} placeholder="+41 …" className="inp" />
                  </Field>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-violet-50 p-4 text-sm text-violet-600">
                  <ShieldCheck size={20} className="mt-0.5 shrink-0 text-teal-500" />
                  <span>
                    Tes coordonnées restent privées. Pour revendiquer un événement existant, une{' '}
                    <Link to="/verification-organisateur" className="font-bold underline">vérification d'organisateur</Link>{' '}
                    est requise.
                  </span>
                </div>
              </motion.div>
            )}

            {/* -------------------- PHASE 3 -------------------- */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 rounded-3xl bg-white p-6 shadow-card sm:p-8">
                <h2 className="text-xl font-extrabold text-ink">Les infos de ton événement</h2>

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
                    <select required value={form.sub} onChange={(e) => set('sub', e.target.value)} className="inp">
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
                    onSelect={(p) => setForm((f) => ({ ...f, venue: p.venue || p.label.split(',')[0], city: p.city || f.city, lat: p.lat, lng: p.lng }))}
                  />
                  <p className="mt-1 text-xs text-violet-400">Salles connues + adresses de toute la Suisse{form.lat ? ' · 📍 localisé' : ''}</p>
                </Field>

                {/* Début / fin (corr. Ben) */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Date de début"><input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} className="inp" /></Field>
                  <Field label="Heure de début"><input type="time" value={form.time} onChange={(e) => set('time', e.target.value)} className="inp" /></Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Date de fin (optionnel)"><input type="date" value={form.dateEnd} onChange={(e) => set('dateEnd', e.target.value)} className="inp" /></Field>
                  <Field label="Heure de fin (optionnel)"><input type="time" value={form.timeEnd} onChange={(e) => set('timeEnd', e.target.value)} className="inp" /></Field>
                </div>

                {/* Prix */}
                <Field label="Prix">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex gap-1 rounded-full bg-violet-100 p-1">
                      {([['free', 'Gratuit'], ['from', 'Dès…'], ['fixed', 'Prix fixe']] as const).map(([v, l]) => (
                        <button key={v} type="button" onClick={() => set('priceType', v)} className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${form.priceType === v ? 'bg-white text-violet-700 shadow' : 'text-violet-500'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                    {form.priceType !== 'free' && (
                      <div className="flex items-center gap-2">
                        <input type="number" min="0" value={form.priceFrom} onChange={(e) => set('priceFrom', e.target.value)} placeholder="CHF" className="inp !w-28" />
                        <span className="font-bold text-violet-400">CHF</span>
                      </div>
                    )}
                  </div>
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Taille (places)"><input type="number" min="1" value={form.capacity} onChange={(e) => set('capacity', e.target.value)} placeholder="Ex : 200" className="inp" /></Field>
                  <Field label="URL billetterie (optionnel)"><input type="url" value={form.ticketUrl} onChange={(e) => set('ticketUrl', e.target.value)} placeholder="https://billetterie.ch/…" className="inp" /></Field>
                </div>

                <Field label="Image de l'évènement">
                  {form.image && form.image.startsWith('data:') ? (
                    <div className="relative overflow-hidden rounded-2xl border-[1.5px] border-violet-100">
                      <img src={form.image} alt="aperçu" className="h-44 w-full object-cover" />
                      <button type="button" onClick={() => { setForm((f) => ({ ...f, image: '' })); setImgInfo(null); }} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-rose-500 shadow hover:bg-white">
                        <X size={16} />
                      </button>
                      {imgInfo && (
                        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-xs font-semibold text-white">
                          <Wand2 size={14} className="text-teal-300" /> Optimisée : {formatBytes(imgInfo.originalBytes)} → {formatBytes(imgInfo.optimizedBytes)}
                          {imgInfo.saved > 0.02 && <span className="rounded-full bg-teal-400/90 px-2 py-0.5 text-[11px] font-extrabold text-white">−{Math.round(imgInfo.saved * 100)}%</span>}
                        </div>
                      )}
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-violet-200 bg-[#faf8ff] px-4 py-7 text-center transition-colors hover:border-violet-400 hover:bg-violet-50">
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFile(e.target.files?.[0])} />
                      {imgBusy ? <span className="font-semibold text-violet-500">Optimisation…</span> : (
                        <>
                          <UploadCloud className="text-violet-400" size={28} />
                          <span className="font-bold text-violet-600">Dépose une image ou clique</span>
                          <span className="text-xs text-violet-400">Même une image lourde : optimisée automatiquement.</span>
                        </>
                      )}
                    </label>
                  )}
                  {imgErr && <p className="mt-1 text-xs font-semibold text-rose-500">{imgErr}</p>}
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Tags (virgules)"><input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="Concert, Live, Été" className="inp" /></Field>
                  <div />
                </div>
                <Field label="Description">
                  <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} placeholder="Raconte ton évènement…" className="inp resize-none" />
                </Field>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-violet-50 p-3">
                  <input type="checkbox" checked={form.cgu} onChange={(e) => set('cgu', e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-violet-500" />
                  <span className="text-sm text-violet-700">
                    J'accepte les <Link to="/termes-et-conditions" className="font-bold underline">conditions générales</Link> et je certifie être autorisé·e à publier cet événement.
                  </span>
                </label>
              </motion.div>
            )}

            {/* -------------------- PHASE 4 -------------------- */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="mb-1 text-xl font-extrabold text-ink">Comment veux-tu publier ?</h2>
                <p className="mb-6 text-violet-700/70">Active le premium pour faire briller ton annonce, ou publie gratuitement.</p>

                <div className="grid gap-5 md:grid-cols-2">
                  {/* PREMIUM */}
                  <div className="card-glow is-premium relative overflow-hidden rounded-[26px] bg-white p-6 shadow-card" style={{ ['--glow' as string]: 'linear-gradient(120deg,#a05cd5,#54c4be)' }}>
                    <Mascot pose="chill" size={128} animated={false} className="mx-auto" />
                    <h3 className="mt-1 text-center text-lg font-extrabold uppercase tracking-wide text-transparent [background:linear-gradient(90deg,#8b5fbf,#54c4be)] [-webkit-background-clip:text] [background-clip:text]">
                      Annonce premium
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm font-semibold text-violet-800">
                      {['Fait briller ton annonce de mille feux', 'Ton événement en première page de ta région', 'Ton visuel au format XL'].map((b) => (
                        <li key={b} className="flex items-center justify-center gap-2 text-center">
                          <Gem size={15} className="shrink-0 text-teal-400" /> {b}
                        </li>
                      ))}
                    </ul>

                    <p className="mt-5 text-center text-sm font-extrabold text-ink">Tu gères ton abonnement premium :</p>

                    <div className="mt-3 grid grid-cols-3 gap-1 rounded-full bg-violet-100 p-1 text-xs font-bold">
                      {([['days', 'Nb de jours'], ['dates', 'Programmer'], ['untilEnd', "Jusqu'à la fin"]] as const).map(([v, l]) => (
                        <button key={v} type="button" onClick={() => setPremiumMode(v)} className={`rounded-full py-2 transition-colors ${premiumMode === v ? 'bg-white text-violet-700 shadow' : 'text-violet-500'}`}>
                          {l}
                        </button>
                      ))}
                    </div>

                    {/* Choix de la durée selon le mode */}
                    {premiumMode === 'days' && (
                      <div className="mt-3 flex items-center justify-center gap-3 rounded-2xl bg-violet-50 px-4 py-2">
                        <button type="button" onClick={() => setPremiumDays((d) => Math.max(1, d - 1))} className="grid h-8 w-8 place-items-center rounded-full bg-white text-lg font-extrabold text-violet-500 shadow">−</button>
                        <input type="number" min={1} max={365} value={premiumDays} onChange={(e) => setPremiumDays(Math.max(1, Math.min(365, Number(e.target.value) || 1)))} className="w-16 bg-transparent text-center text-2xl font-extrabold text-violet-600 outline-none" />
                        <span className="text-sm font-bold text-violet-400">jours</span>
                        <button type="button" onClick={() => setPremiumDays((d) => Math.min(365, d + 1))} className="grid h-8 w-8 place-items-center rounded-full bg-white text-lg font-extrabold text-violet-500 shadow">+</button>
                      </div>
                    )}
                    {premiumMode === 'dates' && (
                      <div className="mt-3 flex items-center gap-2 rounded-2xl bg-violet-50 p-3">
                        <Calendar size={16} className="shrink-0 text-violet-400" />
                        <input type="date" value={premiumStart} onChange={(e) => setPremiumStart(e.target.value)} className="w-full rounded-lg border border-violet-200 bg-white px-2 py-1.5 text-xs font-semibold outline-none" />
                        <span className="text-xs font-bold text-violet-400">au</span>
                        <input type="date" value={premiumEnd} onChange={(e) => setPremiumEnd(e.target.value)} className="w-full rounded-lg border border-violet-200 bg-white px-2 py-1.5 text-xs font-semibold outline-none" />
                      </div>
                    )}
                    {premiumMode === 'untilEnd' && (
                      <p className="mt-3 rounded-2xl bg-violet-50 p-3 text-center text-sm font-semibold text-violet-600">
                        Premium jusqu'à la fin de ton événement{effectiveDays ? ` (≈ ${effectiveDays} j)` : ''}.
                      </p>
                    )}

                    {/* Récap prix */}
                    <div className="mt-3 flex items-stretch gap-3 rounded-2xl bg-gradient-to-br from-violet-500/10 to-teal-400/10 p-4">
                      <div className="flex-1 text-center">
                        <div className="text-3xl font-extrabold text-violet-600">{effectiveDays || '—'}</div>
                        <div className="text-xs font-bold uppercase text-violet-400">jours</div>
                      </div>
                      <div className="w-px bg-violet-200" />
                      <div className="flex-1 text-center">
                        <div className="text-3xl font-extrabold text-teal-500">{total.toFixed(2)}</div>
                        <div className="text-xs font-bold uppercase text-violet-400">CHF</div>
                      </div>
                    </div>
                    <p className="mt-2 text-center text-xs font-bold text-teal-600">
                      {rate.toFixed(2)}/j{saved > 0.01 ? ` · ${saved.toFixed(0)}.– économisé` : ''}
                    </p>
                    <p className="text-center text-[11px] text-violet-400">Plus tu en prends, moins c'est cher.</p>

                    <button
                      onClick={() => effectiveDays > 0 && publish(true)}
                      disabled={effectiveDays <= 0}
                      className={`mt-5 w-full rounded-full py-3.5 font-extrabold uppercase tracking-wide text-white shadow-card transition-transform ${
                        effectiveDays > 0 ? 'bg-gradient-to-r from-violet-500 to-violet-600 hover:scale-[1.02]' : 'cursor-not-allowed bg-violet-200'
                      }`}
                    >
                      Je publie premium
                    </button>
                  </div>

                  {/* CLASSIQUE */}
                  <div className="rounded-[26px] border-2 border-violet-100 bg-white p-6 text-center shadow-card">
                    <Mascot pose="app" size={128} animated={false} className="mx-auto" />
                    <h3 className="mt-1 text-lg font-extrabold uppercase tracking-wide text-violet-500">Annonce classique</h3>
                    <p className="mx-auto mt-4 max-w-[220px] text-violet-700/75">
                      Ton annonce est publiée gratuitement jusqu'à la fin de ton événement.
                    </p>
                    <button onClick={() => publish(false)} className="mt-8 w-full rounded-full border-2 border-violet-300 py-3.5 font-extrabold uppercase tracking-wide text-violet-600 transition-colors hover:bg-violet-50">
                      Je publie gratuitement
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {step < 4 && (
            <div className="mt-6 flex items-center justify-between">
              {step > 1 ? (
                <button onClick={() => setStep((s) => s - 1)} className="flex items-center gap-2 rounded-full px-5 py-3 font-bold text-violet-500 hover:bg-violet-100">
                  <ArrowLeft size={18} /> Précédent
                </button>
              ) : <span />}
              {step > 1 && (
                <button
                  onClick={() => canNext && setStep((s) => s + 1)}
                  disabled={!canNext}
                  className={`flex items-center gap-2 rounded-full px-7 py-3 font-extrabold uppercase tracking-wide text-white shadow-card transition-transform ${
                    canNext ? 'bg-gradient-to-r from-violet-500 to-teal-400 hover:scale-[1.02]' : 'cursor-not-allowed bg-violet-200'
                  }`}
                >
                  {step === 3 ? 'Publication' : 'Suivant'} <ArrowRight size={18} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Aperçu + mes évènements */}
        <aside className="space-y-6">
          {step >= 3 && (
            <div>
              <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-violet-400">Aperçu en direct</h3>
              <PremiumCard ev={preview} onOpen={setModal} />
            </div>
          )}
          <div>
            <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-violet-400">Mes évènements ({myEvents.length})</h3>
            {myEvents.length === 0 ? (
              <p className="rounded-2xl bg-white p-4 text-sm text-violet-400 shadow-card">Tu n'as pas encore publié d'évènement.</p>
            ) : (
              <div className="space-y-3">
                {myEvents.map((e) => (
                  <div key={e.id} className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-card">
                    <img src={e.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-ink">{e.title}</p>
                      <p className="truncate text-xs text-violet-400">{e.city} · {CAT_MAP[e.category].short}{e.premium ? ' · ✨' : ''}</p>
                    </div>
                    <button onClick={() => duplicateNextYear(e)} title="Dupliquer pour l'an prochain" className="grid h-9 w-9 place-items-center rounded-full text-violet-500 hover:bg-violet-50">
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
