import { useState, useEffect, useRef, useCallback } from 'react';

const TOTAL_SCENES = 7;

const PIN_POSITIONS = [
  { top: '38%', left: '28%', label: 'Comado Shop', big: true },
  { top: '55%', left: '42%' },
  { top: '30%', left: '60%' },
  { top: '65%', left: '67%' },
  { top: '48%', left: '22%' },
];

function SceneDots({ current }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8,
      zIndex: 100,
      pointerEvents: 'none',
    }}>
      {Array.from({ length: TOTAL_SCENES }).map((_, i) => (
        <div key={i} style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: i === current ? '#FF6A1A' : '#333',
          transition: 'background 0.3s ease',
        }} />
      ))}
    </div>
  );
}

/* ── Scene 1 ── */
function Scene1({ entered }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#111111',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 32, textAlign: 'center',
        opacity: entered ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}>
        <img
          src="https://files.catbox.moe/i8emat.png"
          alt="Worth It?"
          height="56"
          style={{
            opacity: entered ? 1 : 0,
            transition: 'opacity 0.8s ease 0.2s',
          }}
        />
        <p style={{
          fontSize: 28, color: '#F5EFE5', fontWeight: 400,
          maxWidth: 640, lineHeight: 1.5, margin: 0,
          opacity: entered ? 1 : 0,
          transition: 'opacity 0.8s ease 0.6s',
        }}>
          ¿Cuándo fue la última vez que compraste ropa sin pensarlo?
        </p>
      </div>
      <p style={{
        position: 'absolute', bottom: 40, left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 13, color: '#666',
        letterSpacing: 2, textTransform: 'uppercase', margin: 0,
        opacity: entered ? 1 : 0,
        transition: 'opacity 0.8s ease 1.2s',
        whiteSpace: 'nowrap',
      }}>
        toca para continuar
      </p>
    </div>
  );
}

/* ── Scene 2 ── */
function Scene2() {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#F5EFE5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 60px', boxSizing: 'border-box', gap: 60,
    }}>
      {/* Left column */}
      <div style={{ width: '45%', display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: 22, color: '#111', fontWeight: 700, lineHeight: 1.4, margin: 0 }}>
          El 52% de los jóvenes dice que consume de forma responsable.
        </p>
        <p style={{ fontSize: 38, color: '#FF6A1A', fontWeight: 700, margin: '24px 0 0' }}>
          Pero solo el 7% lo hace realmente.
        </p>
        <p style={{ fontSize: 16, color: '#555', lineHeight: 1.6, margin: '32px 0 0' }}>
          No es falta de valores. Es falta de herramientas.
        </p>
      </div>

      {/* Right column — static quiz mockup */}
      <div style={{ width: '55%', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          background: '#F5EFE5', borderRadius: 16,
          maxWidth: 380, width: '100%',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          overflow: 'hidden',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          {/* Quiz header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', background: '#F5EFE5',
          }}>
            <img src="https://files.catbox.moe/i8emat.png" alt="Worth It?" height="28" />
            <span style={{ fontSize: 12, color: '#999', fontWeight: 500 }}>1 / 5</span>
          </div>
          {/* Progress bar */}
          <div style={{ height: 3, background: '#e8e1d6' }}>
            <div style={{ height: '100%', background: '#FF6A1A', width: '20%' }} />
          </div>
          {/* Body */}
          <div style={{ padding: '24px 20px 20px' }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#111', lineHeight: 1.4, margin: '0 0 18px' }}>
              ¿La necesito realmente o solo me gusta la emoción de comprarla?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { emoji: '🎯', texto: 'La necesito de verdad, me falta algo concreto en el armario', selected: true },
                { emoji: '🤔', texto: 'Me gusta mucho y creo que la usaría bastante', selected: false },
                { emoji: '✨', texto: 'Me ha entrado el impulso, la verdad', selected: false },
              ].map((op, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  background: op.selected ? '#fff8f3' : '#fff',
                  border: `1.5px solid ${op.selected ? '#FF6A1A' : '#e8e1d6'}`,
                  borderRadius: 12,
                }}>
                  <span style={{ fontSize: 20, width: 26, flexShrink: 0, lineHeight: 1 }}>{op.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#111', flex: 1, lineHeight: 1.4 }}>{op.texto}</span>
                  {op.selected && (
                    <span style={{
                      width: 18, height: 18, borderRadius: '50%', background: '#FF6A1A',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, fontSize: 11, color: '#fff', fontWeight: 700,
                    }}>✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Scene 3 ── */
function Scene3() {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#111',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 20,
    }}>
      <p style={{ fontSize: 48, color: '#F5EFE5', fontWeight: 700, margin: 0, textAlign: 'center' }}>
        Hay tiendas así cerca de ti.
      </p>
      <p style={{ fontSize: 20, color: '#FF6A1A', fontWeight: 500, letterSpacing: 1, margin: 0 }}>
        Verificadas. Locales. Reales.
      </p>
    </div>
  );
}

/* ── Scene 4 ── */
function Scene4() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#111', position: 'relative', overflow: 'hidden' }}>
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=2.145,41.385,2.175,41.405&layer=mapnik"
        style={{
          width: '100%', height: '100%', border: 'none',
          filter: 'invert(1) hue-rotate(180deg) brightness(0.85) saturate(0.8)',
        }}
        title="mapa"
      />
      {/* Pins */}
      {PIN_POSITIONS.map((pin, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: pin.top,
          left: pin.left,
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          {pin.label && (
            <div style={{
              background: '#fff', color: '#111',
              fontSize: 11, fontWeight: 700,
              padding: '3px 8px', borderRadius: 6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              whiteSpace: 'nowrap',
            }}>
              {pin.label}
            </div>
          )}
          <div style={{
            width: pin.big ? 28 : 20,
            height: pin.big ? 28 : 20,
            borderRadius: '50%',
            background: '#FF6A1A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(255,106,26,0.5)',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
          </div>
        </div>
      ))}
      {/* Bottom overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
        background: 'linear-gradient(to top, #111 0%, transparent 100%)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        paddingBottom: 12, zIndex: 10,
      }}>
        <p style={{
          fontSize: 14, color: '#F5EFE5', letterSpacing: 1,
          margin: 0, fontFamily: "'Space Grotesk', sans-serif",
        }}>
          Barcelona · 35 tiendas verificadas
        </p>
      </div>
    </div>
  );
}

/* ── Scene 5 ── */
function Scene5() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Background photo */}
      <img
        src="https://files.catbox.moe/va7ttr.png"
        alt="Comado Shop"
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.5)',
      }} />

      {/* Bottom panel */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '55%',
        background: '#F5EFE5',
        borderRadius: '24px 24px 0 0',
        padding: '0 28px 28px',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Space Grotesk', sans-serif",
        overflowY: 'auto',
      }}>
        {/* Drag indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 4, background: '#ddd', borderRadius: 2 }} />
        </div>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#111', margin: 0 }}>Comado Shop</h2>
          <span style={{
            background: '#2E7D32', color: '#fff',
            fontSize: 13, fontWeight: 600,
            padding: '3px 10px', borderRadius: 20,
          }}>Abierto ahora</span>
        </div>

        <p style={{ fontSize: 14, color: '#666', margin: '0 0 16px' }}>
          Carrer del Parlament, 24, Barcelona
        </p>

        {/* Gallery */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
          {[
            'https://files.catbox.moe/bpz0cn.jpeg',
            'https://files.catbox.moe/rwjnrk.jpeg',
            'https://files.catbox.moe/7vifn8.png',
            'https://files.catbox.moe/kc7oxw.png',
          ].map((src, i) => (
            <img key={i} src={src} alt="" style={{
              width: 80, height: 80, borderRadius: 8,
              objectFit: 'cover', flexShrink: 0,
            }} />
          ))}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['🌐 Web', '📷 Instagram', '📞 Teléfono'].map((label, i) => (
            <div key={i} style={{
              fontSize: 13, color: '#111',
              border: '1.5px solid #ddd', borderRadius: 20,
              padding: '6px 14px',
            }}>
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Scene 6 ── */
function Scene6() {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#F5EFE5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 60px', boxSizing: 'border-box',
    }}>
      <div style={{ maxWidth: 720, width: '100%', fontFamily: "'Space Grotesk', sans-serif" }}>
        <div style={{
          display: 'inline-block',
          background: '#FF6A1A', color: '#fff',
          fontSize: 12, fontWeight: 700,
          padding: '6px 16px', borderRadius: 20,
          letterSpacing: 1, textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          Por qué la elegimos
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#111', margin: '0 0 24px' }}>
          Comado Shop
        </h2>
        <p style={{ fontSize: 18, color: '#444', lineHeight: 1.8, margin: '0 0 40px' }}>
          Comado es una de esas tiendas que no necesita explicarse. Producción propia
          en Barcelona, materiales trazables y una filosofía de fondo: que la ropa
          dure más que una temporada. La conocemos, la hemos visitado y cumple con
          los tres ejes que exigimos — medioambiental, social y económico.
          Está aquí porque se lo merece.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {['🌱 Producción local', '✅ Materiales trazables', '♻️ Moda duradera'].map((pill, i) => (
            <div key={i} style={{
              fontSize: 14, color: '#FF6A1A',
              border: '1.5px solid #FF6A1A',
              borderRadius: 20, padding: '8px 16px',
              background: '#F5EFE5',
            }}>
              {pill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Scene 7 ── */
function Scene7({ entered }) {
  const items = [
    { delay: '0.1s', content: <img src="https://files.catbox.moe/i8emat.png" alt="Worth It?" height="64" /> },
    { delay: '0.3s', content: <p style={{ fontSize: 32, color: '#F5EFE5', fontWeight: 400, margin: '24px 0 0', textAlign: 'center' }}>La pausa antes de la compra.</p> },
    { delay: '0.5s', content: <p style={{ fontSize: 18, color: '#FF6A1A', margin: '12px 0 0' }}>@worthit.oficial</p> },
    { delay: '0.7s', content: <p style={{ fontSize: 14, color: '#666', margin: '8px 0 0' }}>worthit.app</p> },
  ];

  return (
    <div style={{
      width: '100%', height: '100%', background: '#111',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      {items.map((item, i) => (
        <div key={i} style={{
          opacity: entered ? 1 : 0,
          transition: `opacity 0.7s ease ${item.delay}`,
        }}>
          {item.content}
        </div>
      ))}
    </div>
  );
}

/* ── Main VideoPage ── */
export default function VideoPage() {
  const [scene, setScene] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scene1Entered, setScene1Entered] = useState(false);
  const [scene7Entered, setScene7Entered] = useState(false);
  const audioRef = useRef(null);
  const musicStarted = useRef(false);
  const transitioning = useRef(false);

  // Hide cursor globally
  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => { document.body.style.cursor = ''; };
  }, []);

  // Trigger scene 1 entrance animation after mount
  useEffect(() => {
    const t = setTimeout(() => setScene1Entered(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Scene 7 fade-in
  useEffect(() => {
    if (scene === 6) {
      const t = setTimeout(() => setScene7Entered(true), 100);
      return () => clearTimeout(t);
    } else {
      setScene7Entered(false);
    }
  }, [scene]);

  // Fade-out music on last scene
  useEffect(() => {
    if (scene === 6 && audioRef.current) {
      const audio = audioRef.current;
      const startVol = audio.volume;
      const steps = 60;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        audio.volume = Math.max(0, startVol * (1 - step / steps));
        if (step >= steps) clearInterval(interval);
      }, 3000 / steps);
      return () => clearInterval(interval);
    }
  }, [scene]);

  const advance = useCallback(() => {
    if (transitioning.current) return;
    if (scene >= TOTAL_SCENES - 1) return;

    // Start music on first click
    if (!musicStarted.current) {
      musicStarted.current = true;
      const audio = new Audio('https://www.fesliyanstudios.com/play-mp3/4386');
      audio.loop = true;
      audio.volume = 0.35;
      audio.play().catch(() => {});
      audioRef.current = audio;
    }

    transitioning.current = true;
    setVisible(false);

    setTimeout(() => {
      setScene(s => s + 1);
      setVisible(true);
      setTimeout(() => { transitioning.current = false; }, 50);
    }, 400);
  }, [scene]);

  // Keyboard support
  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowRight') advance();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [advance]);

  const scenes = [
    <Scene1 entered={scene1Entered} />,
    <Scene2 />,
    <Scene3 />,
    <Scene4 />,
    <Scene5 />,
    <Scene6 />,
    <Scene7 entered={scene7Entered} />,
  ];

  return (
    <div
      onClick={advance}
      style={{
        width: '100vw', height: '100vh',
        overflow: 'hidden', position: 'fixed', inset: 0,
        fontFamily: "'Space Grotesk', sans-serif",
        userSelect: 'none',
      }}
    >
      <div style={{
        width: '100%', height: '100%',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}>
        {scenes[scene]}
      </div>
      <SceneDots current={scene} />
    </div>
  );
}
