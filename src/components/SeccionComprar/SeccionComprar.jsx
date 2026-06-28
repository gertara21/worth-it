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
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(null);
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
    if (Math.abs(delta) < 50) return;
    const idx = SHEET_STATES.indexOf(sheetState);
    if (delta > 0 && idx < SHEET_STATES.length - 1) setSheetState(SHEET_STATES[idx + 1]);
    if (delta < 0 && idx > 0) setSheetState(SHEET_STATES[idx - 1]);
  };

  const handleHandleClick = () => {
    setSheetState((prev) => (prev === 'peek' ? 'half' : 'peek'));
  };

  const handleSeleccionarMovil = useCallback((t) => {
    setTiendaSeleccionada(t);
    setSheetState('peek');
  }, []);

  const handleScrollLista = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      setVisibles((prev) => Math.min(prev + 10, tiendasFiltradas.length));
    }
  };

  const sheetHeight = sheetState === 'peek' ? '180px' : sheetState === 'half' ? '50vh' : '90vh';

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
            tiendaSeleccionada={tiendaSeleccionada}
            onTiendaSeleccionada={setTiendaSeleccionada}
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
          <Navigation
            size={20}
            color={geolEstado === 'success' ? 'white' : '#FF6A1A'}
          />
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

          <Filtros {...filtrosProps} />
          {geolEstado === 'error' && (
            <div className={s.geolError} role="alert">{geolMsg}</div>
          )}

          <div className={s.listaMovil} onScroll={handleScrollLista}>
            <ListaTiendas
              tiendas={tiendasFiltradas.slice(0, visibles)}
              tiendaSeleccionada={tiendaSeleccionada}
              onSeleccionar={handleSeleccionarMovil}
              barcelonaTime={barcelonaTime}
              posicionUsuario={posicion}
            />
            {visibles < tiendasFiltradas.length && (
              <p className={s.cargandoMas}>Cargando más tiendas…</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
