'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, MapPin, Maximize2 } from 'lucide-react';
import type * as Leaflet from 'leaflet';
import { GUIDE_CATEGORIES, GUIDE_PLACES, GUIDE_SOURCE, type GuideCategory } from '@/data/city-guide';
import { VENUES } from '@/data/venues';
import { googleMapsLink } from '@/lib/places';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';

export function FreeTimeMap() {
  const [category, setCategory] = useState<GuideCategory | 'All'>('All');
  const [enabled, setEnabled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  const container = useRef<HTMLElement>(null);
  const map = useRef<Leaflet.Map | null>(null);
  const markers = useRef(new Map<string, Leaflet.Marker>());
  const clusters = useRef<Leaflet.MarkerClusterGroup | null>(null);
  const visible = GUIDE_PLACES.filter((place) => category === 'All' || place.category === category);

  // Load map tiles only when this section reaches the viewport.
  useEffect(() => {
    if (!container.current || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEnabled(true);
        observer.disconnect();
      }
    });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!enabled || !container.current) return;
    let disposed = false;
    let instance: Leaflet.Map | undefined;
    const observed = container.current;
    const resize = new ResizeObserver(() => instance?.invalidateSize());
    async function initialise() {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet.markercluster');
        if (disposed) return;
        const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        instance = L.map(observed, { scrollWheelZoom: false, zoomAnimation: motion, fadeAnimation: motion, markerZoomAnimation: motion });
        map.current = instance;
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).on('tileerror', () => { if (!disposed) setError(true); }).addTo(instance);
        const group = L.markerClusterGroup({
          animate: false,
          maxClusterRadius: 60,
          showCoverageOnHover: false,
          iconCreateFunction: (cluster) => L.divIcon({
            className: 'guide-map-cluster',
            html: `<span>${cluster.getChildCount()} places</span>`,
            iconSize: [76, 36],
            iconAnchor: [38, 18],
          }),
        }).addTo(instance);
        clusters.current = group;
        const hotel = VENUES.hotel;
        const entries = [
          { id: 'hotel', name: hotel.name, coords: hotel.coords, label: 'H', description: 'Your hotel · Golden Lis' },
          ...GUIDE_PLACES.map((place, index) => ({ ...place, label: String(index + 1) })),
        ];
        for (const place of entries) {
          const popup = document.createElement('div');
          const name = document.createElement('strong');
          name.textContent = place.name;
          const description = document.createElement('p');
          description.textContent = place.description;
          const link = document.createElement('a');
          link.href = googleMapsLink(place.coords);
          link.target = '_blank';
          link.rel = 'noreferrer';
          link.textContent = 'Open in Google Maps';
          popup.append(name, description, link);
          const marker = L.marker([place.coords.lat, place.coords.lon], {
            title: place.name, alt: place.name,
            icon: L.divIcon({ className: 'guide-map-pin' + (place.id === 'hotel' ? ' is-hotel' : ''), html: place.label, iconSize: [32, 32], iconAnchor: [16, 16] }),
          }).bindPopup(popup);
          if (place.id === 'hotel') marker.addTo(instance);
          else group.addLayer(marker);
          markers.current.set(place.id, marker);
        }
        instance.fitBounds(entries.map((place) => [place.coords.lat, place.coords.lon] as [number, number]), { padding: [35, 35], animate: false });
        resize.observe(observed);
        setReady(true);
      } catch {
        if (!disposed) setError(true);
      }
    }
    void initialise();
    const pins = markers.current;
    return () => { disposed = true; resize.disconnect(); instance?.remove(); map.current = null; clusters.current = null; pins.clear(); };
  }, [enabled]);

  useEffect(() => {
    if (!ready || !map.current || !clusters.current) return;
    const instance = map.current;
    const group = clusters.current;
    group.clearLayers();
    const selected: Leaflet.Marker[] = [];
    const bounds: [number, number][] = [[VENUES.hotel.coords.lat, VENUES.hotel.coords.lon]];
    for (const place of GUIDE_PLACES) {
      const marker = markers.current.get(place.id);
      if (!marker) continue;
      if (category === 'All' || category === place.category) {
        selected.push(marker);
        bounds.push([place.coords.lat, place.coords.lon]);
      }
    }
    group.addLayers(selected);
    instance.fitBounds(bounds, { padding: [35, 35], animate: false });
  }, [category, ready]);

  function showPlace(id: string) {
    const marker = markers.current.get(id);
    if (!marker || !map.current) return;
    map.current.setView(marker.getLatLng(), 15, { animate: false });
    clusters.current?.zoomToShowLayer(marker, () => marker.openPopup());
    container.current?.scrollIntoView({ block: 'center' });
  }

  return (
    <div className="free-time-guide">
      <fieldset className="guide-filters">
        <legend className="visually-hidden">Filter places</legend>
        {(['All', ...GUIDE_CATEGORIES] as const).map((item) => (
          <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>
        ))}
      </fieldset>
      <div className={'guide-layout' + (expanded ? ' is-expanded' : '')}>
        <div className="guide-map-panel">
          <div className="guide-map-toolbar">
            <span><span className="guide-hotel-key" aria-hidden="true">H</span> Golden Lis · your hotel</span>
            {ready && <button type="button" aria-expanded={expanded} aria-controls="free-time-map" onClick={() => setExpanded(!expanded)}><Maximize2 aria-hidden="true" />{expanded ? 'Reduce map' : 'Expand map'}</button>}
          </div>
          <div className="guide-map-stage">
            <section id="free-time-map" ref={container} className="guide-map-canvas" aria-label="Goiânia free-time map" />
            {!ready && <div className="guide-map-start">
              {!enabled ? <button type="button" onClick={() => setEnabled(true)}><MapPin aria-hidden="true" />Explore map</button> : <output>{error ? 'Map unavailable. Place links are available below.' : 'Loading map…'}</output>}
              <noscript>Open any place below in Google Maps.</noscript>
            </div>}
          </div>
          {error && ready && <output className="guide-map-error">Some map tiles could not load. Open a place in Google Maps for its location.</output>}
        </div>
        <div className="guide-results">
          <output className="guide-count">{visible.length} places</output>
          <ol className="guide-place-list">
            {visible.map((place) => (
              <li key={place.id}>
                <span className="guide-place-number" aria-hidden="true">{GUIDE_PLACES.indexOf(place) + 1}</span>
                <div>
                  <p className="guide-place-area">{place.area}</p>
                  <h4>{place.name}</h4>
                  <p>{place.description}</p>
                  <div className="guide-place-links">
                    {ready && <button type="button" onClick={() => showPlace(place.id)} aria-label={'Show ' + place.name + ' on map'}>Show on map</button>}
                    <a href={googleMapsLink(place.coords)} target="_blank" rel="noreferrer" aria-label={'Open ' + place.name + ' in Google Maps'}>Google Maps<ArrowUpRight aria-hidden="true" /></a>
                    <a href={place.website} target="_blank" rel="noreferrer" aria-label={'More information about ' + place.name}>Details<ArrowUpRight aria-hidden="true" /></a>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <p className="city-source guide-credit">Places adapted from <a href={GUIDE_SOURCE} target="_blank" rel="noreferrer">GMH Workshop – Brazil 2026 · Nathália Monteiro Teles</a>.</p>
    </div>
  );
}
