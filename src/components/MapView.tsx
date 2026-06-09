import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import type { WtdEvent } from '../data/events';
import { CAT_MAP } from '../data/categories';
import { formatDateRange, formatPrice } from '../lib/format';

function pinIcon(color: string, active: boolean) {
  const scale = active ? 1.25 : 1;
  return L.divIcon({
    className: '',
    html: `<svg class="wtd-pin" width="${30 * scale}" height="${40 * scale}" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.6 13.2 23.5 13.8 24a1.8 1.8 0 0 0 2.4 0C16.8 38.5 30 25.6 30 15 30 6.7 23.3 0 15 0z" fill="${color}"/>
      <circle cx="15" cy="15" r="6" fill="#fff"/>
    </svg>`,
    iconSize: [30 * scale, 40 * scale],
    iconAnchor: [15 * scale, 40 * scale],
    popupAnchor: [0, -38 * scale],
  });
}

function FitBounds({ events }: { events: WtdEvent[] }) {
  const map = useMap();
  useEffect(() => {
    if (!events.length) return;
    const bounds = L.latLngBounds(events.map((e) => [e.lat, e.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
  }, [events, map]);
  return null;
}

export default function MapView({
  events,
  activeId,
  onSelect,
}: {
  events: WtdEvent[];
  activeId?: string | null;
  onSelect?: (e: WtdEvent) => void;
}) {
  return (
    <MapContainer
      center={[46.8, 8.23]}
      zoom={7}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ minHeight: 400 }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO'
      />
      <FitBounds events={events} />
      {events.map((ev) => {
        const cat = CAT_MAP[ev.category];
        return (
          <Marker
            key={ev.id}
            position={[ev.lat, ev.lng]}
            icon={pinIcon(cat.solid, activeId === ev.id)}
            eventHandlers={{ click: () => onSelect?.(ev) }}
          >
            <Popup>
              <button
                onClick={() => onSelect?.(ev)}
                className="block w-full text-left"
              >
                <div className="relative">
                  <img src={ev.image} alt={ev.title} className="h-28 w-full object-cover" />
                  <span
                    className="absolute left-0 top-2 rounded-r-full py-1 pl-2 pr-3 text-[11px] font-extrabold text-white"
                    style={{ background: cat.gradient }}
                  >
                    {cat.short}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="text-[15px] font-extrabold text-ink">{ev.title}</h4>
                  <p className="mt-1 text-xs font-semibold text-violet-600">
                    {formatDateRange(ev.dateStart, ev.dateEnd)}
                  </p>
                  <p className="text-xs text-violet-500">
                    {ev.city} · {formatPrice(ev.priceFrom)}
                  </p>
                </div>
              </button>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
