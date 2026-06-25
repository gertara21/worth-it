import { useState, useEffect, Component } from 'react';
import Cabecera from './components/Cabecera/Cabecera';
import SeccionComprar from './components/SeccionComprar/SeccionComprar';
import SeccionReparar from './components/SeccionReparar/SeccionReparar';
import SeccionComunidad from './components/SeccionComunidad/SeccionComunidad';
import SeccionComoElegimos from './components/SeccionComoElegimos/SeccionComoElegimos';
import Quiz from './components/Quiz';
import { useBarcelona } from './hooks/useBarcelona';

class ErrorBoundary extends Component {
  state = { error: null, stack: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) {
    this.setState({ stack: info.componentStack });
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'monospace', color: '#111', background: '#fff5f5', minHeight: '100vh' }}>
          <h2 style={{ color: '#c00' }}>Error</h2>
          <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>{this.state.error.message}</p>
          <pre style={{ fontSize: '0.8rem', color: '#555', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{this.state.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <ErrorBoundary>
      <Cabecera
        seccionActiva={seccionActiva}
        onSeccion={handleSeccion}
        barcelonaTime={barcelonaTime}
      />

      <main>
        {seccionActiva === 'comprar' && (
          <ErrorBoundary>
            <SeccionComprar
              tiendas={tiendas.filter((t) => t.tipo === 'compra')}
              cargando={cargando}
              barcelonaTime={barcelonaTime}
            />
          </ErrorBoundary>
        )}
        {seccionActiva === 'reparar' && <SeccionReparar />}
        {seccionActiva === 'comunidad' && <SeccionComunidad />}
        {seccionActiva === 'elegimos' && <SeccionComoElegimos />}
        {seccionActiva === 'test' && (
          <div style={{
            minHeight: 'calc(100vh - var(--cabecera-h))',
            background: '#F5EFE5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box'
          }}>
            <Quiz
              mode="embedded"
              onGoToComprar={() => setSeccionActiva('comprar')}
            />
          </div>
        )}
      </main>
    </ErrorBoundary>
  );
}
