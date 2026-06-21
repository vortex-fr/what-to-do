import { useEffect, useState } from 'react';

export type CountdownPhase = 'before' | 'live' | 'ended';

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean; // compat : true dès que l'évènement a commencé
  phase: CountdownPhase;
}

/**
 * Avant le début : compte à rebours jusqu'au début.
 * Pendant l'évènement (start <= now < end) : compteur « à l'envers » = temps
 *   écoulé depuis le début, qui monte (corr. Ben).
 * Après la fin : terminé.
 */
export function useCountdown(targetISO: string, endISO?: string): Countdown {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const start = new Date(targetISO).getTime();
  const end = endISO ? new Date(endISO).getTime() : start + 3 * 3600000; // défaut : 3h

  let phase: CountdownPhase;
  let diff: number;
  if (now < start) {
    phase = 'before';
    diff = start - now;
  } else if (now < end) {
    phase = 'live';
    diff = now - start; // temps écoulé, monte
  } else {
    phase = 'ended';
    diff = 0;
  }

  const days = Math.floor(diff / 86400000);
  diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000);
  diff -= hours * 3600000;
  const minutes = Math.floor(diff / 60000);
  diff -= minutes * 60000;
  const seconds = Math.floor(diff / 1000);

  return { days, hours, minutes, seconds, done: phase !== 'before', phase };
}

export function pad(n: number): string {
  return n.toString().padStart(2, '0');
}
