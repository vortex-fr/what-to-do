import { useEffect, useRef, useState } from 'react';
import { MapPin, Building2, Loader2 } from 'lucide-react';
import { searchAddress, searchVenues, type Place } from '../lib/geo';

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Cherche une salle ou une adresse…',
}: {
  value: string;
  onChange: (v: string) => void;
  onSelect: (p: Place) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [venues, setVenues] = useState<Place[]>([]);
  const [addrs, setAddrs] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  // instant curated venues
  useEffect(() => {
    setVenues(searchVenues(value));
  }, [value]);

  // debounced live address lookup
  useEffect(() => {
    if (value.trim().length < 3) {
      setAddrs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      const res = await searchAddress(value, ctrl.signal);
      setAddrs(res);
      setLoading(false);
    }, 350);
    return () => clearTimeout(id);
  }, [value]);

  const pick = (p: Place) => {
    onSelect(p);
    onChange(p.venue || p.label.split(',')[0]);
    setOpen(false);
  };

  const hasResults = venues.length > 0 || addrs.length > 0;

  return (
    <div ref={boxRef} className="relative">
      <div className="flex items-center gap-2 rounded-2xl border-[1.5px] border-[#e6def5] bg-[#faf8ff] px-4 py-[0.7rem] focus-within:border-violet-500 focus-within:bg-white">
        <MapPin size={18} className="shrink-0 text-violet-300" />
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent font-medium outline-none placeholder:text-violet-300"
        />
        {loading && <Loader2 size={16} className="shrink-0 animate-spin text-violet-300" />}
      </div>

      {open && (hasResults || loading) && (
        <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-violet-100 bg-white p-1.5 shadow-float">
          {venues.length > 0 && (
            <>
              <p className="px-3 pb-1 pt-2 text-[11px] font-extrabold uppercase tracking-wide text-violet-300">
                Salles connues
              </p>
              {venues.map((v, i) => (
                <button
                  key={`v-${i}`}
                  type="button"
                  onClick={() => pick(v)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left hover:bg-violet-50"
                >
                  <Building2 size={16} className="shrink-0 text-violet-500" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-ink">{v.venue}</span>
                    <span className="block truncate text-xs text-violet-400">{v.city}</span>
                  </span>
                </button>
              ))}
            </>
          )}
          {addrs.length > 0 && (
            <>
              <p className="px-3 pb-1 pt-2 text-[11px] font-extrabold uppercase tracking-wide text-violet-300">
                Adresses
              </p>
              {addrs.map((a, i) => (
                <button
                  key={`a-${i}`}
                  type="button"
                  onClick={() => pick(a)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left hover:bg-violet-50"
                >
                  <MapPin size={16} className="shrink-0 text-teal-400" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">{a.label.split(',').slice(0, 2).join(',')}</span>
                    <span className="block truncate text-xs text-violet-400">{a.label.split(',').slice(2).join(',').trim()}</span>
                  </span>
                </button>
              ))}
            </>
          )}
          {loading && addrs.length === 0 && (
            <p className="px-3 py-3 text-sm text-violet-400">Recherche d'adresses…</p>
          )}
        </div>
      )}
    </div>
  );
}
