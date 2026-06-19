import { useState, useMemo, useCallback } from 'react';
import Filtros from '../Filtros/Filtros';
import Mapa from '../Mapa/Mapa';
import ListaTiendas from '../ListaTiendas/ListaTiendas';
import FichaTienda from '../FichaTienda/FichaTienda';
import { estadoApertura } from '../../utils/abierto';
import { haversine } from '../../utils/haversine';
import { useGeolocation } from '../../hooks/useGeolocation';
import s from './SeccionComprar.module.css';

const FILTROS_INICIALES = {
  abiertaAhora: false,
  barrios: [],
  busqueda: '',
};

export default function SeccionComprar({ tiendas, cargando, barcelonaTime }) {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(null);
  const [vistaMovil, setVistaMovil] = useState('mapa'); // 'mapa' | 'lista'
  const { posicion, estado: geolEstado, mensaje: geolMsg, solicitar, limpiar } = useGeolocation();

  const handleFiltros = useCallback((cambios) => {
    setFiltros((prev) => ({ ...prev, ...cambios }));
  }, []);

  const handleCercaDeMi = useCallback(() => {
    if (geolEstado === 'success') {
      limpiar();
    } else {
      solicitar();
    }
  }, [geolEstado, solicitar, limpiar]);

  // Compute distances and sort if we have user location
  const tiendasConDistancia = useMemo(() => {
    if (!posicion) return tiendas;
    return tiendas
      .map((t) => ({ ...t, _distancia: haversine(posicion.lat, posicion.lon, t.lat, t.lon) }))
      .sort((a, b) => a._distancia - b._distancia);
  }, [tiendas, posicion]);

  // Apply filters
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
      <Filtros
        filtros={filtros}
        onChange={handleFiltros}
        totalVisible={tiendasFiltradas.length}
        totalTotal={tiendas.length}
        geolEstado={geolEstado}
        onCercaDeMi={handleCercaDeMi}
      />

      {/* Geolocation error message */}
      {geolEstado === 'error' && (
        <div className={s.geolError} role="alert">
          {geolMsg}
        </div>
      )}

      {/* Mobile tab switcher */}
      <div className={s.tabsMobile}>
        <button
          className={`${s.tab} ${vistaMovil === 'mapa' ? s.tabActivo : ''}`}
          onClick={() => setVistaMovil('mapa')}
        >
          Mapa
        </button>
        <button
          className={`${s.tab} ${vistaMovil === 'lista' ? s.tabActivo : ''}`}
          onClick={() => setVistaMovil('lista')}
        >
          Lista ({tiendasFiltradas.length})
        </button>
      </div>

      {/* Main layout */}
      <div className={s.layout}>
        {/* Sidebar: lista de tiendas */}
        <div className={`${s.sidebar} ${vistaMovil === 'lista' ? s.sidebarVisible : ''}`}>
          <ListaTiendas
            tiendas={tiendasFiltradas}
            tiendaSeleccionada={tiendaSeleccionada}
            onSeleccionar={(t) => {
              setTiendaSeleccionada(t);
              setVistaMovil('mapa');
            }}
            barcelonaTime={barcelonaTime}
            posicionUsuario={posicion}
          />
        </div>

        {/* Mapa */}
        <div className={`${s.mapaWrap} ${vistaMovil === 'mapa' ? s.mapaVisible : ''}`}>
          <Mapa
            tiendas={tiendasFiltradas}
            tiendaSeleccionada={tiendaSeleccionada}
            onTiendaSeleccionada={setTiendaSeleccionada}
            posicionUsuario={posicion}
          />
        </div>

        {/* Ficha lateral */}
        {tiendaSeleccionada && (
          <FichaTienda
            tienda={tiendaSeleccionada}
            barcelonaTime={barcelonaTime}
            onCerrar={() => setTiendaSeleccionada(null)}
          />
        )}
      </div>
    </div>
  );
}
