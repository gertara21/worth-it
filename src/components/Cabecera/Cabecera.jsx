import { useState } from 'react';
import { MapPin, Scissors, Users, HelpCircle, Menu, X, Sparkles } from 'lucide-react';
import { formatBarcelonaTime } from '../../utils/abierto';
import s from './Cabecera.module.css';

const NAV = [
  { id: 'comprar',  label: 'Comprar',        Icon: MapPin     },
  { id: 'reparar',  label: 'Reparar',         Icon: Scissors   },
  { id: 'comunidad',label: 'Comunidad',       Icon: Users      },
  { id: 'elegimos', label: 'Cómo elegimos',   Icon: HelpCircle },
  { id: 'test',     label: '¿Lo necesitas?',  Icon: Sparkles   },
];

export default function Cabecera({ seccionActiva, onSeccion, barcelonaTime }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const horaStr = formatBarcelonaTime(barcelonaTime);

  return (
    <header className={s.cabecera}>
      <div className={s.inner}>
        {/* Logo */}
        <button
          className={s.logo}
          onClick={() => { onSeccion('comprar'); setMenuAbierto(false); }}
          aria-label="Worth It — ir al inicio"
        >
          <LogoSVG />
        </button>

        {/* Desktop nav */}
        <nav className={s.navDesktop} aria-label="Secciones principales">
          {NAV.map(({ id, label }) => (
            <button
              key={id}
              className={`${s.navBtn} ${seccionActiva === id ? s.activo : ''}`}
              onClick={() => onSeccion(id)}
              aria-current={seccionActiva === id ? 'page' : undefined}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Barcelona clock */}
        <div className={s.reloj} aria-label={`Hora en Barcelona: ${horaStr}`}>
          <span className={s.relojPunto} />
          <span>Barcelona · {horaStr}</span>
        </div>

        {/* Mobile hamburger */}
        <button
          className={s.hamburger}
          onClick={() => setMenuAbierto((v) => !v)}
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
        >
          {menuAbierto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {menuAbierto && (
        <nav className={s.navMobile} aria-label="Menú móvil">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`${s.navMobileBtn} ${seccionActiva === id ? s.activo : ''}`}
              onClick={() => { onSeccion(id); setMenuAbierto(false); }}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
          <div className={s.relojMobile}>
            <span className={s.relojPunto} />
            Barcelona · {horaStr}
          </div>
        </nav>
      )}
    </header>
  );
}

function LogoSVG() {
  return (
    <img src="/logo.jpeg" alt="Worth It logo" height="36" style={{ display: 'block' }} />
  );
}
