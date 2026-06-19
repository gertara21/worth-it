README para Worth It
==================

Una web app que ayuda a descubrir tiendas de moda local y sostenible en Barcelona mediante un mapa interactivo.

## Instalacion

1. npm install
2. cp .env.example .env   (y pega tu clave de Google Maps)
3. npm run dev

## Build

npm run build

## Variables de entorno

VITE_GOOGLE_MAPS_API_KEY=tu_clave_de_google_maps

## Google Maps API

- Activa solo: Maps JavaScript API
- Restringe por HTTP referrers: tu dominio de Netlify + localhost:5173
- Configura alertas de presupuesto en Google Cloud Console

## Netlify

- Build command: npm run build
- Publish directory: dist
- Añade la variable VITE_GOOGLE_MAPS_API_KEY en Site Settings > Environment variables
- El formulario de Comunidad usa Netlify Forms (data-netlify=true), las respuestas llegan al panel de Netlify

## Estructura

src/components/Cabecera       Header con logo, nav y reloj Barcelona
src/components/Filtros        Barra de filtros
src/components/Mapa           Google Maps con clustering
src/components/ListaTiendas   Lista lateral
src/components/FichaTienda    Panel de detalle
src/components/SeccionComprar Seccion principal
src/components/SeccionReparar Placeholder
src/components/SeccionComunidad  Contenido + formulario
src/components/SeccionComoElegimos  Criterios
src/hooks/useBarcelona.js     Hora Europe/Madrid actualizada cada minuto
src/hooks/useGeolocation.js   Geolocalizacion del navegador
src/utils/abierto.js          Logica de apertura segun horario
src/utils/haversine.js        Calculo de distancia
public/tiendas.json           Datos de las 35 tiendas
public/_redirects             Netlify SPA redirect

## Editar textos

- Pilulas de Comunidad: src/components/SeccionComunidad/SeccionComunidad.jsx -> array PILULAS
- Criterios: src/components/SeccionComoElegimos/SeccionComoElegimos.jsx -> array CRITERIOS

## Paleta de colores

--color-fondo:      #F6F1E6  Fondo crema
--color-texto:      #111111  Texto y logo negro
--color-primario:   #F26122  Naranja marca
--color-secundario: #FFC54D  Amarillo acento
--color-info:       #7EC8F6  Azul claro acento

Tipografia: Space Grotesk (Google Fonts)
