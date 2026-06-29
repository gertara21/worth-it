import { useState, useMemo, useCallback, useRef } from 'react';
import Filtros from '../Filtros/Filtros';
import Mapa from '../Mapa/Mapa';
import ListaTiendas from '../ListaTiendas/ListaTiendas';
import FichaTienda from '../FichaTienda/FichaTienda';
import { Navigation } from 'lucide-react';
import { estadoApertura } from '../../utils/abierto';
import { haversine } from '../../utils/haversine';
import { useGeolocation } from '../../hooks/useGeolocation';
import s from './SeccionComprar.module.css';

const FILTROS_INICIALES = {
  abiertaAhora: false,
  barrios: [],
  busqueda: '',
};

const SHEET_STATES = ['peek', 'half', 'full'];

export default function SeccionComprar({ tiendas, cargando, barcelonaTime }) {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(null); // desktop
  const [tiendaPreview, setTiendaPreview] = useState(null);           // mobile: mini-ficha en peek
  const [tiendaDetalle, setTiendaDetalle] = useState(null);           // mobile: overlay completo
  const [sheetState, setSheetState] = useState('peek');
  const [visibles, setVisibles] = useState(10);
  const { posicion, estado: geolEstado, mensaje: geolMsg, solicitar, limpiar } = useGeolocation();
  const touchStartY = useRef(null);

  const handleFiltros = useCallback((cambios) => {
    setFiltros((prev) => ({ ...prev, ...cambios }));
    setVisibles(10);
  }, []);

  const handleCercaDeMi = useCallback(() => {
    if (geolEstado === 'success') {
      limpiar();
    } else {
      solicitar();
    }
  }, [geolEstado, solicitar, limpiar]);

  const tiendasConDistancia = useMemo(() => {
    if (!posicion) return tiendas;
    return tiendas
      .map((t) => ({ ...t, _distancia: haversine(posicion.lat, posicion.lon, t.lat, t.lon) }))
      .sort((a, b) => a._distancia - b._distancia);
  }, [tiendas, posicion]);

  const tiendasFiltradas = useMemo(() => {
    return tiendasConDistancia.filter((t) => {
      if (filtros.busqueda) {
        const q = filtros.busqueda.toLowerCase();
        if (!t.nombre.toLowerCase().includes(q) && !t.barrio.toLowerCase().includes(q)) return false;
      }
      if (filtros.barrios.length > 0 && !filtros.barrios.includes(t.barrio)) return false;
      if (filtros.abiertaAhora) {
        const ap = estadoApertura(t, barcelonaTime);
        if (ap.estado !== 'abierto' && ap.estado !== 'cierra-pronto') return false;
      }
      return true;
    });
  }, [tiendasConDistancia, filtros, barcelonaTime]);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    touchStartY.current = null;
    // Block drag when preview or detail is active
    if (tiendaPreview || tiendaDetalle) return;
    if (Math.abs(delta) < 50) return;
    const idx = SHEET_STATES.indexOf(sheetState);
    if (delta > 0 && idx < SHEET_STATES.length - 1) setSheetState(SHEET_STATES[idx + 1]);
    if (delta < 0 && idx > 0) setSheetState(SHEET_STATES[idx - 1]);
  };

  const handleHandleClick = () => {
    if (tiendaPreview || tiendaDetalle) return;
    setSheetState((prev) => (prev === 'peek' ? 'half' : 'peek'));
  };

  // Mobile: tap tarjeta → mini-ficha en peek
  const handleSeleccionarMovil = useCallback((t) => {
    setTiendaPreview(t);
    setSheetState('peek');
  }, []);

  // Mobile: "Ver detalles" → overlay completo
  const handleVerDetalles = useCallback((t) => {
    setTiendaDetalle(t);
    setTiendaPreview(null);
  }, []);

  // Mobile: volver desde detalle → recuperar mini-preview
  const handleVolverAPreview = useCallback((t) => {
    setTiendaDetalle(null);
    setTiendaPreview(t);
  }, []);

  // Mobile: volver desde preview → lista
  const handleVolverALista = useCallback(() => {
    setTiendaPreview(null);
    setSheetState('half');
  }, []);

  const handleScrollLista = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      setVisibles((prev) => Math.min(prev + 10, tiendasFiltradas.length));
    }
  };

  const sheetHeight = tiendaPreview
    ? '220px'
    : sheetState === 'peek' ? '180px' : sheetState === 'half' ? '50vh' : '90vh';

  const filtrosProps = {
    filtros,
    onChange: handleFiltros,
    totalVisible: tiendasFiltradas.length,
    totalTotal: tiendas.length,
    geolEstado,
    onCercaDeMi: handleCercaDeMi,
  };

  if (cargando) {
    return (
      <div className={s.cargando}>
        <div className={s.spinner} aria-label="Cargando tiendas…" />
        <p>Cargando tiendas…</p>
      </div>
    );
  }

  return (
    <div className={s.wrap}>
      {/* ── Desktop filtros bar (hidden on mobile) ── */}
      <div className={s.filtrosDesktop}>
        <Filtros {...filtrosProps} />
        {geolEstado === 'error' && (
          <div className={s.geolError} role="alert">{geolMsg}</div>
        )}
      </div>

      {/* ── Desktop layout: sidebar + map + ficha ── */}
      <div className={s.layout}>
        <div className={s.sidebar}>
          <ListaTiendas
            tiendas={tiendasFiltradas}
            tiendaSeleccionada={tiendaSeleccionada}
            onSeleccionar={setTiendaSeleccionada}
            barcelonaTime={barcelonaTime}
            posicionUsuario={posicion}
          />
        </div>

        <div className={s.mapaWrap}>
          <Mapa
            tiendas={tiendasFiltradas}
            tiendaSeleccionada={tiendaDetalle ?? tiendaPreview ?? tiendaSeleccionada}
            onTiendaSeleccionada={(t) => {
              setTiendaSeleccionada(t); // desktop
              handleSeleccionarMovil(t); // mobile
            }}
            posicionUsuario={posicion}
          />
        </div>

        {tiendaSeleccionada && (
          <div className={s.fichaDesktop}>
            <FichaTienda
              tienda={tiendaSeleccionada}
              barcelonaTime={barcelonaTime}
              onCerrar={() => setTiendaSeleccionada(null)}
            />
          </div>
        )}
      </div>

      {/* ── Mobile overlay: geo button + bottom sheet ── */}
      <div className={s.mobileOverlay}>
        <button
          className={`${s.geoBtn} ${geolEstado === 'success' ? s.geoBtnActivo : ''}`}
          onClick={handleCercaDeMi}
          aria-label={geolEstado === 'loading' ? 'Buscando ubicación…' : 'Cerca de mí'}
          disabled={geolEstado === 'loading'}
          style={{ bottom: `calc(${sheetHeight} + 16px)` }}
        >
          <Navigation size={20} color={geolEstado === 'success' ? 'white' : '#FF6A1A'} />
        </button>

        <div className={s.bottomSheet} style={{ height: sheetHeight }}>
          <div
            className={s.dragHandleArea}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={handleHandleClick}
            role="button"
            aria-label="Ajustar panel"
          >
            <div className={s.dragHandle} />
          </div>

          {tiendaPreview ? (
            /* ── Mini-ficha en peek ── */
            <MiniPreview
              tienda={tiendaPreview}
              barcelonaTime={barcelonaTime}
              onVolver={handleVolverALista}
              onVerDetalles={handleVerDetalles}
            />
          ) : (
            /* ── Lista ── */
            <>
              <Filtros {...filtrosProps} />
              {geolEstado === 'error' && (
                <div className={s.geolError} role="alert">{geolMsg}</div>
              )}
              <div className={s.listaMovil} onScroll={handleScrollLista}>
                <ListaTiendas
                  tiendas={tiendasFiltradas.slice(0, visibles)}
                  tiendaSeleccionada={tiendaPreview}
                  onSeleccionar={handleSeleccionarMovil}
                  barcelonaTime={barcelonaTime}
                  posicionUsuario={posicion}
                />
                {visibles < tiendasFiltradas.length && (
                  <p className={s.cargandoMas}>Cargando más tiendas…</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Overlay detalle completo: arranca justo debajo de la Cabecera ── */}
        {tiendaDetalle && (
          <div style={{
            position: 'fixed',
            top: 'var(--cabecera-h)',
            left: 0,
            right: 0,
            bottom: 0,
            background: '#ffffff',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'hidden',
          }}>
            <div style={{
              position: 'sticky',
              top: 0,
              background: '#ffffff',
              borderBottom: '1px solid #f0ebe3',
              padding: '14px 16px',
              zIndex: 201,
              flexShrink: 0,
            }}>
              <button
                onClick={() => handleVolverAPreview(tiendaDetalle)}
                onTouchEnd={(e) => { e.preventDefault(); handleVolverAPreview(tiendaDetalle); }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#111111',
                  fontFamily: 'Space Grotesk, sans-serif',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                }}
              >
                ← Volver al listado
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: '#ffffff' }}>
              <FichaTienda
                tienda={tiendaDetalle}
                barcelonaTime={barcelonaTime}
                onCerrar={() => handleVolverAPreview(tiendaDetalle)}
                modoMobile={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniPreview({ tienda, barcelonaTime, onVolver, onVerDetalles }) {
  const ap = estadoApertura(tienda, barcelonaTime);
  const abierta = ap.estado === 'abierto' || ap.estado === 'cierra-pronto';

  return (
    <div style={{ padding: '12px 16px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#111', lineHeight: 1.2 }}>
          {tienda.nombre}
        </span>
        <span style={{
          fontSize: 12,
          padding: '3px 10px',
          borderRadius: 10,
          background: abierta ? '#e8f5e9' : '#f5f5f5',
          color: abierta ? '#2E7D32' : '#999',
          flexShrink: 0,
          marginLeft: 8,
        }}>
          {abierta ? 'Abierto' : 'Cerrado'}
        </span>
      </div>

      <p style={{ fontSize: 13, color: '#888', marginBottom: 14, marginTop: 0 }}>
        📍 {tienda.barrio}{tienda.direccion ? ` · ${tienda.direccion}` : ''}
      </p>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onVolver}
          onTouchEnd={(e) => { e.preventDefault(); onVolver(); }}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: 10,
            border: '1.5px solid #e0dbd0',
            background: '#fff',
            fontSize: 14,
            fontWeight: 600,
            color: '#111',
            cursor: 'pointer',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          ← Lista
        </button>
        <button
          onClick={() => onVerDetalles(tienda)}
          onTouchEnd={(e) => { e.preventDefault(); onVerDetalles(tienda); }}
          style={{
            flex: 2,
            padding: '12px',
            borderRadius: 10,
            border: 'none',
            background: '#FF6A1A',
            fontSize: 14,
            fontWeight: 600,
            color: '#fff',
            cursor: 'pointer',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Ver detalles →
        </button>
      </div>
    </div>
  );
}
