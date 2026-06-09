import { EVENTS, type WtdEvent } from '../data/events';
import { CATEGORIES, REGIONS, CAT_MAP, type CategoryId } from '../data/categories';

export interface Interpretation {
  text: string; // Hi-5's reply
  events: WtdEvent[]; // best matches (max 3)
  filterUrl: string; // link to the full filtered list
  understood: { category?: CategoryId; region?: string; free?: boolean; when?: string };
}

const CAT_KEYWORDS: Record<CategoryId, string[]> = {
  culture: ['concert', 'musique', 'festival', 'théât', 'theatre', 'ciné', 'cine', 'expo', 'musée', 'musee', 'humour', 'stand-up', 'standup', 'danse', 'gaming', 'jeux', 'spectacle', 'art', 'culture'],
  gastronomie: ['resto', 'restaurant', 'bar', 'club', 'soir', 'nuit', 'fête', 'fete', 'boire', 'vin', 'dégust', 'degust', 'brunch', 'afterwork', 'apéro', 'apero', 'food', 'manger', 'gastro', 'cocktail'],
  sport: ['sport', 'run', 'course', 'trail', 'rando', 'vélo', 'velo', 'vtt', 'ski', 'yoga', 'fitness', 'nautique', 'paddle', 'escalade', 'montagne', 'bouger', 'outdoor'],
  famille: ['famille', 'enfant', 'kids', 'marché', 'marche', 'brocante', 'atelier', 'parc', 'caritat', 'solidaire', 'quartier', 'bénévol', 'benevol', 'noël', 'noel'],
  business: ['business', 'conf', 'startup', 'tech', 'workshop', 'formation', 'emploi', 'job', 'recrut', 'immobilier', 'finance', 'crypto', 'ia', 'networking', 'salon', 'pro'],
};

const WHEN_WORDS: { re: RegExp; label: string; key: string }[] = [
  { re: /(ce soir|tonight|cette nuit)/i, label: 'ce soir', key: 'soir' },
  { re: /(ce week-?end|samedi|dimanche|weekend)/i, label: 'ce week-end', key: 'weekend' },
  { re: /(cette semaine|semaine)/i, label: 'cette semaine', key: 'week' },
  { re: /(ce mois|mois-ci)/i, label: 'ce mois-ci', key: 'month' },
];

export function interpret(raw: string): Interpretation {
  const q = raw.toLowerCase().trim();

  // category
  let category: CategoryId | undefined;
  let bestHits = 0;
  for (const c of CATEGORIES) {
    const hits = CAT_KEYWORDS[c.id].filter((k) => q.includes(k)).length;
    if (hits > bestHits) {
      bestHits = hits;
      category = c.id;
    }
  }

  // region
  const region = REGIONS.find((r) => q.includes(r.toLowerCase()));

  // free
  const free = /(gratuit|gratos|free|sans payer|0 ?chf)/i.test(q);

  // when
  const when = WHEN_WORDS.find((w) => w.re.test(q));

  // score events
  const now = new Date();
  let list = EVENTS.filter((e) => {
    if (category && e.category !== category) return false;
    if (region && e.region !== region && e.city !== region) return false;
    if (free && e.priceFrom !== null) return false;
    if (when) {
      const diff = (new Date(e.dateStart).getTime() - now.getTime()) / 86400000;
      const cap = when.key === 'soir' ? 1.5 : when.key === 'weekend' ? 9 : when.key === 'week' ? 7 : 31;
      if (diff < -1 || diff > cap) return false;
    }
    return true;
  });

  // free-text fallback: match keywords against title/tags/city
  if (!category && !region && !free && !when && q.length > 1) {
    const tokens = q.split(/\s+/).filter((t) => t.length > 2);
    list = EVENTS.filter((e) => {
      const hay = `${e.title} ${e.city} ${e.sub} ${e.tags.join(' ')}`.toLowerCase();
      return tokens.some((t) => hay.includes(t));
    });
  }

  list = [...list].sort((a, b) => b.popularity - a.popularity);
  let events = list.slice(0, 3);
  let relaxed = false;

  // Graceful relaxation: if the strict filter found nothing, keep the
  // category/region intent but drop the date/price constraint.
  if (events.length === 0 && (category || region || free || when)) {
    const fb = EVENTS.filter((e) => {
      if (category && e.category !== category) return false;
      if (region && e.region !== region && e.city !== region) return false;
      return true;
    }).sort((a, b) => +new Date(a.dateStart) - +new Date(b.dateStart));
    events = fb.slice(0, 3);
    relaxed = events.length > 0;
  }

  // build URL
  const params = new URLSearchParams();
  if (category) params.set('cat', category);
  if (raw && !category && !region) params.set('q', raw);
  const filterUrl = `/evenements${params.toString() ? `?${params}` : ''}`;

  // craft reply
  const bits: string[] = [];
  if (category) bits.push(CAT_MAP[category].label.toLowerCase());
  if (region) bits.push(`à ${region}`);
  if (free) bits.push('gratuit');
  if (when) bits.push(when.label);

  let text: string;
  if (events.length === 0) {
    text = `Hmm, je n'ai rien trouvé${bits.length ? ` pour « ${bits.join(', ')} »` : ''} 🤔 Essaie autre chose ou explore tout le catalogue !`;
  } else if (relaxed) {
    const focus = [category && CAT_MAP[category].label.toLowerCase(), region && `à ${region}`].filter(Boolean).join(' ');
    text = `Rien de pile poil sur cette date${focus ? '' : ''} 😅 mais voici les meilleurs ${focus || 'évènements'} à venir 👇`;
  } else if (bits.length) {
    text = `Top ! Voici ce que j'ai trouvé pour ${bits.join(', ')} 👇`;
  } else {
    text = `J'ai déniché ça pour toi 👇`;
  }

  return {
    text,
    events,
    filterUrl,
    understood: { category, region, free, when: when?.label },
  };
}
