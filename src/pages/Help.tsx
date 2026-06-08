import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, MessageCircle, Mail, Search, LifeBuoy, Ticket, CreditCard, UserCog } from 'lucide-react';

const TOPICS = [
  { i: Ticket, t: 'Réservations', d: 'Billets, places, annulations' },
  { i: CreditCard, t: 'Paiements', d: 'Moyens de paiement, remboursements' },
  { i: UserCog, t: 'Mon compte', d: 'Profil, favoris, notifications' },
  { i: LifeBuoy, t: 'Organisateurs', d: 'Publier & gérer un évènement' },
];

const FAQ = [
  { q: 'Comment trouver un évènement près de chez moi ?', a: 'Utilise la barre de recherche ou la carte interactive sur la page Événements. Filtre par région, catégorie et date pour affiner. Tu peux aussi demander à notre chatbot Hi-5 !' },
  { q: 'Comment réserver une place ?', a: 'Ouvre la fiche de l\'évènement et clique sur « Je réserve ». Dans cette version de démonstration, la réservation est simulée et aucune transaction réelle n\'est effectuée.' },
  { q: 'Comment publier mon propre évènement ?', a: 'Rends-toi dans « Mon événement », remplis le formulaire et vois l\'aperçu en direct. Connecte-toi pour sauvegarder et gérer tes évènements.' },
  { q: 'Qu\'est-ce qu\'un évènement premium ?', a: 'Les évènements premium bénéficient d\'une mise en avant : carte avec halo coloré, couronne dorée et présence dans le carrousel de la page d\'accueil.' },
  { q: 'Comment ajouter un évènement à mes favoris ?', a: 'Clique sur le cœur ♥ sur n\'importe quelle carte. Retrouve tous tes favoris dans l\'onglet dédié, synchronisés sur ton appareil.' },
  { q: 'Qui est Hi-5 ?', a: 'Hi-5 est notre mascotte et assistant. Clique sur la bulle en bas à droite : il te recommande des sorties selon tes envies en quelques secondes 🤙' },
];

export default function Help() {
  const [open, setOpen] = useState<number | null>(0);
  const [q, setQ] = useState('');
  const filtered = FAQ.filter((f) => (f.q + f.a).toLowerCase().includes(q.toLowerCase()));

  return (
    <motion.div initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-violet-600 to-violet-700 px-4 py-16 text-center text-white sm:py-20">
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-teal-400/30 blur-3xl" />
        <img src="/assets/mascot.png" alt="Hi-5" className="mx-auto h-24 w-24 animate-floaty object-contain drop-shadow-xl" />
        <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">Centre d'aide</h1>
        <p className="mt-2 text-white/80">Une question ? On a la réponse. Sinon, Hi-5 s'en charge.</p>
        <div className="mx-auto mt-6 flex max-w-xl items-center gap-2 rounded-full bg-white p-2 shadow-glow">
          <Search className="ml-3 text-violet-400" size={20} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher dans l'aide…" className="w-full bg-transparent py-2 text-ink outline-none placeholder:text-violet-300" />
        </div>
      </section>

      {/* Topics */}
      <section className="mx-auto -mt-8 max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TOPICS.map((t) => (
            <div key={t.t} className="rounded-2xl bg-white p-5 text-center shadow-card transition-transform hover:-translate-y-1">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-teal-400 text-white">
                <t.i size={22} />
              </span>
              <h3 className="mt-3 font-extrabold text-ink">{t.t}</h3>
              <p className="text-xs text-violet-400">{t.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h2 className="mb-6 text-2xl font-extrabold text-ink">Questions fréquentes</h2>
        <div className="space-y-3">
          {filtered.map((f, i) => (
            <div key={f.q} className="overflow-hidden rounded-2xl bg-white shadow-card">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-bold text-ink"
              >
                {f.q}
                <ChevronDown size={20} className={`shrink-0 text-violet-400 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="overflow-hidden px-5 pb-5 text-violet-900/70">
                  {f.a}
                </motion.div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="rounded-2xl bg-white p-6 text-center text-violet-400 shadow-card">Aucun résultat. Pose ta question à Hi-5 !</p>
          )}
        </div>

        {/* Contact */}
        <div className="mt-10 grid gap-4 rounded-3xl bg-gradient-to-br from-teal-300 to-teal-500 p-8 text-white sm:grid-cols-2">
          <div>
            <h3 className="text-2xl font-extrabold">Toujours bloqué·e ?</h3>
            <p className="mt-1 text-white/85">Notre équipe et Hi-5 sont là pour toi, 7j/7.</p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end sm:justify-center">
            <a href="mailto:hello@what-to-do.ch" className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-teal-600">
              <Mail size={18} /> hello@what-to-do.ch
            </a>
            <Link to="/" className="flex items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3 font-bold text-white">
              <MessageCircle size={18} /> Parler à Hi-5
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
