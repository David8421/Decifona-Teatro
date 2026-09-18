# Deficciona Teatro

Sitio de la compañía teatral Deficciona Teatro, Ciudad de México.

**Producción:** https://teatro.deficciona.com

Astro 7 + Tailwind 4, con Lenis para el scroll con inercia y GSAP
ScrollTrigger para el movimiento atado al scroll. El resultado es un
sitio estático: se compila y se suben archivos.

## Poner el repositorio en marcha

```bash
git init
git add .
git commit -m "Rediseño del sitio de Deficciona Teatro"
git branch -M main
git remote add origin git@github.com:USUARIO/deficciona-teatro.git
git push -u origin main
```

Después, en **Settings → Secrets and variables → Actions**, crea
`FTP_SERVER`, `FTP_USUARIO` y `FTP_CLAVE` con los datos de la cuenta
FTP de hPanel. A partir de ahí, cada push a `main` compila y publica.

El despliegue manual y la activación de HTTPS están en
[DESPLIEGUE.md](DESPLIEGUE.md).

## Arrancar en local

```bash
pnpm install
pnpm dev          # http://localhost:4321
```

Requiere Node 22 o superior (ver `.nvmrc`).

Si `pnpm install` avisa que ignoró scripts de build, corre
`pnpm approve-builds` y acepta esbuild.

| Comando        | Qué hace                                       |
| -------------- | ---------------------------------------------- |
| `pnpm dev`     | Servidor de desarrollo con recarga en caliente |
| `pnpm build`   | Revisa tipos y compila el sitio en `dist/`     |
| `pnpm preview` | Sirve `dist/` para revisarlo antes de publicar |
| `pnpm format`  | Formatea todo el código con Prettier           |

## Estructura

```
src/
├── assets/
│   ├── scripts/motor.js      animación atada al scroll (GSAP + Lenis)
│   ├── scripts/interfaz.js   menú, acordeón, visor, video
│   └── styles/global.css     sistema de diseño (@theme)
├── components/
│   ├── sections/             una por escena de la página
│   ├── Escena.astro          rótulo numerado de sección
│   └── IndicadorEscena.astro contador y filete de progreso
├── content/obras/            el repertorio, un Markdown por montaje
├── data_files/
│   ├── sitio.ts              textos, contactos, imágenes
│   └── escenas.ts            las siete escenas de la página
├── layouts/MainLayout.astro
└── pages/
    ├── index.astro
    ├── obras/[id].astro      una página por obra
    └── 404.astro

public/.htaccess              configuración de Apache para Hostinger
herramientas/empaquetar.mjs   genera un HTML autocontenido para revisar
```

## Dónde se edita cada cosa

**Textos, teléfonos, enlaces, fotos y preguntas frecuentes**
→ `src/data_files/sitio.ts`

Es el único archivo que hay que tocar para el mantenimiento normal. Cambiar el
WhatsApp ahí lo cambia en la barra, en las obras y en contacto a la vez.

**El repertorio**
→ `src/content/obras/`

Cada montaje es un archivo Markdown. Para dar de alta uno nuevo, copia
`transitare.md`, cámbiale el nombre y edita el frontmatter.

Un archivo nuevo genera dos cosas a la vez: la tarjeta en la portada y su
propia página en `/obras/<nombre-del-archivo>`, con ficha técnica y galería.
El cuerpo del Markdown se renderiza como nota de la obra. El campo `orden`
define la posición y `invertida` alterna el lado del cartel.

**Colores, tipografía, radios y tiempos**
→ `src/assets/styles/global.css`, bloque `@theme`

Dos detalles del sistema que conviene respetar:

El acento vive en dos familias y no son intercambiables. Los tonos `foco-400` y
`foco-500` son gráficos: barras, iconos, resplandores, nunca llevan texto
encima. Los tonos `foco-700`, `800` y `900` son superficies: cualquier fondo con
texto blanco usa esos, porque el rosa brillante da 3.52:1 con blanco y no pasa
WCAG AA.

Los tiempos también son dos escalas. `--duracion-respuesta` (180ms) es para
todo lo que reacciona a un gesto del usuario; por encima de 250ms se percibe
como lentitud. Los recorridos largos van atados al scroll con `scrub`, no con
`transition`. No mezclar las dos.

**Las animaciones**
→ `src/assets/scripts/motor.js`

Cada escena está numerada y comentada. Todas usan `scrub`, es decir están atadas
a la posición del scroll en lugar de dispararse una sola vez.

**Las interacciones**
→ `src/assets/scripts/interfaz.js` (menú, acordeón, visor de imágenes, video)

## Las imágenes

Hoy se sirven desde el CDN que ya usaba el sitio anterior
(`assets.zyrosite.com`), que entrega webp o avif según el navegador. La función
`img(archivo, ancho)` en `sitio.ts` arma la URL al ancho que se pida.

Esto funciona bien y no requiere migrar nada, pero ata el sitio a ese CDN. Si en
algún momento se quiere independencia total, hay que descargar las imágenes a
`src/images/`, importarlas y usar el componente `<Image>` de Astro, que las
optimiza en el build.

## Publicar

El sitio es estático: `pnpm build` deja en `dist/` una carpeta de HTML, CSS e
imágenes que se puede subir a cualquier hosting.

**Hostinger** — sube el contenido de `dist/` a `public_html` por FTP o por el
administrador de archivos. No hace falta Node en el servidor.

**Vercel o Netlify** — conecta el repositorio. Detectan Astro solo; el comando
es `pnpm build` y la carpeta de salida `dist`.

Antes de publicar, revisa que `site` en `astro.config.mjs` apunte al dominio
definitivo: de ahí salen la URL canónica, el sitemap y el `robots.txt`.

## Accesibilidad

- Respeta `prefers-reduced-motion`: con esa preferencia activa se desactivan
  Lenis y todas las escenas de GSAP, y el contenido se muestra estático.
- El mosaico se navega con teclado (Tab, luego Enter o Espacio para ampliar,
  Escape para cerrar).
- Hay enlace de salto al contenido y foco visible en todos los elementos.
- Sin JavaScript el sitio se ve completo; solo pierde el movimiento.

## Pendiente de contenido

Tres cosas necesitan información que solo la compañía tiene:

1. **Los 22 textos alternativos del mosaico.** Hoy dicen "Archivo fotográfico de
   Deficciona Teatro, imagen N de 22". Son distintos entre sí, que era lo
   urgente, pero no describen nada. Se editan en `ARCHIVO` dentro de `sitio.ts`.
2. **El elenco.** Las biografías de "David Blanco" y "Elena Archivo" del sitio
   anterior eran relleno del generador de Hostinger y no correspondían a la
   compañía, así que quedaron fuera.
3. **Horarios, sede y costos de los talleres.** Hoy el sitio remite a WhatsApp.

También conviene revisar dónde quedó cada una de las cinco imágenes que el
sitio anterior no usaba: la banda entre el manifiesto y el repertorio, el fondo
de contacto, el fondo del 404, la foto de taller y la tercera publicación de
reconocimientos. Se colocaron por criterio de composición, sin saber qué
muestra cada una. Cambiarlas es editar `BANDA`, `FONDO_CONTACTO`, `FONDO_404`,
`TALLER_FOTO` y `RECONOCIMIENTO_FOTOS` en `sitio.ts`.

## Atribución

Este proyecto parte de la plantilla
[ScrewFast](https://github.com/mearashadowfax/ScrewFast) de Emil
Gulamov, publicada bajo licencia MIT. Se conservó su infraestructura
de Astro y su aviso de copyright; el diseño, el contenido y las
animaciones son propios.

Las fotografías y carteles pertenecen a Deficciona Teatro y no están
cubiertos por la licencia MIT del código.
