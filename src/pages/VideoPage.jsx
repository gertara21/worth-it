import { useState, useEffect, useRef } from 'react';

// ─── Timeline constants (ms) ───────────────────────────────────────────────────
const TOTAL = 34000;

// ─── Animation helpers ─────────────────────────────────────────────────────────
const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const p = (start, dur, e) => clamp((e - start) / dur);
const eio = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const ep = (start, dur, e) => eio(p(start, dur, e));
const tw = (text, start, msPerChar, e) =>
  text.slice(0, Math.max(0, Math.floor((e - start) / msPerChar)));

// ─── Blinking cursor ───────────────────────────────────────────────────────────
function Cursor({ on }) {
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setVis((v) => !v), 530);
    return () => clearInterval(id);
  }, []);
  if (!on) return null;
  return <span style={{ color: '#FF6A1A', opacity: vis ? 1 : 0 }}>|</span>;
}

// ─── App UI replica ────────────────────────────────────────────────────────────
const STORES = [
  { id: 1, nombre: 'Pretty Good Concept Store', barrio: 'Gràcia',         rating: 4.9, estado: 'cerrado',        txt: 'Cerrado · abre 11:00'   },
  { id: 2, nombre: 'Collell',                    barrio: 'Horta-Guinardó', rating: 4.9, estado: 'cerrado',        txt: 'Cerrado · abre 10:00'   },
  { id: 3, nombre: 'Comado Shop',                barrio: 'El Raval',       rating: 5.0, estado: 'abierto',        txt: 'Abierto ahora'          },
  { id: 4, nombre: 'Abans Morta que Senzilla',   barrio: 'Sant Andreu',    rating: 4.8, estado: 'cerrado',        txt: 'Cerrado · abre 10:00'   },
  { id: 5, nombre: 'Annatres',                   barrio: 'Sant Andreu',    rating: 4.7, estado: 'cerrado',        txt: 'Cerrado · abre 9:00'    },
  { id: 6, nombre: 'Sílvia Moda Unisex i Comp…', barrio: 'Sant Martí',    rating: 3.7, estado: 'sin-confirmar',  txt: 'Horario sin confirmar'  },
  { id: 7, nombre: 'Modes Laia',                  barrio: 'Gràcia',        rating: 4.7, estado: 'cerrado',        txt: 'Cerrado · abre 10:00'   },
];

const CHIP_STYLES = {
  abierto:         { bg: '#e8f5e9', color: '#2E7D32' },
  cerrado:         { bg: '#f5f5f5', color: '#888'    },
  'sin-confirmar': { bg: '#f5f5f5', color: '#888'    },
};

function PinIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function StarIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF6A1A" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function StoreCard({ store, selected, style = {} }) {
  const c = CHIP_STYLES[store.estado] || CHIP_STYLES.cerrado;
  return (
    <div style={{
      position: 'relative',
      padding: '12px 16px',
      background: selected ? '#fff8f3' : '#fff',
      borderBottom: '1px solid #f0ebe4',
      transition: 'background 0.4s ease',
      ...style,
    }}>
      {selected && (
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: '#FF6A1A' }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, paddingLeft: selected ? 8 : 0 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 3, lineHeight: 1.3 }}>{store.nombre}</div>
          <div style={{ fontSize: 12, color: '#999', display: 'flex', alignItems: 'center', gap: 3 }}>
            <PinIcon size={11} />
            {store.barrio}
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#FF6A1A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0, marginLeft: 8 }}>
          <StarIcon size={11} />
          {store.rating.toFixed(1)}
        </div>
      </div>
      <div style={{ paddingLeft: selected ? 8 : 0 }}>
        <span style={{ background: c.bg, color: c.color, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6 }}>
          {store.txt}
        </span>
      </div>
    </div>
  );
}

function AppNavbar() {
  return (
    <div style={{
      height: 64, background: '#F5EFE5',
      borderBottom: '1px solid #e8e1d6',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 8,
      fontFamily: "'Space Grotesk', sans-serif", flexShrink: 0,
    }}>
      <img src="https://files.catbox.moe/i8emat.png" alt="Worth It?" height="36" style={{ marginRight: 16 }} />
      {[
        { label: 'Comprar', active: true },
        { label: 'Reparar' }, { label: 'Comunidad' },
        { label: 'Cómo elegimos' }, { label: '¿Lo necesitas?' },
      ].map(({ label, active }) => (
        <div key={label} style={{
          padding: '8px 18px', borderRadius: 24,
          fontSize: 14, fontWeight: active ? 600 : 400,
          background: active ? '#FF6A1A' : 'transparent',
          color: active ? '#fff' : '#555',
        }}>
          {label}
        </div>
      ))}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF6A1A' }} />
        Barcelona · jue · 10:30
      </div>
    </div>
  );
}

function AppFilters() {
  return (
    <div style={{
      padding: '10px 24px', background: '#F5EFE5',
      borderBottom: '1px solid #e8e1d6',
      display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#fff', border: '1.5px solid #ddd',
        borderRadius: 24, padding: '7px 14px', width: 200,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span style={{ fontSize: 13, color: '#ccc' }}>Buscar tienda…</span>
      </div>
      {['⏱ Abierto ahora', '↗ Cerca de mí', '📍 Barrio'].map((l) => (
        <div key={l} style={{
          padding: '7px 14px', borderRadius: 24, fontSize: 13,
          border: '1.5px solid #ddd', color: '#555', background: '#fff',
        }}>{l}</div>
      ))}
      <div style={{ marginLeft: 'auto', fontSize: 13, color: '#888', fontWeight: 500 }}>35 tiendas</div>
    </div>
  );
}

function AppDetailPanel({ show }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, width: 360,
      background: '#F5EFE5', borderTop: '1px solid #e8e1d6', borderRight: '1px solid #e8e1d6',
      transform: `translateY(${show ? 0 : 101}%)`,
      transition: 'transform 0.65s cubic-bezier(0.32,0.72,0,1)',
      zIndex: 20, maxHeight: '80%', overflowY: 'auto',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>Comado Shop</h2>
          <div style={{ fontSize: 13, color: '#999', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <PinIcon size={12} />El Raval
          </div>
        </div>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>
      </div>
      <img src="https://files.catbox.moe/va7ttr.png" alt="" style={{ width: '100%', height: 160, objectFit: 'cover', marginTop: 16 }} />
      <div style={{ padding: '16px 20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ background: '#e8f5e9', color: '#2E7D32', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>
            ● Abierto ahora
          </span>
          <span style={{ fontSize: 13, color: '#FF6A1A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
            <StarIcon size={13} /> 5.0
          </span>
        </div>
        <div style={{ fontSize: 13, color: '#666', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <PinIcon size={14} />Carrer del Parlament, 24
        </div>
        <div style={{ background: '#fff', borderRadius: 10, padding: '12px 14px', marginBottom: 16, border: '1px solid #e8e1d6' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#FF6A1A', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
            Por qué la elegimos
          </div>
          <div style={{ fontSize: 13, color: '#555', lineHeight: 1.65 }}>
            Producción propia en Barcelona, materiales trazables y una filosofía de fondo: que la ropa dure más que una temporada.
          </div>
        </div>
        <div style={{
          background: '#111', color: '#fff', borderRadius: 12, padding: '13px 16px',
          fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <PinIcon size={16} />Cómo llegar
        </div>
      </div>
    </div>
  );
}

function AppScreen({ elapsed }) {
  const CARD_STARTS = [7800, 8100, 8400, 8700, 9000, 9300, 9600];
  const comadoHighlight = ep(10800, 600, elapsed);
  const detailVisible = elapsed >= 12200;

  const screenOp = Math.max(0,
    ep(6000, 1200, elapsed) - ep(14500, 900, elapsed)
  );
  if (screenOp <= 0) return null;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      opacity: screenOp,
      display: 'flex', flexDirection: 'column',
      background: '#F5EFE5', pointerEvents: 'none',
    }}>
      <AppNavbar />
      <AppFilters />
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Left: store list */}
        <div style={{ width: 360, flexShrink: 0, borderRight: '1px solid #e8e1d6', overflowY: 'auto', background: '#F5EFE5', position: 'relative', zIndex: 10 }}>
          {STORES.map((store, i) => {
            const cardOp = ep(CARD_STARTS[i], 400, elapsed);
            const cardX = (1 - cardOp) * -24;
            return (
              <div key={store.id} style={{ opacity: cardOp, transform: `translateX(${cardX}px)` }}>
                <StoreCard store={store} selected={store.id === 3 && comadoHighlight > 0.5} />
              </div>
            );
          })}
        </div>

        {/* Right: map */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=2.145,41.385,2.175,41.405&layer=mapnik"
            style={{ width: '100%', height: '100%', border: 'none', filter: 'invert(1) hue-rotate(180deg) brightness(0.85) saturate(0.8)' }}
            title="mapa"
          />
          {/* Comado pin */}
          <div style={{
            position: 'absolute', top: '44%', left: '42%',
            transform: 'translate(-50%, -50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            opacity: comadoHighlight, pointerEvents: 'none',
          }}>
            <div style={{ background: '#fff', color: '#111', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.3)', whiteSpace: 'nowrap' }}>
              Comado Shop
            </div>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FF6A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(255,106,26,0.6)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
            </div>
          </div>
        </div>

        {/* Detail panel slides up */}
        <AppDetailPanel show={detailVisible} />
      </div>
    </div>
  );
}

// ─── Main VideoPage ────────────────────────────────────────────────────────────

export default function VideoPage() {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(null);
  const frameRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    document.body.style.cursor = playing ? 'none' : 'default';
    return () => { document.body.style.cursor = ''; };
  }, [playing]);

  const startPlayback = () => {
    if (playing) return;
    setPlaying(true);
    startRef.current = Date.now();
    const audio = new Audio('https://www.fesliyanstudios.com/play-mp3/4386');
    audio.loop = true;
    audio.volume = 0.35;
    audio.play().catch(() => {});
    audioRef.current = audio;
  };

  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      const e = (Date.now() - startRef.current) % TOTAL;
      setElapsed(e);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameRef.current);
      audioRef.current?.pause();
    };
  }, [playing]);

  // ── Typewriter strings ──
  const PHRASE1 = '¿Cuándo fue la última vez que compraste ropa sin pensarlo?';
  const STAT1   = 'El 52% de los jóvenes dice que consume de forma responsable.';
  const STAT2   = 'Pero solo el 7% lo hace realmente.';
  const STAT3   = 'No es falta de valores. Es falta de herramientas.';

  const phrase1 = tw(PHRASE1, 2000, 55, elapsed);
  const stat1   = tw(STAT1,  15500, 38, elapsed);
  const stat2   = tw(STAT2,  18200, 55, elapsed);
  const stat3   = tw(STAT3,  20200, 50, elapsed);

  // ── Scene opacities ──
  const op_apertura = Math.max(0, ep(400, 900, elapsed) - ep(5200, 900, elapsed));
  const op_appHint  = Math.max(0, ep(5600, 600, elapsed) - ep(14500, 900, elapsed));
  const op_stats    = Math.max(0, ep(14800, 800, elapsed) - ep(23000, 900, elapsed));
  const op_quiz     = Math.max(0, ep(23500, 800, elapsed) - ep(27200, 800, elapsed));
  const op_cierre   = ep(27800, 1000, elapsed);

  const quizAnswerSelected = elapsed >= 25800;

  return (
    <div
      onClick={startPlayback}
      style={{
        width: '100vw', height: '100vh',
        overflow: 'hidden', position: 'fixed', inset: 0,
        background: '#111111',
        fontFamily: "'Space Grotesk', sans-serif",
        userSelect: 'none',
      }}
    >
      {/* ── START SCREEN ── */}
      {!playing && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 300,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#111', cursor: 'pointer',
        }}>
          <img src="https://files.catbox.moe/i8emat.png" alt="Worth It?" height="64" style={{ marginBottom: 40 }} />
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 24,
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" stroke="none">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
          <p style={{ fontSize: 13, color: '#555', letterSpacing: 2, textTransform: 'uppercase', margin: 0 }}>
            clic para comenzar
          </p>
        </div>
      )}

      {/* ── ESCENA 1: APERTURA ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#111', opacity: op_apertura,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 48px', textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <img
          src="https://files.catbox.moe/i8emat.png"
          alt="Worth It?"
          height="72"
          style={{
            marginBottom: 48,
            opacity: ep(400, 900, elapsed),
            transform: `scale(${0.88 + 0.12 * ep(400, 900, elapsed)})`,
          }}
        />
        <p style={{ fontSize: 34, color: '#F5EFE5', fontWeight: 400, lineHeight: 1.5, maxWidth: 720, margin: 0 }}>
          {phrase1}
          <Cursor on={phrase1.length > 0 && phrase1.length < PHRASE1.length} />
        </p>
      </div>

      {/* ── ESCENA 2: APP UI ── */}
      {/* Subtle label that fades in before the app */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#F5EFE5',
        opacity: op_appHint,
        pointerEvents: 'none',
      }} />
      {playing && <AppScreen elapsed={elapsed} />}

      {/* ── ESCENA 3: ESTADÍSTICAS ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#111', opacity: op_stats,
        display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'center',
        padding: '0 10vw', pointerEvents: 'none',
      }}>
        <p style={{
          fontSize: 22, color: '#F5EFE5', fontWeight: 400,
          lineHeight: 1.65, maxWidth: 740, margin: '0 0 36px',
          opacity: ep(15500, 400, elapsed),
          transform: `translateY(${(1 - ep(15500, 400, elapsed)) * 16}px)`,
        }}>
          {stat1}
          <Cursor on={stat1.length > 0 && stat1.length < STAT1.length} />
        </p>
        <p style={{
          fontSize: 52, color: '#FF6A1A', fontWeight: 700,
          lineHeight: 1.15, maxWidth: 740, margin: '0 0 48px',
          opacity: ep(18200, 400, elapsed),
          transform: `translateY(${(1 - ep(18200, 400, elapsed)) * 20}px)`,
        }}>
          {stat2}
          <Cursor on={stat1.length === STAT1.length && stat2.length > 0 && stat2.length < STAT2.length} />
        </p>
        <p style={{
          fontSize: 20, color: '#777', fontWeight: 400,
          lineHeight: 1.6, maxWidth: 640, margin: 0,
          opacity: ep(20200, 400, elapsed),
          transform: `translateY(${(1 - ep(20200, 400, elapsed)) * 14}px)`,
        }}>
          {stat3}
          <Cursor on={stat2.length === STAT2.length && stat3.length > 0 && stat3.length < STAT3.length} />
        </p>
      </div>

      {/* ── ESCENA 4: QUIZ ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#F5EFE5', opacity: op_quiz,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          background: '#F5EFE5', borderRadius: 16, maxWidth: 420, width: '100%',
          boxShadow: '0 4px 32px rgba(0,0,0,0.12)', overflow: 'hidden',
          transform: `translateY(${(1 - ep(23500, 800, elapsed)) * 32}px)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
            <img src="https://files.catbox.moe/i8emat.png" alt="Worth It?" height="28" />
            <span style={{ fontSize: 12, color: '#999' }}>1 / 5</span>
          </div>
          <div style={{ height: 3, background: '#e8e1d6' }}>
            <div style={{ height: '100%', background: '#FF6A1A', width: '20%' }} />
          </div>
          <div style={{ padding: '24px 20px 20px' }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#111', lineHeight: 1.4, margin: '0 0 18px' }}>
              ¿La necesito realmente o solo me gusta la emoción de comprarla?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { emoji: '🎯', texto: 'La necesito de verdad, me falta algo concreto en el armario' },
                { emoji: '🤔', texto: 'Me gusta mucho y creo que la usaría bastante' },
                { emoji: '✨', texto: 'Me ha entrado el impulso, la verdad' },
              ].map((op, idx) => {
                const sel = quizAnswerSelected && idx === 0;
                return (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px',
                    background: sel ? '#fff8f3' : '#fff',
                    border: `1.5px solid ${sel ? '#FF6A1A' : '#e8e1d6'}`,
                    borderRadius: 12, transition: 'all 0.35s ease',
                  }}>
                    <span style={{ fontSize: 20, width: 26, flexShrink: 0 }}>{op.emoji}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#111', flex: 1, lineHeight: 1.4 }}>{op.texto}</span>
                    {sel && (
                      <span style={{
                        width: 18, height: 18, borderRadius: '50%', background: '#FF6A1A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, color: '#fff', fontWeight: 700, flexShrink: 0,
                      }}>✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── ESCENA 5: CIERRE ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#111', opacity: op_cierre,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <img
          src="https://files.catbox.moe/i8emat.png"
          alt="Worth It?"
          height="72"
          style={{ opacity: ep(27800, 900, elapsed), transform: `scale(${0.88 + 0.12 * ep(27800, 900, elapsed)})`, marginBottom: 28 }}
        />
        <p style={{ fontSize: 34, color: '#F5EFE5', fontWeight: 400, margin: '0 0 14px', opacity: ep(28600, 700, elapsed) }}>
          La pausa antes de la compra.
        </p>
        <p style={{ fontSize: 20, color: '#FF6A1A', margin: '0 0 8px', opacity: ep(29200, 600, elapsed) }}>
          @worthit.oficial
        </p>
        <p style={{ fontSize: 14, color: '#555', margin: 0, opacity: ep(29700, 600, elapsed) }}>
          worthit.app
        </p>
      </div>
    </div>
  );
}
