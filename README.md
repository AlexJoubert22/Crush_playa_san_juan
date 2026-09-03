# Crush — website

Nueva web de **Crush** (Av. de Niza 12, Playa de San Juan, Alicante). Estática, cinco páginas, construida con Astro 7.
La dirección de arte está en [DESIGN.md](./DESIGN.md).

## Arrancar

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # genera /dist (HTML estático + imágenes optimizadas)
npm run preview   # sirve /dist
```

Requiere Node 22 (Astro pide ≥ 22.19; con 22.17 funciona con un aviso).

## Estructura

```
src/
  pages/        index · menu · sound · story · visit · 404
  layouts/      Base.astro  (head, fuentes, nav, footer, JSON-LD, ClientRouter)
  components/   Nav · Footer · Strap (FOOD · DRINKS · BEATS) · Arrow
  scripts/      app.ts  (Lenis, GSAP ScrollTrigger + SplitText, reveals, arco solar,
                         chip "now", agenda, roster, tabs de carta, formulario)
  styles/       tokens.css (paleta día/atardecer/noche, tipografía, espacio, motion)
                global.css (reset, roles tipográficos, botones, listas editoriales, reveals)
  data/         site.ts (dirección, horarios, contacto, sesiones)
                menu.json (174 ítems reales, precios en €, EN/ES)
                djs.json (13 residentes con enlaces)
                events.source.json (reglas de Cadenza / OPUS)
  assets/       fotos reales del local, DJs, carta, eventos, marca
public/         favicons, og.jpg
```

## Dónde se cambia cada cosa

| Qué | Dónde |
|---|---|
| Horarios, teléfono, email, dirección, redes | `src/data/site.ts` |
| Carta y precios | `src/data/menu.json` (`price` numérico; `photo` = archivo en `src/assets/menu/`) |
| DJs residentes | `src/data/djs.json` + foto en `src/assets/djs/` |
| Fotos de la carta | `src/assets/menu/`; el nombre del archivo va en el campo `photo` de `menu.json` |
| Textos y citas de las fichas destacadas de la carta | `SOLO_NOTES` en `src/pages/menu.astro` |
| Redes sociales del pie | `src/data/site.ts` (`instagram`, `facebook`, `tiktok`, `tripadvisor`) |
| Reglas de eventos (días, horas, fechas saltadas, eventos puntuales) | `src/data/events.source.json` (mismo formato que el API actual) |
| **Agenda desde Google Calendar** | variable `PUBLIC_CRUSH_ICS` — ver abajo |
| Textos de cada página | el `.astro` correspondiente en `src/pages/` |
| Colores, tipografías, ritmos | `src/styles/tokens.css` |
| Reels de la home (mañana, afterbeach, fundador) | `public/video/morning.*`, `afterbeach.*`, `belong.mp4` + pósters `.jpg`. Son reels de @crushplayasanjuan recodificados a 720×1280, sin audio. Para cambiarlos: `yt-dlp <url>` y `ffmpeg -an -vf scale=720:1280 -c:v libx264 -crf 27` |
| Mensajes del chip de la nav en la home (Coffee o'clock, Spritz time…) | función `narration()` en `src/scripts/app.ts` |

La agenda ("Next up") se calcula en el navegador con la hora de Alicante a partir de las reglas: Cadenza sábados y domingos 10:00–16:00; OPUS segundo sábado del mes 21:00–02:00. El chip "Open · …" también.

## Agenda conectada a Google Calendar

El calendario de `/sound#agenda` puede alimentarse solo desde un Google Calendar del local. Es gratis y no necesita servidor.

**Una vez, para montarlo:**

1. En Google Calendar, crea un calendario nuevo (por ejemplo *Crush · Eventos*).
2. Ajustes del calendario → **Permisos de acceso** → marca *Hacer público*.
3. Baja hasta **Integrar calendario** y copia la *Dirección pública en formato iCal* (termina en `.ics`).
4. Crea un archivo `.env` en la raíz del proyecto con esa dirección:

```
PUBLIC_CRUSH_ICS=https://calendar.google.com/calendar/ical/xxxxx/public/basic.ics
```

5. `npm run build`. Los eventos del calendario sustituyen a las reglas fijas.

**Cómo crear un evento para que salga bien:**

- **Título** del evento = nombre de la sesión (`Cadenza`, `OPUS`, `Sunset Session`…).
- **Fecha y hora** = las reales; la web dibuja la franja horaria automáticamente.
- **Descripción**, opcional, dos líneas:

```
Artist: Ale Marin, Zeta
Genre: Progressive House
```

- La repetición de Google (*todos los sábados*, *el segundo sábado de cada mes*…) se entiende, igual que las excepciones cuando borras un día suelto.

**Importante:** la web es estática, así que los cambios entran en el siguiente `build`. En Netlify, Vercel o Cloudflare Pages se programa un *build* diario gratuito y queda automático. Si el calendario no responde o no está configurado, la agenda vuelve sola a las reglas de `events.source.json`, así que nunca se queda vacía.

## Publicar

`npm run build` deja todo en `dist/`. Sube esa carpeta a cualquier hosting estático (Netlify, Vercel, Cloudflare Pages, o el hosting actual). No hay servidor ni base de datos.

## Pendiente / decisiones para el cliente

1. **Formulario de contacto**: hoy abre el cliente de correo con el mensaje. Para envío directo, poner un endpoint (Formspree, Netlify Forms, Web3Forms…) en `data-endpoint` del `<form>` en `src/pages/visit.astro`.
2. **Horarios**: la web oficial dice L–J 09–20 y V–D 09–23; Google y prensa hablan de 09:00–01:30. Se ha usado el horario oficial. Confirmar y corregir en `site.ts`.
3. **Español**: la web es en inglés (público internacional, como la actual). `menu.json` ya lleva los nombres en ES; añadir `/es` con `astro i18n` es el siguiente paso natural.
4. **Vídeo**: el "vídeo de OPUS" del API actual es un clip de stock (un perro en un prado), no del local. No se ha usado. Un clip real de 10–15 s del local de noche encajaría en el capítulo Night de la home.
5. **Fotos de 7 DJs** (Ale Marin, BASSTIANZ, Bel, Exequiel, Greg Downey, Ivvan, Zeta) son de 100 px en la web actual; se muestran como avatar. Con fotos grandes, el roster las enseña al pasar el ratón.
