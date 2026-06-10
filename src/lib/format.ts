const MONTHS = [
  'jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
];
const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export function formatDateRange(startISO: string, endISO?: string): string {
  const s = new Date(startISO);
  if (endISO) {
    const e = new Date(endISO);
    return `${s.getDate()} ${MONTHS[s.getMonth()]}. — ${e.getDate()} ${MONTHS[e.getMonth()]}. ${e.getFullYear()}`;
  }
  return `${DAYS[s.getDay()]} ${s.getDate()} ${MONTHS[s.getMonth()]}`;
}

export function formatLongDate(startISO: string): string {
  const s = new Date(startISO);
  return `${DAYS[s.getDay()]} ${s.getDate()} ${MONTHS[s.getMonth()]} ${s.getFullYear()}`;
}

import type { PriceType } from '../data/events';

export function formatPrice(p: number | null, type?: PriceType): string {
  if (p === null || type === 'free') return 'Gratuit';
  if (type === 'fixed') return `${p}.- CHF`;
  return `Dès ${p}.- CHF`;
}

export function formatPriceShort(p: number | null, type?: PriceType): string {
  if (p === null || type === 'free') return 'Gratuit';
  return `${p}.- CHF`;
}
