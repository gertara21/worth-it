// Day index: JS getDay() → JSON key
const DIAS = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];

/** Returns current Barcelona date/time components */
export function getBarcelonaDatetime() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Madrid',
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', weekday: 'short',
    hour12: false,
  }).formatToParts(now);

  const get = (type) => {
    const p = parts.find((x) => x.type === type);
    return p ? parseInt(p.value, 10) : 0;
  };
  const weekdayStr = parts.find((x) => x.type === 'weekday')?.value ?? 'Sun';
  const WEEKDAY_MAP = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const dayOfWeek = WEEKDAY_MAP[weekdayStr] ?? 0;

  let hour = get('hour');
  if (hour === 24) hour = 0; // midnight edge case in some locales

  return {
    hour,
    minute: get('minute'),
    dayOfWeek,
    diaKey: DIAS[dayOfWeek],
  };
}

/** Formats Barcelona time as a display string, e.g. "mié · 17:42" */
export function formatBarcelonaTime(dt) {
  const DIAS_ES = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const h = String(dt.hour).padStart(2, '0');
  const m = String(dt.minute).padStart(2, '0');
  return `${DIAS_ES[dt.dayOfWeek]} · ${h}:${m}`;
}

/** Returns minutes from midnight for "HH:MM" string */
function toMin(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Returns one of:
 *  { estado: 'abierto',        texto: 'Abierto ahora',           color: 'verde' }
 *  { estado: 'cierra-pronto',  texto: 'Cierra pronto · HH:MM',  color: 'ambar' }
 *  { estado: 'cerrado',        texto: 'Cerrado · abre HH:MM',   color: 'gris'  }
 *  { estado: 'cerrado-hoy',    texto: 'Cerrado hoy',            color: 'gris'  }
 *  { estado: 'sin-confirmar',  texto: 'Horario sin confirmar',  color: 'gris'  }
 */
export function estadoApertura(tienda, dt) {
  if (!tienda.horarioFiable) {
    return { estado: 'sin-confirmar', texto: 'Horario sin confirmar', color: 'gris' };
  }

  const intervalosHoy = tienda.horario[dt.diaKey];

  if (intervalosHoy === null || intervalosHoy === undefined) {
    return { estado: 'sin-confirmar', texto: 'Horario sin confirmar', color: 'gris' };
  }
  if (intervalosHoy.length === 0) {
    return { estado: 'cerrado-hoy', texto: 'Cerrado hoy', color: 'gris' };
  }

  const ahoraMin = dt.hour * 60 + dt.minute;

  for (const [apertura, cierre] of intervalosHoy) {
    const aMin = toMin(apertura);
    const cMin = toMin(cierre);
    if (ahoraMin >= aMin && ahoraMin < cMin) {
      const restantes = cMin - ahoraMin;
      if (restantes <= 30) {
        return { estado: 'cierra-pronto', texto: `Cierra pronto · ${cierre}`, color: 'ambar' };
      }
      return { estado: 'abierto', texto: 'Abierto ahora', color: 'verde' };
    }
  }

  // Find next opening slot today
  const proximaHoy = intervalosHoy.find(([ap]) => toMin(ap) > ahoraMin);
  if (proximaHoy) {
    return { estado: 'cerrado', texto: `Cerrado · abre ${proximaHoy[0]}`, color: 'gris' };
  }

  // Check tomorrow
  const mananaKey = DIAS[(dt.dayOfWeek + 1) % 7];
  const intervalosManana = tienda.horario[mananaKey];
  if (intervalosManana && intervalosManana.length > 0) {
    return { estado: 'cerrado', texto: `Cerrado · abre mañana ${intervalosManana[0][0]}`, color: 'gris' };
  }

  return { estado: 'cerrado', texto: 'Cerrado', color: 'gris' };
}
