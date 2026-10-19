# Capturas del carrusel de la landing

Las 6 pantallas de «Así se ve por dentro» (`public/carrusel/*.webp`, 750x1624) son capturas de la app. Cuando la app
cambie, hay que rehacerlas para que la página de ventas enseñe lo mismo que recibe la clienta.

1. Arranca la app: `npm run dev`
2. Genera las capturas (datos de ejemplo de «Ana»; las respuestas de la IA se simulan):
   `node scripts/capturas-carrusel/escenas.js` (o con una sola escena: `... escenas.js tarot`)
3. Convierte a WebP y sustituye en `public/carrusel/`:
   `node -e "const s=require('sharp');(async()=>{for(const n of ['inicio','descifrar','coach','tarot-temas','tarot','mapa-poder','diario'])await s('scripts/capturas-carrusel/salida/'+n+'.png').resize(750,1624).webp({quality:82}).toFile('public/carrusel/'+n+'.webp')})()"`
4. Sube el número `?v=` de cada imagen en `app/page.tsx` para que nadie vea la versión antigua guardada.

Usa Chrome instalado en el equipo (`channel: 'chrome'`). La carpeta `salida/` no se sube a git.
