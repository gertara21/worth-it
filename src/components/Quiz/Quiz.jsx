import { useState, useEffect } from 'react';

const PREGUNTAS = [
  {
    texto: "¿La necesito realmente o solo me gusta la emoción de comprarla?",
    pista: "",
    opciones: [
      { emoji: "🎯", texto: "La necesito de verdad, me falta algo concreto en el armario", pts: 3 },
      { emoji: "🤔", texto: "Me gusta mucho y creo que la usaría bastante", pts: 2 },
      { emoji: "✨", texto: "Me ha entrado el impulso, la verdad", pts: 1 }
    ]
  },
  {
    texto: "¿Con cuántas prendas de tu armario puedes combinarla?",
    pista: "",
    opciones: [
      { emoji: "👗", texto: "Con muchas — combina con casi todo lo que tengo", pts: 3 },
      { emoji: "👔", texto: "Con alguna cosa — tengo claro con qué iría", pts: 2 },
      { emoji: "🤷", texto: "No lo tengo muy claro todavía", pts: 1 }
    ]
  },
  {
    texto: "¿Tienes ya una prenda muy similar en casa?",
    pista: "",
    opciones: [
      { emoji: "❌", texto: "No, me falta algo así", pts: 3 },
      { emoji: "🔄", texto: "Tengo algo parecido pero está muy desgastado o ya no me vale", pts: 2 },
      { emoji: "👀", texto: "Sí, tengo algo bastante parecido", pts: 1 }
    ]
  },
  {
    texto: "¿Justifica su precio el coste por uso?",
    pista: "Divide el precio de la prenda entre las veces que estimas ponértela.",
    opciones: [
      { emoji: "💚", texto: "Sí — me la pondré muchas veces, sale barata por uso", pts: 3 },
      { emoji: "🟡", texto: "Más o menos — tampoco me la pondré tantísimo", pts: 2 },
      { emoji: "🔴", texto: "La verdad es que no creo que me la ponga mucho", pts: 1 }
    ]
  },
  {
    texto: "Si no estuviera rebajada, ¿también la querrías?",
    pista: "",
    opciones: [
      { emoji: "✅", texto: "Sí, la quiero al precio que sea", pts: 3 },
      { emoji: "💭", texto: "Tendría que pensármelo más", pts: 2 },
      { emoji: "🏷️", texto: "Siendo sincero/a... es la oferta lo que me engancha", pts: 1 }
    ]
  }
];

const RESULTADOS = [
  {
    rango: [12, 15],
    icono: "🌿",
    label: "Compra justificada",
    labelColor: "#2E7D32",
    titulo: "¡Adelante, es tuya!",
    texto: "Has pensado bien esta compra. Sabes para qué la quieres, con qué combina y cuánto le vas a sacar. Eso ya marca la diferencia.",
    ctaPre: "Y si además quieres que tu compra tenga un impacto positivo...",
    ctaBtn: "Descubre negocios locales sostenibles →"
  },
  {
    rango: [8, 11],
    icono: "⏳",
    label: "Tómate tu tiempo",
    labelColor: "#B45309",
    titulo: "Espera 48 horas",
    texto: "Hay algo que te llama de esta prenda, pero algunas respuestas generan dudas. Déjala reposar un par de días — si sigues pensando en ella, probablemente sea una buena compra.",
    ctaPre: "Mientras tanto, descubre tiendas donde cada compra tiene un impacto real.",
    ctaBtn: "Explorar tiendas responsables →"
  },
  {
    rango: [5, 7],
    icono: "🤔",
    label: "Reflexiona un poco más",
    labelColor: "#C2410C",
    titulo: "Espera un momento",
    texto: "Puede que ahora no sea el mejor momento para esta compra. No pasa nada — reconocer eso también es una decisión inteligente. Tu armario (y tu bolsillo) te lo agradecerán.",
    ctaPre: "Cuando sí lo tengas claro, aquí tienes dónde comprar bien.",
    ctaBtn: "Descubre el impacto de tus compras →"
  }
];

function getResultado(puntos) {
  return RESULTADOS.find(r => puntos >= r.rango[0] && puntos <= r.rango[1]);
}

export default function Quiz({ mode = 'embedded', onGoToComprar }) {
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [seleccionada, setSeleccionada] = useState(null);
  const [puntos, setPuntos] = useState(0);
  const [terminado, setTerminado] = useState(false);
  const [visible, setVisible] = useState(true);
  const [logoError, setLogoError] = useState(false);

  const progreso = terminado
    ? 100
    : ((preguntaActual + 1) / PREGUNTAS.length) * 100;

  function handleOpcion(idx, pts) {
    if (seleccionada !== null) return;
    setSeleccionada(idx);
    const nuevoPuntos = puntos + pts;

    setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        if (preguntaActual + 1 >= PREGUNTAS.length) {
          setPuntos(nuevoPuntos);
          setTerminado(true);
        } else {
          setPreguntaActual(p => p + 1);
          setPuntos(nuevoPuntos);
          setSeleccionada(null);
        }
        setVisible(true);
      }, 180);
    }, 300);
  }

  function handleCTA() {
    if (mode === 'embedded' && typeof onGoToComprar === 'function') {
      onGoToComprar();
    } else {
      window.location.href = '/';
    }
  }

  const resultado = terminado ? getResultado(puntos) : null;

  return (
    <div style={{
      background: '#F5EFE5',
      borderRadius: '16px',
      width: '100%',
      maxWidth: '420px',
      fontFamily: "'Space Grotesk', sans-serif",
      overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        background: '#F5EFE5'
      }}>
        {logoError ? (
          <span style={{ color: '#FF6A1A', fontWeight: 700, fontSize: '16px' }}>Worth It?</span>
        ) : (
          <img
            src="https://files.catbox.moe/i8emat.png"
            alt="Worth It?"
            height="28"
            style={{ display: 'block' }}
            onError={() => setLogoError(true)}
          />
        )}
        <span style={{ fontSize: '12px', color: '#999', fontWeight: 500 }}>
          {terminado ? '✓' : `${preguntaActual + 1} / ${PREGUNTAS.length}`}
        </span>
      </div>

      {/* Barra de progreso */}
      <div style={{ height: '3px', background: '#e8e1d6' }}>
        <div style={{
          height: '100%',
          background: '#FF6A1A',
          width: `${progreso}%`,
          transition: 'width 0.35s ease'
        }} />
      </div>

      {/* Cuerpo */}
      <div
        style={{
          padding: '24px 20px 20px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease'
        }}
      >
        {!terminado ? (
          <>
            <p style={{
              fontSize: '17px',
              fontWeight: 700,
              color: '#111',
              lineHeight: 1.4,
              margin: '0 0 6px'
            }}>
              {PREGUNTAS[preguntaActual].texto}
            </p>
            {PREGUNTAS[preguntaActual].pista && (
              <p style={{
                fontSize: '12px',
                color: '#999',
                marginTop: '6px',
                marginBottom: '18px',
                lineHeight: 1.5
              }}>
                {PREGUNTAS[preguntaActual].pista}
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: PREGUNTAS[preguntaActual].pista ? 0 : '18px' }}>
              {PREGUNTAS[preguntaActual].opciones.map((op, idx) => {
                const estaSeleccionada = seleccionada === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOpcion(idx, op.pts)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      background: estaSeleccionada ? '#fff8f3' : '#fff',
                      border: `1.5px solid ${estaSeleccionada ? '#FF6A1A' : '#e8e1d6'}`,
                      borderRadius: '12px',
                      cursor: seleccionada !== null ? 'default' : 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      transition: 'border-color 0.15s, background 0.15s',
                      fontFamily: "'Space Grotesk', sans-serif"
                    }}
                  >
                    <span style={{ fontSize: '20px', width: '26px', flexShrink: 0, lineHeight: 1 }}>
                      {op.emoji}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#111', flex: 1, lineHeight: 1.4 }}>
                      {op.texto}
                    </span>
                    {estaSeleccionada && (
                      <span style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#FF6A1A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '11px',
                        color: '#fff',
                        fontWeight: 700
                      }}>
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          resultado && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '44px', marginBottom: '12px', lineHeight: 1 }}>
                {resultado.icono}
              </div>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: resultado.labelColor,
                marginBottom: '8px'
              }}>
                {resultado.label}
              </div>
              <h2 style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#111',
                margin: '0 0 12px'
              }}>
                {resultado.titulo}
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#555',
                lineHeight: 1.65,
                margin: 0
              }}>
                {resultado.texto}
              </p>

              <div style={{ borderTop: '0.5px solid #e8e1d6', margin: '18px 0' }} />

              <p style={{
                fontSize: '12px',
                color: '#999',
                fontStyle: 'italic',
                marginBottom: '14px',
                lineHeight: 1.5
              }}>
                {resultado.ctaPre}
              </p>
              <button
                onClick={handleCTA}
                style={{
                  background: '#111',
                  color: '#fff',
                  borderRadius: '11px',
                  padding: '15px',
                  fontSize: '15px',
                  fontWeight: 600,
                  width: '100%',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}
              >
                {resultado.ctaBtn}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
