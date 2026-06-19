import { useState, useEffect } from 'react';
import { getBarcelonaDatetime } from '../utils/abierto';

export function useBarcelona() {
  const [dt, setDt] = useState(() => getBarcelonaDatetime());

  useEffect(() => {
    const tick = () => setDt(getBarcelonaDatetime());
    // Sync to the next full minute, then tick every 60s
    const msToNextMinute = (60 - new Date().getSeconds()) * 1000;
    const timeout = setTimeout(() => {
      tick();
      const interval = setInterval(tick, 60_000);
      return () => clearInterval(interval);
    }, msToNextMinute);
    return () => clearTimeout(timeout);
  }, []);

  return dt;
}
