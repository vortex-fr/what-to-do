export interface Place {
  label: string; // human readable
  city: string;
  lat: number;
  lng: number;
  venue?: string;
}

/** Curated directory of well-known Swiss venues ("salles"). Instant, offline. */
export const VENUES: Place[] = [
  { venue: 'SwissTech Convention Center', city: 'Lausanne', label: 'SwissTech Convention Center, Lausanne', lat: 46.5191, lng: 6.5668 },
  { venue: 'Théâtre de Beaulieu', city: 'Lausanne', label: 'Théâtre de Beaulieu, Lausanne', lat: 46.5306, lng: 6.6206 },
  { venue: 'MAD Club', city: 'Lausanne', label: 'MAD Club, Lausanne', lat: 46.5212, lng: 6.6291 },
  { venue: 'Vaudoise aréna', city: 'Lausanne', label: 'Vaudoise aréna, Lausanne', lat: 46.5063, lng: 6.6182 },
  { venue: 'Montreux Music & Convention Centre (2m2c)', city: 'Montreux', label: '2m2c, Montreux', lat: 46.4358, lng: 6.9106 },
  { venue: 'Palexpo', city: 'Genève', label: 'Palexpo, Genève', lat: 46.2382, lng: 6.1186 },
  { venue: 'Arena Genève', city: 'Genève', label: 'Arena Genève', lat: 46.1962, lng: 6.1045 },
  { venue: 'Victoria Hall', city: 'Genève', label: 'Victoria Hall, Genève', lat: 46.2008, lng: 6.1428 },
  { venue: 'Théâtre du Passage', city: 'Neuchâtel', label: 'Théâtre du Passage, Neuchâtel', lat: 46.993, lng: 6.931 },
  { venue: 'Forum Fribourg', city: 'Fribourg', label: 'Forum Fribourg', lat: 46.7972, lng: 7.1006 },
  { venue: 'Théâtre de l\'Heure Bleue', city: 'La Chaux-de-Fonds', label: 'L\'Heure Bleue, La Chaux-de-Fonds', lat: 47.0998, lng: 6.8255 },
  { venue: 'Hallenstadion', city: 'Zürich', label: 'Hallenstadion, Zürich', lat: 47.4115, lng: 8.5519 },
  { venue: 'Kaufleuten', city: 'Zürich', label: 'Kaufleuten, Zürich', lat: 47.3697, lng: 8.5363 },
  { venue: 'PostFinance Arena', city: 'Berne', label: 'PostFinance Arena, Berne', lat: 46.9637, lng: 7.4651 },
  { venue: 'St. Jakobshalle', city: 'Bâle', label: 'St. Jakobshalle, Bâle', lat: 47.5388, lng: 7.6087 },
  { venue: 'KKL Luzern', city: 'Lucerne', label: 'KKL Luzern', lat: 47.0503, lng: 8.3132 },
  { venue: 'Olma Messen', city: 'Saint-Gall', label: 'Olma Messen, Saint-Gall', lat: 47.4245, lng: 9.3767 },
  { venue: 'LAC Lugano Arte e Cultura', city: 'Lugano', label: 'LAC, Lugano', lat: 46.0003, lng: 8.9529 },
];

export function searchVenues(q: string): Place[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return VENUES.filter(
    (v) => v.venue!.toLowerCase().includes(s) || v.city.toLowerCase().includes(s) || v.label.toLowerCase().includes(s)
  ).slice(0, 6);
}

/**
 * Dynamic address autocomplete via OpenStreetMap Nominatim (free, no key,
 * limited to Switzerland). Swap-in target for Google Places later.
 */
export async function searchAddress(q: string, signal?: AbortSignal): Promise<Place[]> {
  const query = q.trim();
  if (query.length < 3) return [];
  const url =
    `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=ch&accept-language=fr&q=` +
    encodeURIComponent(query);
  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
    if (!res.ok) return [];
    const data: NominatimResult[] = await res.json();
    return data.map((r) => {
      const a = r.address ?? {};
      const city = a.city || a.town || a.village || a.municipality || a.county || '';
      const venue = a.amenity || a.building || a.leisure || a.tourism || r.name || undefined;
      return {
        label: r.display_name,
        city: city || (r.display_name.split(',')[0] ?? ''),
        venue,
        lat: parseFloat(r.lat),
        lng: parseFloat(r.lon),
      };
    });
  } catch {
    return [];
  }
}

interface NominatimResult {
  display_name: string;
  name?: string;
  lat: string;
  lon: string;
  address?: {
    amenity?: string;
    building?: string;
    leisure?: string;
    tourism?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
  };
}
