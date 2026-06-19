import { useState } from 'react';
import { Leaf, ShoppingBag, Clock, Users, TrendingDown, Heart } from 'lucide-react';
import s from './SeccionComunidad.module.css';

// Easily editable content array
const PILULAS = [
  {
    Icon: ShoppingBag,
    titulo: '¿Por qué comprar local?',
    texto: 'Cada euro que gastas en una tienda de barrio se queda más cerca: parte del dinero recircula en la economía local, se mantienen empleos y se conserva el tejido comercial de la ciudad. No es un sacrificio, es una elección consciente.',
  },
  {
    Icon: Clock,
    titulo: 'Slow fashion: comprar menos, mejor',
    texto: 'La moda rápida produce a un ritmo que el planeta no puede absorber. Slow fashion no significa renunciar al estilo: significa elegir prendas que duran, que te gustan de verdad y de las que conoces el origen.',
  },
  {
    Icon: TrendingDown,
    titulo: 'El coste real de una prenda',
    texto: 'Una chaqueta que cuesta 120€ y dura 8 años sale a 15€/año. Una de 30€ que aguanta un año sale a 30€/año y además ha tenido el doble de impacto ambiental. El precio de etiqueta no cuenta toda la historia.',
  },
  {
    Icon: Leaf,
    titulo: '¿Qué hace sostenible a una marca?',
    texto: 'No hay una sola respuesta, pero hay señales claras: materiales certificados (algodón orgánico, tejidos reciclados), producción local, cadena de suministro transparente y prendas diseñadas para durar, no para la temporada.',
  },
  {
    Icon: Users,
    titulo: 'Comercio de proximidad y comunidad',
    texto: 'Las tiendas independientes crean barrios vivos. Te conocen, escuchan lo que necesitas y a menudo son las primeras en experimentar con modelos más éticos. Cuando las dejas de visitar, las pierdes para siempre.',
  },
  {
    Icon: Heart,
    titulo: 'La pausa antes de la compra',
    texto: '¿Lo necesito de verdad? ¿Lo voy a usar más de 5 veces? ¿Sé quién lo hizo? Tres preguntas antes de pulsar "comprar" o pasar por caja. No es culpa, es consciencia.',
  },
];

export default function SeccionComunidad() {
  const [formState, setFormState] = useState({ enviado: false, error: false, enviando: false });
  const [form, setForm] = useState({ nombre: '', email: '', motivo: 'Sugerir una tienda', mensaje: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState({ enviado: false, error: false, enviando: true });
    try {
      const data = new FormData(e.target);
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
      if (res.ok) {
        setFormState({ enviado: true, error: false, enviando: false });
        setForm({ nombre: '', email: '', motivo: 'Sugerir una tienda', mensaje: '' });
      } else {
        throw new Error('Error del servidor');
      }
    } catch {
      setFormState({ enviado: false, error: true, enviando: false });
    }
  };

  return (
    <section className={s.wrap}>
      {/* Hero */}
      <div className={s.hero}>
        <div className={s.heroInner}>
          <ArcoDeco />
          <h1 className={s.titulo}>Comunidad</h1>
          <p className={s.subtitulo}>
            Consumir mejor no es complicado. Solo requiere una pausa.
          </p>
        </div>
      </div>

      {/* Píldoras de contenido */}
      <div className={s.contenido}>
        <div className={s.contenidoInner}>
          <h2 className={s.seccionTitulo}>Por qué importa lo que compras</h2>
          <div className={s.grid}>
            {PILULAS.map(({ Icon, titulo, texto }) => (
              <article key={titulo} className={s.card}>
                <div className={s.cardIcon}>
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <h3 className={s.cardTitulo}>{titulo}</h3>
                <p className={s.cardTexto}>{texto}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* CTA crowdsourcing */}
      <div className={s.crowdBanner}>
        <div className={s.crowdInner}>
          <div>
            <strong>¿Conoces una tienda que falta?</strong>
            <p>Cuéntanoslo y la revisamos para incluirla.</p>
          </div>
          <a href="#formulario" className={s.btnCrowd}>Sugerir una tienda</a>
        </div>
      </div>

      {/* Formulario */}
      <div className={s.formularioWrap} id="formulario">
        <div className={s.formularioInner}>
          <h2 className={s.seccionTitulo}>Escríbenos</h2>
          <p className={s.formSubtitulo}>Sugerencias, colaboraciones o simplemente un hola.</p>

          {formState.enviado ? (
            <div className={s.exito}>
              <span style={{ fontSize: 32 }}>✓</span>
              <strong>¡Mensaje enviado!</strong>
              <p>Gracias por escribirnos. Te respondemos pronto.</p>
            </div>
          ) : (
            <form
              name="comunidad"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className={s.form}
            >
              <input type="hidden" name="form-name" value="comunidad" />
              <input type="hidden" name="bot-field" />

              <div className={s.fila2}>
                <div className={s.campo}>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    placeholder="Tu nombre"
                    value={form.nombre}
                    onChange={handleChange}
                  />
                </div>
                <div className={s.campo}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={s.campo}>
                <label htmlFor="motivo">Motivo</label>
                <select
                  id="motivo"
                  name="motivo"
                  value={form.motivo}
                  onChange={handleChange}
                >
                  <option>Sugerir una tienda</option>
                  <option>Colaborar</option>
                  <option>Otra cosa</option>
                </select>
              </div>

              <div className={s.campo}>
                <label htmlFor="mensaje">Mensaje</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  required
                  rows={5}
                  placeholder="Cuéntanos…"
                  value={form.mensaje}
                  onChange={handleChange}
                />
              </div>

              {formState.error && (
                <p className={s.errorMsg} role="alert">
                  Algo ha fallado. Prueba de nuevo o escríbenos directamente.
                </p>
              )}

              <button
                type="submit"
                className={s.btnEnviar}
                disabled={formState.enviando}
              >
                {formState.enviando ? 'Enviando…' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function ArcoDeco() {
  return (
    <svg width="140" height="70" viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={s.arco}>
      <path d="M10 70 A60 60 0 0 1 130 70" fill="none" stroke="#F26122" strokeWidth="12" strokeLinecap="round"/>
      <path d="M22 70 A48 48 0 0 1 118 70" fill="none" stroke="#FFC54D" strokeWidth="12" strokeLinecap="round"/>
      <path d="M34 70 A36 36 0 0 1 106 70" fill="none" stroke="#7EC8F6" strokeWidth="12" strokeLinecap="round"/>
    </svg>
  );
}
