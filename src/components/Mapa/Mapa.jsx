import { useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import s from './Mapa.module.css';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

const BARCELONA_CENTER = { lat: 41.3954, lng: 2.1707 };
const DEFAULT_ZOOM = 13;

// Custom orange pin SVG (W? branded)
const makePinSVG = (selected = false) => {
  const fill = selected ? '#d4521a' : '#F26122';
  const size = selected ? 40 : 34;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.round(size * 1.3)}" viewBox="0 0 34 44">
    <path d="M17 0C8.163 0 1 7.163 1 16c0 5.5 2.7 10.4 6.9 13.5L17 44l9.1-14.5C30.3 26.4 33 21.5 33 16 33 7.163 25.837 0 17 0Z" fill="${fill}" stroke="white" stroke-width="1.5"/>
    <text x="17" y="21" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="11" font-weight="700" fill="white">W?</text>
  </svg>`;
};

const MAP_STYLES = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f8f4ec' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#cde8f5' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#fdf9f2' }] },
];

export default function Mapa({ tiendas, tiendaSeleccionada, onTiendaSeleccionada, posicionUsuario }) {
  const mapRef = useRef(null);
  const googleRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);    // { tienda, marker, svgEl }
  const clustererRef = useRef(null);
  const userMarkerRef = useRef(null);
  const loadedRef = useRef(false);

  // Initialize map once
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    if (!API_KEY) return; // No key → show message (handled in render)

    setOptions({ apiKey: API_KEY, version: 'weekly' });

    Promise.all([importLibrary('maps'), importLibrary('marker')]).then(() => {
      const google = window.google;
      googleRef.current = google;

      const map = new google.maps.Map(mapRef.current, {
        center: BARCELONA_CENTER,
        zoom: DEFAULT_ZOOM,
        styles: MAP_STYLES,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
      });
      mapInstanceRef.current = map;

      // Build markers
      buildMarkers(google, map, tiendas, onTiendaSeleccionada);
    }).catch((err) => {
      console.error('Google Maps failed to load:', err);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update markers when tiendas change (filtering)
  useEffect(() => {
    if (!mapInstanceRef.current || !googleRef.current) return;
    buildMarkers(googleRef.current, mapInstanceRef.current, tiendas, onTiendaSeleccionada);
  }, [tiendas]); // eslint-disable-line react-hooks/exhaustive-deps

  function buildMarkers(google, map, tiendasList, onSelect) {
    // Clear old clusterer and markers
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current = null;
    }
    markersRef.current.forEach(({ marker }) => marker.setMap(null));
    markersRef.current = [];

    const newMarkers = tiendasList.map((tienda) => {
      const svgEl = document.createElement('div');
      svgEl.innerHTML = makePinSVG(false);
      svgEl.style.cursor = 'pointer';
      svgEl.title = tienda.nombre;

      const marker = google.maps.marker?.AdvancedMarkerElement
        ? new google.maps.marker.AdvancedMarkerElement({
            position: { lat: tienda.lat, lng: tienda.lon },
            map,
            title: tienda.nombre,
            content: svgEl,
          })
        : new google.maps.Marker({
            position: { lat: tienda.lat, lng: tienda.lon },
            map,
            title: tienda.nombre,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(makePinSVG(false))}`,
              scaledSize: new google.maps.Size(34, 44),
              anchor: new google.maps.Point(17, 44),
            },
          });

      marker.addListener('click', () => {
        onSelect(tienda);
        map.panTo({ lat: tienda.lat, lng: tienda.lon });
      });

      return { tienda, marker, svgEl };
    });

    markersRef.current = newMarkers;

    // Clusterer
    const rawMarkers = newMarkers.map(({ marker }) => marker);
    clustererRef.current = new MarkerClusterer({
      map,
      markers: rawMarkers,
      renderer: {
        render: ({ count, position }) => {
          const el = document.createElement('div');
          el.innerHTML = `<div style="
            background:var(--color-primario,#F26122);
            color:white;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;
            width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;
            border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,.25);cursor:pointer;
          ">${count}</div>`;
          return google.maps.marker?.AdvancedMarkerElement
            ? new google.maps.marker.AdvancedMarkerElement({ position, content: el })
            : new google.maps.Marker({
                position,
                icon: { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(clusterSVG(count))}`, scaledSize: new google.maps.Size(38, 38), anchor: new google.maps.Point(19, 19) },
              });
        },
      },
    });
  }

  // Pan + highlight when tiendaSeleccionada changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tiendaSeleccionada) return;
    mapInstanceRef.current.panTo({ lat: tiendaSeleccionada.lat, lng: tiendaSeleccionada.lon });
    if (mapInstanceRef.current.getZoom() < 15) {
      mapInstanceRef.current.setZoom(15);
    }
    // Update marker styles
    const google = googleRef.current;
    markersRef.current.forEach(({ tienda, marker, svgEl }) => {
      const sel = tienda.id === tiendaSeleccionada.id;
      if (svgEl) svgEl.innerHTML = makePinSVG(sel);
      else if (marker.setIcon) {
        marker.setIcon({
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(makePinSVG(sel))}`,
          scaledSize: new google.maps.Size(sel ? 40 : 34, sel ? 52 : 44),
          anchor: new google.maps.Point(sel ? 20 : 17, sel ? 52 : 44),
        });
      }
    });
  }, [tiendaSeleccionada]);

  // User location marker
  useEffect(() => {
    if (!mapInstanceRef.current || !googleRef.current) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
      userMarkerRef.current = null;
    }
    if (!posicionUsuario) return;

    const google = googleRef.current;
    const el = document.createElement('div');
    el.innerHTML = `<div style="width:16px;height:16px;border-radius:50%;background:#1a73e8;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3);"></div>`;

    userMarkerRef.current = google.maps.marker?.AdvancedMarkerElement
      ? new google.maps.marker.AdvancedMarkerElement({
          position: { lat: posicionUsuario.lat, lng: posicionUsuario.lon },
          map: mapInstanceRef.current,
          title: 'Tu ubicación',
          content: el,
        })
      : new google.maps.Marker({
          position: { lat: posicionUsuario.lat, lng: posicionUsuario.lon },
          map: mapInstanceRef.current,
          title: 'Tu ubicación',
          icon: { path: google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: '#1a73e8', fillOpacity: 1, strokeColor: 'white', strokeWeight: 2 },
        });

    mapInstanceRef.current.panTo({ lat: posicionUsuario.lat, lng: posicionUsuario.lon });
    mapInstanceRef.current.setZoom(14);
  }, [posicionUsuario]);

  if (!API_KEY) {
    return (
      <div className={s.noKey}>
        <div className={s.noKeyInner}>
          <span className="sol-deco" style={{ margin: '0 auto 20px' }} />
          <h3>Falta la clave de Google Maps</h3>
          <p>Crea un archivo <code>.env</code> en la raíz del proyecto con:</p>
          <pre className={s.code}>VITE_GOOGLE_MAPS_API_KEY=tu_clave_aquí</pre>
          <p>Consulta el <strong>README.md</strong> para los pasos completos.</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className={s.mapa} aria-label="Mapa de tiendas en Barcelona" />;
}

function clusterSVG(count) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
    <circle cx="19" cy="19" r="18" fill="#F26122" stroke="white" stroke-width="2.5"/>
    <text x="19" y="24" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="13" font-weight="700" fill="white">${count}</text>
  </svg>`;
}
