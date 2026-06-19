import { MapPin, Star, Navigation } from 'lucide-react';
import { estadoApertura } from '../../utils/abierto';
import { formatDistancia } from '../../utils/haversine';
import s from './ListaTiendas.module.css';

function EstadoChip({ estado, texto }) {
  const cls = {
    abierto: s.verde,
    'cierra-pronto': s.ambar,
    cerrado: s.gris,
    'cerrado-hoy': s.gris,
    'sin-confirmar': s.gris,
  };
  return <span className={`${s.chip} ${cls[estado] ?? s.gris}`}>{texto}</span>;
}

export default function ListaTiendas({ tiendas, tiendaSeleccionada, onSeleccionar, barcelonaTime, posicionUsuario }) {
  if (tiendas.length === 0) {
    return (
      <div className={s.vacio}>
        <span className="sol-deco" style={{ margin: '0 auto 16px', opacity: 0.4 }} />
        <p>Ninguna tienda coincide con los filtros actuales.</p>
      </div>
    );
  }

  return (
    <div className={s.lista} role="list">
      {tiendas.map((t) => {
        const ap = estadoApertura(t, barcelonaTime);
        const seleccionada = tiendaSeleccionada?.id === t.id;
        return (
          <button
            key={t.id}
            className={`${s.card} ${seleccionada ? s.cardSeleccionada : ''}`}
            onClick={() => onSeleccionar(t)}
            aria-selected={seleccionada}
            role="listitem"
          >
            {/* Left accent bar when selected */}
            {seleccionada && <div className={s.accentBar} aria-hidden="true" />}

            <div className={s.cardInner}>
              <div className={s.cardTop}>
                <div className={s.cardInfo}>
                  <span className={s.nombre}>{t.nombre}</span>
                  <span className={s.barrio}>
                    <MapPin size={11} strokeWidth={2} />
                    {t.barrio}
                  </span>
                </div>
                {t.valoracionGoogle && (
                  <span className={s.rating}>
                    <Star size={11} fill="var(--color-secundario)" strokeWidth={0} />
                    {t.valoracionGoogle.toFixed(1)}
                  </span>
                )}
              </div>

              <div className={s.cardBottom}>
                <EstadoChip estado={ap.estado} texto={ap.texto} />
                {posicionUsuario && t._distancia !== undefined && (
                  <span className={s.distancia}>
                    <Navigation size={11} />
                    {formatDistancia(t._distancia)}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
