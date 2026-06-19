import { X, Phone, Globe, MapPin, Star, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { estadoApertura } from '../../utils/abierto';
import s from './FichaTienda.module.css';

const DIAS_ORDEN = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
const DIAS_LABEL = { lun: 'Lunes', mar: 'Martes', mie: 'Miércoles', jue: 'Jueves', vie: 'Viernes', sab: 'Sábado', dom: 'Domingo' };

function EstadoBadge({ estado, texto }) {
  const cls = {
    abierto: 'badge-abierto',
    'cierra-pronto': 'badge-cierra',
    cerrado: 'badge-cerrado',
    'cerrado-hoy': 'badge-cerrado',
    'sin-confirmar': 'badge-sinconfirmar',
  };
  return (
    <span className={`badge ${cls[estado] ?? 'badge-cerrado'}`}>
      <span style={{ fontSize: '8px' }}>●</span>
      {texto}
    </span>
  );
}

function HorarioInterval([apertura, cierre]) {
  return `${apertura}–${cierre}`;
}

export default function FichaTienda({ tienda, barcelonaTime, onCerrar }) {
  const [horarioExpand, setHorarioExpand] = useState(false);
  if (!tienda) return null;

  const apertura = estadoApertura(tienda, barcelonaTime);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${tienda.lat},${tienda.lon}`;

  return (
    <aside className={s.panel} aria-label={`Ficha de ${tienda.nombre}`}>
      {/* Header */}
      <div className={s.header}>
        <div className={s.headerText}>
          <h2 className={s.nombre}>{tienda.nombre}</h2>
          <p className={s.barrio}>
            <MapPin size={13} strokeWidth={2} />
            {tienda.barrio}
          </p>
        </div>
        <button className={s.cerrar} onClick={onCerrar} aria-label="Cerrar ficha">
          <X size={18} />
        </button>
      </div>

      {/* Placeholder imagen */}
      <div className={s.imagenWrap}>
        <div className={s.imagenPlaceholder} aria-hidden="true">
          <SolDecoSmall />
          <span className={s.imagenLabel}>{tienda.nombre}</span>
        </div>
      </div>

      <div className={s.body}>
        {/* Estado apertura + rating */}
        <div className={s.statusRow}>
          <EstadoBadge estado={apertura.estado} texto={apertura.texto} />
          {tienda.valoracionGoogle && (
            <span className={s.rating}>
              <Star size={13} fill="var(--color-secundario)" strokeWidth={0} />
              {tienda.valoracionGoogle.toFixed(1)}
            </span>
          )}
        </div>

        {/* Dirección */}
        <div className={s.campo}>
          <MapPin size={15} />
          <span>{tienda.direccion}</span>
        </div>

        {/* Criterio (por qué es sostenible) */}
        {tienda.criterio && (
          <div className={s.criterioBox}>
            <p className={s.criterioLabel}>Por qué la elegimos</p>
            <p className={s.criterioTexto}>{tienda.criterio}</p>
          </div>
        )}

        {/* Horario */}
        <div className={s.horarioWrap}>
          <button
            className={s.horarioToggle}
            onClick={() => setHorarioExpand((v) => !v)}
            aria-expanded={horarioExpand}
          >
            <span>{tienda.horarioTexto || 'Ver horario'}</span>
            {horarioExpand ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          {horarioExpand && (
            <div className={s.horarioTabla}>
              {DIAS_ORDEN.map((dia) => {
                const intervalos = tienda.horario[dia];
                const esDiaKey = dia === barcelonaTime.diaKey;
                return (
                  <div key={dia} className={`${s.diaRow} ${esDiaKey ? s.diaHoy : ''}`}>
                    <span className={s.diaNombre}>{DIAS_LABEL[dia]}</span>
                    <span className={s.diaHoras}>
                      {intervalos === null
                        ? '—'
                        : intervalos.length === 0
                        ? 'Cerrado'
                        : intervalos.map(([a, c]) => `${a}–${c}`).join(' / ')}
                    </span>
                  </div>
                );
              })}
              {!tienda.horarioFiable && (
                <p className={s.noFiable}>⚠ Horario sin confirmar</p>
              )}
            </div>
          )}
        </div>

        {/* Contacto */}
        <div className={s.contactos}>
          {tienda.telefono && (
            <a href={`tel:${tienda.telefono}`} className={s.contactoLink} aria-label={`Llamar a ${tienda.nombre}`}>
              <Phone size={15} />
              <span>{tienda.telefono}</span>
            </a>
          )}
          {tienda.web && (
            <a href={tienda.web} target="_blank" rel="noopener noreferrer" className={s.contactoLink} aria-label={`Web de ${tienda.nombre}`}>
              <Globe size={15} />
              <span>Sitio web</span>
              <ExternalLink size={11} />
            </a>
          )}
          {tienda.instagram && (
            <a href={tienda.instagram} target="_blank" rel="noopener noreferrer" className={s.contactoLink} aria-label={`Instagram de ${tienda.nombre}`}>
              <InstagramIcon />
              <span>Instagram</span>
              <ExternalLink size={11} />
            </a>
          )}
        </div>

        {/* CTA Cómo llegar */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={s.btnLlegar}
        >
          <MapPin size={16} />
          Cómo llegar
        </a>
      </div>
    </aside>
  );
}

function SolDecoSmall() {
  return (
    <svg width="60" height="34" viewBox="0 0 60 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5 34 A25 25 0 0 1 55 34Z" fill="#F26122" opacity="0.25"/>
      <line x1="10" y1="30" x2="50" y2="30" stroke="#F26122" strokeWidth="2" opacity="0.4"/>
      <line x1="14" y1="34" x2="46" y2="34" stroke="#F26122" strokeWidth="2" opacity="0.3"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4.5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
