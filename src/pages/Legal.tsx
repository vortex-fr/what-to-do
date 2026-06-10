import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, ScrollText, Sparkles, Mail, MapPin, Database, Cookie, UserCheck, Scale, AlertTriangle, Heart } from 'lucide-react';

/* ---------------------------------------------------------------- */
/*  Gabarit commun                                                   */
/* ---------------------------------------------------------------- */

function LegalShell({
  icon,
  title,
  subtitle,
  updated,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-violet-600 to-violet-700 px-4 py-14 text-center text-white">
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-teal-400/30 blur-3xl" />
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white/15 backdrop-blur">
          {icon}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-2 max-w-xl text-white/80">{subtitle}</p>
        {updated && (
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/60">
            Dernière mise à jour : {updated}
          </p>
        )}
      </section>
      <section className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6">{children}</section>
    </motion.div>
  );
}

function Block({
  icon,
  title,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 rounded-3xl bg-white p-6 shadow-card sm:p-7">
      <h2 className="flex items-center gap-2.5 text-lg font-extrabold text-ink">
        {icon && <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-teal-400 text-white">{icon}</span>}
        {title}
      </h2>
      <div className="mt-3 space-y-2.5 text-[15px] leading-relaxed text-violet-900/75">{children}</div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Termes & conditions                                              */
/* ---------------------------------------------------------------- */

export function Terms() {
  return (
    <LegalShell
      icon={<ScrollText size={28} />}
      title="Termes & conditions"
      subtitle="Les règles du jeu pour profiter de What-to-do.ch sereinement."
      updated="juin 2026"
    >
      <Block icon={<Sparkles size={18} />} title="1. Le service">
        <p>
          What-to-do.ch est une plateforme de découverte d'évènements en Suisse : concerts,
          sorties, sport, famille, business et plus encore. Elle permet de rechercher des
          évènements, de les enregistrer en favoris, de créer des alertes et, pour les
          organisateurs, de publier leurs propres évènements.
        </p>
        <p>
          La billetterie est assurée par les organisateurs ou des prestataires externes ;
          What-to-do.ch redirige vers ces services et n'encaisse aucun paiement.
        </p>
      </Block>

      <Block icon={<UserCheck size={18} />} title="2. Ton compte">
        <p>
          La création d'un compte est gratuite. Tu es responsable de l'exactitude des
          informations fournies et de la confidentialité de tes identifiants. Un compte
          peut être suspendu en cas d'utilisation abusive (spam, contenu illicite,
          usurpation d'identité).
        </p>
      </Block>

      <Block icon={<ScrollText size={18} />} title="3. Publication d'évènements">
        <p>En publiant un évènement, l'organisateur garantit que :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>les informations (date, lieu, prix, capacité) sont exactes et à jour ;</li>
          <li>il détient les droits sur les images et textes fournis ;</li>
          <li>l'évènement respecte le droit suisse et les autorisations locales.</li>
        </ul>
        <p>
          What-to-do.ch se réserve le droit de refuser, modifier la mise en avant ou retirer
          tout contenu non conforme, sans préavis.
        </p>
      </Block>

      <Block icon={<Scale size={18} />} title="4. Responsabilité">
        <p>
          Les évènements sont organisés sous la seule responsabilité de leurs organisateurs.
          What-to-do.ch agit comme intermédiaire de visibilité : nous ne garantissons ni la
          tenue d'un évènement, ni sa qualité, ni la disponibilité des places. Les annulations,
          remboursements et réclamations se traitent directement avec l'organisateur ou la
          billetterie concernée.
        </p>
      </Block>

      <Block icon={<AlertTriangle size={18} />} title="5. Propriété intellectuelle">
        <p>
          La marque What-to-do.ch, le logo, la mascotte Hi-5 et l'interface sont protégés.
          Toute reproduction sans autorisation écrite est interdite. Les contenus publiés par
          les organisateurs restent leur propriété ; ils nous concèdent une licence d'affichage
          sur la plateforme et ses canaux de promotion.
        </p>
      </Block>

      <Block icon={<Scale size={18} />} title="6. Droit applicable">
        <p>
          Ces conditions sont régies par le droit suisse. For juridique : canton de Vaud,
          Suisse, sous réserve de dispositions impératives contraires.
        </p>
        <p className="text-sm text-violet-400">
          Une question sur ces conditions ? Écris-nous :{' '}
          <a href="mailto:hello@what-to-do.ch" className="font-bold text-violet-500 underline">
            hello@what-to-do.ch
          </a>
        </p>
      </Block>
    </LegalShell>
  );
}

/* ---------------------------------------------------------------- */
/*  Politique de confidentialité                                     */
/* ---------------------------------------------------------------- */

export function Privacy() {
  return (
    <LegalShell
      icon={<ShieldCheck size={28} />}
      title="Politique de confidentialité"
      subtitle="Tes données t'appartiennent. Voici exactement ce qu'on collecte — et surtout ce qu'on ne collecte pas."
      updated="juin 2026"
    >
      <Block icon={<Database size={18} />} title="1. Ce qu'on collecte">
        <p>
          What-to-do.ch est conçu selon le principe de minimisation des données de la nouvelle
          loi fédérale sur la protection des données (nLPD) :
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Compte</strong> : ton e-mail et ton prénom, uniquement si tu crées un compte.
          </li>
          <li>
            <strong>Préférences locales</strong> : favoris, alertes et évènements publiés sont
            stockés <em>dans ton navigateur</em> (localStorage), pas sur nos serveurs.
          </li>
          <li>
            <strong>Géolocalisation</strong> : la fonction « Autour de moi » utilise ta position
            uniquement dans ton navigateur, à ta demande explicite. Elle n'est jamais transmise
            ni enregistrée.
          </li>
          <li>
            <strong>Newsletter</strong> : ton e-mail si tu t'inscris, désinscription en un clic.
          </li>
        </ul>
      </Block>

      <Block icon={<Cookie size={18} />} title="2. Cookies & stockage local">
        <p>
          Pas de cookies publicitaires, pas de pisteurs tiers, pas de revente de données. Nous
          utilisons uniquement le stockage local de ton navigateur pour mémoriser tes favoris,
          tes alertes et ta session. La carte interactive charge des fonds de carte depuis
          OpenStreetMap/Carto, soumis à leurs propres conditions.
        </p>
      </Block>

      <Block icon={<UserCheck size={18} />} title="3. Tes droits (nLPD / RGPD)">
        <p>À tout moment, tu peux :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>demander l'accès, la rectification ou la suppression de tes données ;</li>
          <li>retirer ton consentement (newsletter, alertes) ;</li>
          <li>vider tes données locales en supprimant les données de site de ton navigateur ;</li>
          <li>t'adresser au Préposé fédéral à la protection des données (PFPDT) en cas de litige.</li>
        </ul>
        <p>
          Contact :{' '}
          <a href="mailto:privacy@what-to-do.ch" className="font-bold text-violet-500 underline">
            privacy@what-to-do.ch
          </a>
        </p>
      </Block>

      <Block icon={<ShieldCheck size={18} />} title="4. Sécurité & hébergement">
        <p>
          Le site est servi en HTTPS. Les données sont hébergées sur une infrastructure
          européenne conforme. Nous ne partageons aucune donnée personnelle avec des tiers à
          des fins commerciales.
        </p>
      </Block>

      <Block icon={<Heart size={18} />} title="5. En bref">
        <p>
          On veut te dire quoi faire ce weekend, pas suivre ta vie privée. Le strict minimum,
          transparent, chez toi.
        </p>
      </Block>
    </LegalShell>
  );
}

/* ---------------------------------------------------------------- */
/*  À propos                                                         */
/* ---------------------------------------------------------------- */

export function About() {
  return (
    <LegalShell
      icon={<Sparkles size={28} />}
      title="Qui sommes-nous"
      subtitle="La plateforme qui te dit quoi faire — née en Suisse romande, pensée pour toute la Suisse."
    >
      <Block icon={<Sparkles size={18} />} title="Notre mission">
        <p>
          Chaque weekend, des centaines d'évènements géniaux passent inaperçus. What-to-do.ch
          est né d'un constat simple : il manquait un endroit unique, beau et malin pour
          répondre à la question « <em>on fait quoi ce weekend ?</em> ».
        </p>
        <p>
          Concerts, festivals, sport, sorties gourmandes, famille, business : on rassemble tout,
          on filtre par envie, par région et par date, et notre assistant Hi-5 🤙 te souffle
          des idées en quelques secondes.
        </p>
      </Block>

      <Block icon={<MapPin size={18} />} title="Pour les organisateurs">
        <p>
          Publier un évènement prend deux minutes : adresse autocomplétée, image optimisée
          automatiquement, options de prix flexibles, lien billetterie, duplication d'une année
          à l'autre. Les formules premium offrent une mise en avant lumineuse sur la page
          d'accueil et dans les résultats.
        </p>
        <div className="pt-1">
          <Link
            to="/mon-evenement"
            className="inline-block rounded-full bg-gradient-to-r from-violet-500 to-teal-400 px-6 py-3 font-extrabold uppercase tracking-wide text-white shadow-card transition-transform hover:scale-[1.02]"
          >
            Publier mon évènement
          </Link>
        </div>
      </Block>

      <Block icon={<Mail size={18} />} title="Nous contacter">
        <p>
          Une idée, un partenariat, un bug à signaler ?{' '}
          <a href="mailto:hello@what-to-do.ch" className="font-bold text-violet-500 underline">
            hello@what-to-do.ch
          </a>{' '}
          — ou discute directement avec Hi-5 via la bulle en bas à droite.
        </p>
      </Block>
    </LegalShell>
  );
}
