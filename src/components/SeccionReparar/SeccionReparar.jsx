import { Scissors, Clock } from 'lucide-react';
import s from './SeccionReparar.module.css';

export default function SeccionReparar() {
  return (
    <section className={s.wrap}>
      <div className={s.inner}>
        <div className={s.icono} aria-hidden="true">
          <Scissors size={48} strokeWidth={1.5} />
        </div>
        <h1 className={s.titulo}>Reparar</h1>
        <p className={s.subtitulo}>
          Próximamente: tiendas de reparación de ropa y calzado para alargar<br />
          la vida de lo que ya tienes.
        </p>

        <div className={s.pildoras}>
          <div className={s.pildora}>
            <Clock size={20} />
            <div>
              <strong>¿Por qué reparar?</strong>
              <p>Alargar la vida útil de una prenda es la forma más eficiente de reducir su impacto ambiental. Una chaqueta que dura 10 años tiene una huella por uso mucho menor que tres chaquetas baratas.</p>
            </div>
          </div>
          <div className={s.pildora}>
            <Scissors size={20} />
            <div>
              <strong>Lo que buscaremos</strong>
              <p>Zapateros, modistas y talleres de reparación de proximidad en Barcelona. Ropa, calzado, complementos y más.</p>
            </div>
          </div>
        </div>

        <div className={s.cta}>
          <p>¿Conoces un taller de reparación que deberíamos incluir?</p>
          <a href="#comunidad" className={s.btnCta}>Sugerir un taller</a>
        </div>
      </div>
    </section>
  );
}
