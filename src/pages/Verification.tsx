import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Globe, Mail, Phone, FileText, AtSign, Building2, CheckCircle2, ArrowRight,
} from 'lucide-react';
import { getEvent } from '../data/events';
import { CAT_MAP } from '../data/categories';
import Mascot from '../components/Mascot';

const LEVELS = [
  {
    icon: AtSign,
    title: 'Niveau 1 — Revendication',
    body: 'Tu indiques être l\'organisateur : nom, email et téléphone. Aucun accès n\'est accordé immédiatement.',
  },
  {
    icon: Globe,
    title: 'Niveau 2 — Vérification automatique',
    body: 'Code de vérification sur ton site officiel, email au domaine officiel, ou code dans la bio de tes réseaux sociaux.',
  },
  {
    icon: FileText,
    title: 'Niveau 3 — Vérification documentaire',
    body: 'Registre du commerce, contrat de location, autorisation communale ou tout justificatif d\'organisation.',
  },
];

const SCORE = [
  { i: FileText, label: 'Document officiel', pts: 100 },
  { i: Globe, label: 'Site web vérifié', pts: 50 },
  { i: Building2, label: 'Validation manuelle', pts: 50 },
  { i: Mail, label: 'Email domaine officiel', pts: 40 },
  { i: AtSign, label: 'Réseau social vérifié', pts: 30 },
  { i: Phone, label: 'Téléphone officiel', pts: 20 },
];

const METHODS = [
  { id: 'website', icon: Globe, label: 'Site web officiel', desc: 'Ajoute un code sur ton site', pts: 50 },
  { id: 'email', icon: Mail, label: 'Email professionnel', desc: 'Domaine officiel de l\'événement', pts: 40 },
  { id: 'social', icon: AtSign, label: 'Réseau social', desc: 'Code dans la bio Insta/FB', pts: 30 },
  { id: 'doc', icon: FileText, label: 'Document officiel', desc: 'Registre, contrat, autorisation', pts: 100 },
];

const THRESHOLD = 70;

export default function Verification() {
  const [params] = useSearchParams();
  const ev = getEvent(params.get('event') ?? '');
  const [selected, setSelected] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  const score = METHODS.filter((m) => selected.includes(m.id)).reduce((s, m) => s + m.pts, 0);
  const pass = score >= THRESHOLD;

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <motion.div initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-violet-600 to-violet-700 px-4 py-14 text-center text-white">
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-teal-400/30 blur-3xl" />
        <Mascot pose="confiance" size={112} className="mx-auto drop-shadow-xl" />
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Vérification organisateur</h1>
        <p className="mx-auto mt-2 max-w-2xl text-white/80">
          On vérifie que tu es bien autorisé·e à gérer un événement avant de te donner accès à ses
          informations — comme le fait Google avec les fiches d'établissement.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Event revendiqué */}
        {ev && (
          <div className="mb-6 flex items-center gap-3 rounded-3xl bg-white p-3 shadow-card">
            <img src={ev.image} alt="" className="h-16 w-16 rounded-2xl object-cover" />
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase text-violet-400">Tu revendiques</p>
              <p className="truncate text-lg font-extrabold text-ink">{ev.title}</p>
              <p className="truncate text-sm text-violet-400">{ev.city} · {CAT_MAP[ev.category].short}</p>
            </div>
          </div>
        )}

        {/* Niveaux */}
        <h2 className="mb-3 text-xl font-extrabold text-ink">Comment ça marche</h2>
        <div className="space-y-3">
          {LEVELS.map((l) => (
            <div key={l.title} className="flex gap-3 rounded-2xl bg-white p-5 shadow-card">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-teal-400 text-white">
                <l.icon size={20} />
              </span>
              <div>
                <h3 className="font-extrabold text-ink">{l.title}</h3>
                <p className="mt-0.5 text-sm text-violet-700/75">{l.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Vérification interactive (score) */}
        <h2 className="mb-1 mt-10 text-xl font-extrabold text-ink">Vérifie-toi maintenant</h2>
        <p className="mb-4 text-violet-700/70">
          Sélectionne les preuves que tu peux fournir. Il faut {THRESHOLD} points pour obtenir l'accès.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {METHODS.map((m) => {
            const on = selected.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggle(m.id)}
                className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
                  on ? 'border-teal-400 bg-teal-50' : 'border-violet-100 bg-white hover:border-violet-300'
                }`}
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${on ? 'bg-teal-400 text-white' : 'bg-violet-100 text-violet-500'}`}>
                  <m.icon size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-ink">{m.label}</span>
                  <span className="block text-xs text-violet-400">{m.desc}</span>
                </span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-extrabold ${on ? 'bg-teal-400 text-white' : 'bg-violet-100 text-violet-500'}`}>
                  +{m.pts}
                </span>
              </button>
            );
          })}
        </div>

        {/* Score */}
        <div className="mt-5 rounded-3xl bg-white p-5 shadow-card">
          <div className="mb-2 flex items-center justify-between text-sm font-bold text-violet-600">
            <span>Score de confiance</span>
            <span className={pass ? 'text-teal-600' : 'text-violet-400'}>{score} / {THRESHOLD} pts</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-violet-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pass ? 'bg-teal-400' : 'bg-gradient-to-r from-violet-500 to-teal-400'}`}
              style={{ width: `${Math.min(100, (score / THRESHOLD) * 100)}%` }}
            />
          </div>
          {sent ? (
            <p className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-teal-100 py-3 font-bold text-teal-600">
              <CheckCircle2 size={18} /> Demande envoyée ! On revient vers toi sous 48h (simulation).
            </p>
          ) : (
            <button
              onClick={() => setSent(true)}
              disabled={!pass}
              className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-extrabold uppercase tracking-wide text-white shadow-card transition-transform ${
                pass ? 'bg-gradient-to-r from-violet-500 to-teal-400 hover:scale-[1.01]' : 'cursor-not-allowed bg-violet-200'
              }`}
            >
              <ShieldCheck size={18} /> {pass ? 'Envoyer ma demande de vérification' : `Encore ${THRESHOLD - score} pts`}
            </button>
          )}
        </div>

        {/* Barème */}
        <details className="mt-6 rounded-3xl bg-white p-5 shadow-card">
          <summary className="cursor-pointer font-bold text-ink">Barème de points & petits événements</summary>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {SCORE.map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-sm text-violet-700/80">
                <s.i size={15} className="text-teal-400" /> {s.label}
                <span className="ml-auto font-bold text-violet-500">{s.pts} pts</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-violet-700/70">
            <strong>Petits événements locaux :</strong> sans site ni domaine professionnel, on
            confirme ton identité via un moyen public connu (site communal, page Facebook, affiche,
            organisateur annoncé publiquement).
          </p>
        </details>

        <div className="mt-8 text-center">
          <Link to="/mon-evenement" className="inline-flex items-center gap-2 font-bold text-violet-500 hover:text-violet-700">
            Retour à la publication <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </motion.div>
  );
}
