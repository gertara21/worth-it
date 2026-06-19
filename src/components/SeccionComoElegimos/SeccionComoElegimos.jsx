import { MapPin, Award, Leaf, Package, X } from 'lucide-react';
import s from './SeccionComoElegimos.module.css';

const CRITERIOS = [
  {
    Icon: MapPin,
    titulo: 'Tienda física en Barcelona ciudad',
    texto: 'Todas las tiendas tienen un local físico abierto al público dentro del municipio de Barcelona. Nada de pop-ups puntuales ni puro comercio online.',
  },
  {
    Icon: Award,
    titulo: 'Marca propia o diseño propio',
    texto: 'Priorizamos marcas que diseñan y/o producen sus propias colecciones, sin depender de franquicias ni de la comercialización de grandes cadenas. El criterio es que haya un creador con nombre y proyecto detrás.',
  },
  {
    Icon: Leaf,
    titulo: 'Local, slow o sostenible',
    texto: 'Buscamos tiendas con al menos uno de estos criterios claros: producción en España (a ser posible en Barcelona), orientación slow fashion, uso de materiales certificados, comercio justo o transparencia en la cadena de producción.',
  },
  {
    Icon: Package,
    titulo: 'Durabilidad por encima de volumen',
    texto: 'Descartamos marcas cuyo modelo de negocio depende del consumo acelerado y la obsolescencia rápida. Queremos tiendas que apuesten por prendas que duren.',
  },
];

const EXCLUIDOS = [
  'Tiendas de segunda mano o vintage puras (no encajan con el foco de moda local producida)',
  'Franquicias y cadenas de distribución masiva',
  'Tiendas sin ninguna información verificable sobre producción u origen',
  'Locales sin presencia física en Barcelona ciudad',
];

export default function SeccionComoElegimos() {
  return (
    <section className={s.wrap}>
      <div className={s.hero}>
        <div className={s.heroInner}>
          <span className="sol-deco" style={{ margin: '0 auto 24px', width: '100px', height: '50px' }} />
          <h1 className={s.titulo}>Cómo elegimos las tiendas</h1>
          <p className={s.subtitulo}>
            No es una guía de estilo. Es una selección con criterios.
          </p>
        </div>
      </div>

      <div className={s.contenido}>
        <div className={s.inner}>
          {/* Intro */}
          <div className={s.intro}>
            <p>
              Worth It nace del reto de hacer que <strong>el impacto de lo que compras sea tan visible como su precio</strong>. La sección "Comprar" recoge tiendas de moda local y sostenible en Barcelona que hemos revisado una a una.
            </p>
            <p>
              No somos perfectos ni exhaustivos. El piloto actual cubre ~35 tiendas. Si conoces una que falta o una que no debería estar, cuéntanoslo desde la sección <strong>Comunidad</strong>.
            </p>
          </div>

          {/* Criterios */}
          <h2 className={s.seccionTitulo}>Los cuatro criterios de inclusión</h2>
          <div className={s.criteriosGrid}>
            {CRITERIOS.map(({ Icon, titulo, texto }, i) => (
              <div key={titulo} className={s.criterioCard}>
                <div className={s.num}>0{i + 1}</div>
                <div className={s.criterioIcon}>
                  <Icon size={24} strokeWidth={1.8} />
                </div>
                <h3 className={s.criterioTitulo}>{titulo}</h3>
                <p className={s.criterioTexto}>{texto}</p>
              </div>
            ))}
          </div>

          {/* Excluidos */}
          <div className={s.excluidosBox}>
            <h2 className={s.seccionTitulo} style={{ marginBottom: 20 }}>Qué no incluimos</h2>
            <ul className={s.excluidosList}>
              {EXCLUIDOS.map((e) => (
                <li key={e} className={s.excluidoItem}>
                  <X size={16} className={s.xIcon} />
                  {e}
                </li>
              ))}
            </ul>
          </div>

          {/* Definiciones */}
          <div className={s.definiciones}>
            <div className={s.defCard}>
              <h3>¿Qué entendemos por "local"?</h3>
              <p>
                Una tienda "local" tiene su base en Barcelona y, preferiblemente, diseña o produce aquí. El vínculo con la ciudad es claro: no es simplemente que estén físicamente aquí, sino que su proyecto nació y crece en Barcelona.
              </p>
            </div>
            <div className={s.defCard}>
              <h3>¿Qué entendemos por "sostenible"?</h3>
              <p>
                Sostenible no es un sello único. Valoramos la transparencia (saber quién hace qué y cómo), los materiales (orgánicos, reciclados, certificados), la durabilidad (diseñado para durar, no para la temporada) y las condiciones de quien produce.
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className={s.disclaimer}>
            <p>
              <strong>Una nota honesta:</strong> no verificamos en persona todas las afirmaciones de cada marca. Confiamos en la información pública, las reseñas y nuestra investigación, pero podemos equivocarnos. Si detectas algo incorrecto, te agradecemos que nos lo digas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
