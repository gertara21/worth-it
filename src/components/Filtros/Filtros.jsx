import { Clock, MapPin, Navigation, Search, X } from 'lucide-react';
import s from './Filtros.module.css';

const BARRIOS = [
  'Ciutat Vella / El Born',
  'Ciutat Vella / El Raval',
  'Ciutat Vella / Gótic',
  'Eixample Dreta',
  'Esquerra de l\'Eixample',
  'Gràcia',
  'Horta-Guinardó',
  'Les Corts',
  'Sant Andreu',
  'Sant Antoni (Eixample)',
  'Sant Martí',
  'Sant Martí / Clot',
  'Sant Martí / Poblenou',
  'Sarrià-Sant Gervasi',
];

export default function Filtros({ filtros, onChange, totalVisible, totalTotal, geolEstado, onCercaDeMi }) {
  const toggleBarrio = (barrio) => {
    const set = new Set(filtros.barrios);
    if (set.has(barrio)) set.delete(barrio);
    else set.add(barrio);
    onChange({ barrios: [...set] });
  };

  const resetFiltros = () => {
    onChange({ abiertaAhora: false, barrios: [], busqueda: '' });
  };

  const hayFiltros = filtros.abiertaAhora || filtros.barrios.length > 0 || filtros.busqueda;

  return (
    <div className={s.wrap}>
      <div className={s.bar}>
        {/* Buscador */}
        <div className={s.buscador}>
          <Search size={15} className={s.icono} />
          <input
            type="search"
            placeholder="Buscar tienda…"
            value={filtros.busqueda}
            onChange={(e) => onChange({ busqueda: e.target.value })}
            className={s.input}
            aria-label="Buscar tienda por nombre"
          />
          {filtros.busqueda && (
            <button className={s.clearBtn} onClick={() => onChange({ busqueda: '' })} aria-label="Limpiar búsqueda">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Toggle abierto ahora */}
        <button
          className={`${s.pill} ${filtros.abiertaAhora ? s.pillActivo : ''}`}
          onClick={() => onChange({ abiertaAhora: !filtros.abiertaAhora })}
          aria-pressed={filtros.abiertaAhora}
        >
          <Clock size={14} />
          Abierto ahora
        </button>

        {/* Cerca de mí */}
        <button
          className={`${s.pill} ${geolEstado === 'success' ? s.pillActivo : ''}`}
          onClick={onCercaDeMi}
          aria-pressed={geolEstado === 'success'}
          disabled={geolEstado === 'loading'}
        >
          <Navigation size={14} />
          {geolEstado === 'loading' ? 'Buscando…' : 'Cerca de mí'}
        </button>

        {/* Barrios dropdown */}
        <div className={s.barrioWrap}>
          <button className={`${s.pill} ${filtros.barrios.length > 0 ? s.pillActivo : ''}`}>
            <MapPin size={14} />
            {filtros.barrios.length > 0
              ? `${filtros.barrios.length} barrio${filtros.barrios.length > 1 ? 's' : ''}`
              : 'Barrio'}
          </button>
          <div className={s.barrioDropdown}>
            {BARRIOS.map((b) => (
              <label key={b} className={s.barrioItem}>
                <input
                  type="checkbox"
                  checked={filtros.barrios.includes(b)}
                  onChange={() => toggleBarrio(b)}
                />
                <span>{b}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Limpiar filtros */}
        {hayFiltros && (
          <button className={s.limpiar} onClick={resetFiltros}>
            <X size={13} />
            Limpiar
          </button>
        )}

        {/* Contador */}
        <span className={s.contador} aria-live="polite">
          {totalVisible}{totalVisible !== totalTotal && ` de ${totalTotal}`} tienda{totalVisible !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}
