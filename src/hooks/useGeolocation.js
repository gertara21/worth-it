import { useState, useCallback } from 'react';

export function useGeolocation() {
  const [posicion, setPosicion] = useState(null); // { lat, lon }
  const [estado, setEstado] = useState('idle');   // idle | loading | success | error
  const [mensaje, setMensaje] = useState('');

  const solicitar = useCallback(() => {
    if (!navigator.geolocation) {
      setEstado('error');
      setMensaje('Tu dispositivo no soporta geolocalización.');
      return;
    }
    setEstado('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosicion({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setEstado('success');
        setMensaje('');
      },
      (err) => {
        setEstado('error');
        setMensaje(
          err.code === 1
            ? 'Permiso de ubicación denegado.'
            : 'No se pudo obtener tu ubicación.'
        );
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, []);

  const limpiar = useCallback(() => {
    setPosicion(null);
    setEstado('idle');
    setMensaje('');
  }, []);

  return { posicion, estado, mensaje, solicitar, limpiar };
}
