/**
 * Empaqueta una página ya compilada en un único archivo HTML.
 *
 * Astro reparte el resultado en HTML + CSS + módulos JS enlazados por
 * ruta absoluta. Eso funciona servido, pero no al abrir el archivo con
 * doble clic. Este script mete el CSS y el JS dentro del propio HTML
 * para poder revisar la página sin levantar un servidor.
 *
 * Uso: node herramientas/empaquetar.mjs <pagina.html> <salida.html>
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const [, , entrada, salida] = process.argv;
if (!entrada || !salida) {
  console.error('Uso: node herramientas/empaquetar.mjs <entrada> <salida>');
  process.exit(1);
}

/* La raíz de la compilación es la carpeta que contiene _astro.
   Subimos desde la página hasta encontrarla, así funciona igual para
   dist/index.html que para dist/obras/transitare/index.html. */
function raizDeCompilacion(desde) {
  let dir = resolve(dirname(desde));
  for (let i = 0; i < 6; i++) {
    if (existsSync(join(dir, '_astro'))) return dir;
    dir = dirname(dir);
  }
  throw new Error('No encontré la carpeta _astro partiendo de ' + desde);
}

const base = raizDeCompilacion(entrada);

let html = readFileSync(entrada, 'utf8');
const leerActivo = ruta => readFileSync(join(base, ruta), 'utf8');

let css = 0;
let js = 0;

// Hojas de estilo locales → <style>
html = html.replace(
  /<link\s+rel="stylesheet"\s+href="(\/_astro\/[^"]+)"\s*\/?>/g,
  (_, ruta) => {
    css++;
    return `<style>\n${leerActivo(ruta)}\n</style>`;
  },
);

// Módulos locales → <script type="module">
html = html.replace(
  /<script\s+type="module"\s+src="(\/_astro\/[^"]+)"\s*><\/script>/g,
  (_, ruta) => {
    js++;
    return `<script type="module">\n${leerActivo(ruta)}\n</script>`;
  },
);

// Las rutas internas no existen al abrir el archivo suelto: lo avisamos
html = html.replace(
  /href="\/obras\/([a-z0-9-]+)"/g,
  'href="#obras" data-ruta-real="/obras/$1"',
);
html = html.replace(/href="\/#obras"/g, 'href="#obras"');
html = html.replace(/href="\/"(?![^>]*data-)/g, 'href="#inicio"');

writeFileSync(salida, html);
console.log(`${salida}: ${css} hojas y ${js} módulos incrustados`);
