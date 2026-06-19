import { useState } from 'react';
import { MapPin, Scissors, Users, HelpCircle, Menu, X } from 'lucide-react';
import { formatBarcelonaTime } from '../../utils/abierto';
import s from './Cabecera.module.css';

const NAV = [
  { id: 'comprar',  label: 'Comprar',        Icon: MapPin     },
  { id: 'reparar',  label: 'Reparar',         Icon: Scissors   },
  { id: 'comunidad',label: 'Comunidad',       Icon: Users      },
  { id: 'elegimos', label: 'Cómo elegimos',   Icon: HelpCircle },
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
    <svg width="120" height="36" viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Tag shape */}
      <rect x="1" y="1" width="88" height="34" rx="6" fill="white" stroke="#111111" strokeWidth="2"/>
      <path d="M89 18L96 10V26L89 18Z" fill="white" stroke="#111111" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="93" cy="18" r="2.5" fill="#111111"/>
      {/* Worth It text */}
      <text x="7" y="14" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="11" fill="#111111">Worth</text>
      <text x="7" y="27" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="11" fill="#111111">It?</text>
      {/* Sun */}
      <path d="M52 26 A10 10 0 0 1 72 26Z" fill="#F26122"/>
      <line x1="54" y1="24" x2="70" y2="24" stroke="white" strokeWidth="1.5"/>
      <line x1="55" y1="26.5" x2="69" y2="26.5" stroke="white" strokeWidth="1.5"/>
      {/* Claim */}
      <text x="100" y="16" fontFamily="Space Grotesk, sans-serif" fontWeight="500" fontSize="7" fill="#111111">La pausa</text>
      <text x="100" y="25" fontFamily="Space Grotesk, sans-serif" fontWeight="500" fontSize="7" fill="#111111">antes de</text>
    </svg>
  );
}
