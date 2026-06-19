import { useState, useEffect } from 'react';
import Cabecera from './components/Cabecera/Cabecera';
import SeccionComprar from './components/SeccionComprar/SeccionComprar';
import SeccionReparar from './components/SeccionReparar/SeccionReparar';
import SeccionComunidad from './components/SeccionComunidad/SeccionComunidad';
import SeccionComoElegimos from './components/SeccionComoElegimos/SeccionComoElegimos';
import { useBarcelona } from './hooks/useBarcelona';

export default function App() {
  const [seccionActiva, setSeccionActiva] = useState('comprar');
  const [tiendas, setTiendas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const barcelonaTime = useBarcelona();

  useEffect(() => {
    fetch('/tiendas.json')
      .then((r) => r.json())
      .then((data) => {
        setTiendas(data.tiendas ?? []);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  // Smooth scroll to top when switching sections
  const handleSeccion = (id) => {
    setSeccionActiva(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Cabecera
        seccionActiva={seccionActiva}
        onSeccion={handleSeccion}
        barcelonaTime={barcelonaTime}
      />

      <main>
        {seccionActiva === 'comprar' && (
          <SeccionComprar
            tiendas={tiendas.filter((t) => t.tipo === 'compra')}
            cargando={cargando}
            barcelonaTime={barcelonaTime}
          />
        )}
        {seccionActiva === 'reparar' && <SeccionReparar />}
        {seccionActiva === 'comunidad' && <SeccionComunidad />}
        {seccionActiva === 'elegimos' && <SeccionComoElegimos />}
      </main>
    </>
  );
}
