# CRUSH — Design system & art direction

Sitio: crushculture.es (nueva versión). Local: Crush, Av. de Niza 12, Playa de San Juan, Alicante.
Este documento es el generador de restricciones. Todo lo que no encaje aquí se elimina.

## 1. Visual thesis

> **Un local, un día entero.** La web es un arco solar: luz mediterránea blanqueada y tipografía geométrica ancha por la mañana, una franja de buganvilla al atardecer, y el neón violeta del letrero real de Crush por la noche. Se hace scroll a través de las horas.

Concepto creativo raíz (del informe): **DAY → NIGHT**. Promesa funcional: *Food, drinks & beats*. Promesa emocional: *Belong somewhere*.

Prueba del logo-swap: la web no funciona para otra marca porque el dispositivo central (el reloj que avanza con el scroll, la paleta que va de arena a neón, las torres de socorrista "Miami" de Playa de San Juan, Cadenza/OPUS) es de Crush.

## 2. Color world

No se distribuye el color uniformemente. Proporción aproximada: 80 % neutros (arena / tinta), 15 % superficies de apoyo, 5 % acento.
El violeta **nunca** es un degradado decorativo: es una fuente de luz física (el letrero neón). Aparece como glow, no como fondo.

Tres acentos reales de marca, uno por capítulo (nunca los tres juntos):

| Capítulo | Acento | Origen |
|---|---|---|
| Day | Turquesa `#0FA3A8` | gráfica Cadenza, mar |
| Sunset | Magenta `#FF3FA0` | buganvilla del local |
| Night | Rosa neón `#FF6FB5` (glow `#FF1F8F`) | letrero neón "Crush" del local |

Tokens semánticos (`src/styles/tokens.css`), con dos sets: `day` y `night`. Un set `sunset` hereda de `day` con canvas más cálido.

## 3. Typography

- **Display: Unbounded Variable** (300–800). Ancha y geométrica: conecta con el logotipo (geométrico redondeado) y con la cultura de música electrónica. Tracking −0.03em en tamaños grandes.
- **Acento editorial: Instrument Serif italic.** Palabras enfatizadas dentro de titulares ("first coffee", "belong"), citas del fundador. Es la parte cálida, mediterránea, chill.
- **Cuerpo / UI: Manrope Variable.** Neutra, con carácter humanista, buena en 15–17 px.

Escala fluida (clamp): display-xl 3.5rem→11rem · display 2.5rem→6.5rem · h2 2rem→3.75rem · h3 1.375rem→1.75rem · body 1.0625rem · small .875rem · label .72rem mayúsculas tracking .16em.
Etiqueta de marca recurrente: `FOOD · DRINKS · BEATS` (del logotipo). Sustituye a los "eyebrow" genéricos.

## 4. Grid & espacio

12 columnas, gutter 24 px, márgenes `clamp(20px, 4vw, 72px)`, ancho máximo de texto 1440 px, media a sangre completa permitida.
Ritmo de sección: `--space-section: clamp(6rem, 12vw, 12rem)`. Pausas narrativas más largas entre capítulos que entre bloques.

## 5. Forma

Dos radios: `0` (media, secciones, listas editoriales) y `999px` (chips, botones). Inputs 4 px. Nada de tarjetas redondeadas por defecto.

## 6. Superficies y material

- Día: papel mate. Sin sombras. Jerarquía por reglas (`1px`), campos de color y escala.
- Noche: tinta con tinte violeta (`#0B0910`). El único material "vidrio" permitido es sobre fotografía (chips sobre el letrero neón).
- Fotografía: real del local (torres de socorrista, letrero neón, DJs entre buganvillas, producto). Tratamiento: sin filtros, recortes decididos, grano ligero solo de noche.

## 7. Motion

Personalidad: **elegante de día, rítmica de noche.**
- `--ease-out: cubic-bezier(.16,1,.3,1)`, `--ease-inout: cubic-bezier(.65,0,.35,1)`.
- Duraciones: fast .16s · standard .4s · scene .8s · hero 1.2s.
- Revelado de texto: máscara por líneas (SplitText), nunca por caracteres.
- Revelado de imagen: clip-reveal vertical + escala 1.08→1.
- De noche, un pulso sutil a 124 BPM (484 ms) en el bloque OPUS. Solo ahí.
- Scroll = tiempo. En la home, un reloj en la nav avanza 09:00→02:00 con el scroll y el tema cambia por capítulo (inversión de capítulo con transición de 0.9 s).
- `prefers-reduced-motion`: sin parallax, sin scrub, sin pulso; solo opacidad.

## 8. Momentos firma

1. **El arco solar** (home): de arena a neón haciendo scroll, con el reloj en la nav y la barra de progreso en el color del capítulo. (Se probó un sol/luna como disco que cruzaba la página; el cliente lo descartó, no reintroducir.)
2. **A day at Crush** (home, bajo el hero): línea del día 09:00→02:00 con tres tramos (Day / Afterbeach / Night) y un marcador con la hora real de Alicante. Cada tramo enlaza con su capítulo.
3. **El chip que habla**: en la nav, un mensaje que cambia al hacer scroll con transición enmascarada (el anterior sube y se desenfoca, el nuevo entra desde abajo y el ancho de la píldora acompaña). En la home sigue la hora del arco (*Coffee o'clock → Spritz time → Cocktail time → Dancing already*). En el resto de páginas empieza por el estado real de apertura y luego recorre frases de marca. Todo en `narration()` y `CHIP_LINES` de `app.ts`.
4. **Cortina entre páginas**: la nueva página se desvela desde abajo (mismo clip-reveal que las imágenes), la anterior se atenúa.
5. **Roster de DJs** (/sound): lista editorial donde toda la fila es un enlace al Instagram del artista (patrón *stretched link*), con avatar, flecha en rosa al pasar y SoundCloud aparte. Sin imagen flotante siguiendo al cursor: se probó y el cliente la descartó.
6. **Calendario real** (/sound, enlazado desde *Events* en la nav): rejilla de mes de lunes a domingo, hoy con anillo rosa, un punto por sesión (turquesa Cadenza, rosa OPUS), contador del mes y navegación. Se alimenta del Google Calendar del local si está configurado (`PUBLIC_CRUSH_ICS`) y si no, de las reglas de `events.source.json`.
7. **Infografía de una línea**: rieles de 1 px que sitúan cada sesión dentro del día 09:00→03:00. Uno por fila de agenda y uno resumen bajo el calendario (*Where they sit in the day*). Informan sin decorar.
7. **Carrusel de productos** (home, capítulo Day): tira infinita de platos reales con precio, que se detiene al pasar el ratón.
8. **Tríptico** (home, tras Day essentials): tres columnas iguales, *Three ways to start*, con foto 4:5, categoría, nombre, precio y descripción.
6. **124 BPM** (OPUS): un medidor de cuatro barras que late a 484 ms, la única animación en bucle de la noche.
7. **Tira de fotos** (/menu): el mostrador pasando, una fila de platos a sangre completa que se detiene al pasar el ratón.
8. **Paleta de sabores** (capítulo Day): los siete iced lattes y los seis matchas como puntos de color con nombre; información real de carta convertida en gráfica.

## 9. Do / Don't

- ✅ Listas con reglas, splits 50/50, wordmark gigante en el footer (gramática transferida de la plantilla Véloce).
- ✅ Copy real: precios reales de la carta, DJs reales, horarios oficiales.
- ❌ Damero de la plantilla, tipografía condensada pesada, ocre.
- ❌ Hero centrado con badge + dos botones + captura; grids de 3 tarjetas; degradado morado-azul; blobs; "trusted by".
- ❌ Inventar valoraciones, reseñas o cifras.

## 10. Stack

Astro 7 (estático) · CSS vanilla con tokens · GSAP 3.15 (ScrollTrigger, SplitText) · Lenis · fuentes autoalojadas (Fontsource) · imágenes por `astro:assets` (AVIF/WebP, srcset).
Rutas: `/`, `/menu`, `/sound`, `/story`, `/visit`, `/404`.
