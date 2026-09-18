import { ESCENAS } from './escenas';

/**
 * Punto único de edición para el contenido que no vive en colecciones.
 * Cambiar un teléfono, un enlace o una foto se hace aquí y se refleja
 * en todo el sitio.
 */

export const SITIO = {
  nombre: 'Deficciona Teatro',
  lema: 'Compañía teatral de la Ciudad de México',
  descripcion:
    'Compañía independiente de teatro de la Ciudad de México. Desde 2012 creamos ficciones que caminan sobre la línea que separa lo cómico de lo trágico. Repertorio, talleres y contacto.',
  url: 'https://teatro.deficciona.com',
  correo: 'dficciona.teatro@gmail.com',
  whatsapp: '525533420219',
  whatsappVisible: '55 3342 0219',
  fundacion: 2012,
};

/** El CDN de las imágenes ya entrega webp/avif según el navegador. */
const CDN = 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=';
const CARPETA = '/B9mlveEgzkhC7hDR/';

/** Construye la URL de una imagen al ancho que se necesite. */
export const img = (archivo: string, ancho: number) =>
  `${CDN}${ancho}${CARPETA}${archivo}`;

export const LOGO = 'logo_dficciona_fondonegro-lAo5v6mlXVLybc6U.png';

export const HERO = {
  imagen: 'img-20260712-wa0020-hLIcC1XO3BZYZVAP.jpg',
  alt: 'La compañía en escena bajo luz azul, durante una función',
};

export const VIDEO_ID = 'vxWy3tHshnY';

export const NAVEGACION = ESCENAS.filter(e => e.enMenu).map(e => ({
  texto: e.rotulo === 'Última escena' ? 'Contacto' : e.rotulo,
  url: `#${e.ancla}`,
}));

export const REDES = [
  { nombre: 'Instagram', url: 'https://www.instagram.com/dficcionateatro/' },
  { nombre: 'Facebook', url: 'https://www.facebook.com/dficcionateatro/' },
  { nombre: 'X', url: 'https://x.com/dficcionateatro' },
  { nombre: 'YouTube', url: 'https://www.youtube.com/@dficcionateatro' },
];

export const CIFRAS = [
  { dato: '2012', pie: 'Año de fundación' },
  { dato: 'CDMX', pie: 'Base de la compañía' },
];

/** Fotos del recorrido horizontal de Transitare. */
export const TRAYECTOS = [
  {
    archivo: 'bicitrailer-sd-fIfMXxwJacaMPXsy.jpg',
    titulo: 'Bicicleta y tráiler',
    pie: 'El primer cruce',
  },
  {
    archivo: 'automoto-sd-PFtSfqffqbmIWdFV.jpg',
    titulo: 'Auto y moto',
    pie: 'La prisa',
  },
  {
    archivo: 'microauto-sd-L6SIT8U6BWr7GznT.jpg',
    titulo: 'Microbús y auto',
    pie: 'El desvío',
  },
  {
    archivo: 'microbici-sd-ntreIkxroCYMBQ3y.jpg',
    titulo: 'Microbús y bicicleta',
    pie: 'El punto ciego',
  },
  {
    archivo: 'doble-copy-fMIPVMOBnxu2lgn6.jpg',
    titulo: 'El cruce',
    pie: 'Todos son uno',
  },
];

export const RECONOCIMIENTOS = [
  {
    anio: '2025',
    titulo: 'PECDA San Luis Potosí',
    detalle:
      'Programa de Estímulo a la Creación y Desarrollo Artístico, Secretaría de Cultura.',
  },
  {
    anio: '2025',
    titulo: 'Drinky Fest',
    detalle:
      'Mejor Actor, Mejor Dramaturgia y Mejor Espectáculo Destacado con Mila Morez contra la muerte.',
  },
];

export const RECONOCIMIENTO_FOTOS = [
  {
    archivo: 'screenshot-2026-08-03-8.38.35-pm-BHoIObuSiL1NVgTx.png',
    alt: 'Publicación del reconocimiento a la compañía',
  },
  {
    archivo: 'screenshot-2026-08-03-8.39.00-pm-W1UJeAxJ4H77r6aX.png',
    alt: 'Publicación del reconocimiento a la compañía',
  },
  {
    archivo: 'screenshot-2026-08-03-8.39.09-pm-0IGFjNbrOh6x3imR.png',
    alt: 'Publicación del reconocimiento a la compañía',
  },
];

/** Imagen a ancho completo que separa el manifiesto del repertorio. */
export const BANDA = {
  archivo: 'img-20260712-wa0017-yOJemJGg4DL7KYuT.jpg',
  alt: 'Escena de una función de Deficciona Teatro',
};

/** Fondo de la sección de contacto. */
export const FONDO_CONTACTO = {
  archivo: 'img-20260712-wa0025-KpN6IX9E9SgliQpR.jpg',
  alt: '',
};

/** Fondo de la página de error. */
export const FONDO_404 = {
  archivo: 'img-20260712-wa0018-FpAbGbWA9WL88Tzq.jpg',
  alt: '',
};

/** Fotografía de una sesión de taller. */
export const TALLER_FOTO = {
  archivo: 'screenshot-2026-08-02-2.38.21-pm-Da033k43Fpl8YmkE.png',
  alt: 'Sesión de taller de Deficciona Teatro',
};

export const TALLERES = [
  {
    titulo: 'Actuación',
    texto:
      'Trabajo sobre el personaje, la voz y la construcción de escena. Del texto al cuerpo.',
  },
  {
    titulo: 'Improvisación',
    texto:
      'Juego, escucha y respuesta inmediata. Herramientas para crear sin red y sostener la escena viva.',
  },
  {
    titulo: 'Expresión corporal',
    texto:
      'El cuerpo como primer lenguaje. Movimiento, presencia y ocupación del espacio escénico.',
  },
];

export const PREGUNTAS = [
  {
    pregunta: '¿Quiénes pueden participar?',
    respuesta:
      'Cualquier persona interesada en el teatro, sin importar su experiencia previa. No hay límite de edad: los talleres están abiertos para todas las edades.',
  },
  {
    pregunta: '¿Cómo me inscribo?',
    respuesta:
      'Escríbenos por WhatsApp al 55 3342 0219 o al correo dficciona.teatro@gmail.com y te compartimos horarios, sede y costos del taller que te interese.',
  },
  {
    pregunta: '¿Dónde se realizan las clases?',
    respuesta:
      'Las clases son presenciales en nuestro espacio teatral. Confirmamos la dirección exacta al momento de la inscripción.',
  },
  {
    pregunta: '¿Qué necesito llevar?',
    respuesta:
      'Ropa cómoda y ganas de aprender. Nosotros proveemos todo lo demás.',
  },
];

/**
 * Historial de montajes. Obras que la compañía ya presentó y que no
 * están en gira activa. Se conserva del sitio anterior: es la prueba
 * de trayectoria que un programador de festival busca.
 */
export const HISTORIAL = [
  {
    titulo: 'Casting',
    subtitulo: 'para actor sin competencia',
    autoria: 'Unipersonal de David Blanco',
    reparto: '',
    sede: 'Sala Novo de Teatro La Capilla',
    direccion: 'Madrid 13, Del Carmen, Coyoacán, CDMX',
    temporada: 'Del 2 al 30 de septiembre, viernes 19:00 h',
    archivo:
      '14068591_291142531250242_205629226790081546_o-AF7zmaSXydNWu7zb.jpeg',
    alt: 'Cartel de Casting, para actor sin competencia',
  },
  {
    titulo: 'Conectado',
    subtitulo: '',
    autoria: 'De David Blanco',
    reparto: 'Con Javier Quijano y Brian Espitia',
    sede: 'Centro Cultural Jesús Romero',
    direccion: 'Culiacán 103, Col. Hipódromo, CDMX',
    temporada: '1 de marzo, 20:30 h',
    archivo: 'whatsapp-image-2026-06-20-at-8.33.16-pm-1-E9qmnOpHNt49sWbq.jpeg',
    alt: 'Cartel de Conectado',
  },
  {
    titulo: 'Miss Pandemia 2020',
    subtitulo: '',
    autoria: '',
    reparto: '',
    sede: '',
    direccion: '',
    temporada: '',
    archivo: 'img-20260808-wa0002-8dHZrl3Fhs0a4dIJ.jpg',
    alt: 'Cartel de Miss Pandemia 2020',
  },
  {
    titulo: 'Apócrifo',
    subtitulo: 'o de los evangelios según el capital variable',
    autoria: 'De David Blanco',
    reparto: '',
    sede: 'Centro Cultural El Hormiguero',
    direccion: 'Ciudad de México',
    temporada: '1 y 2 de abril, jueves y viernes 21:00 h. Función virtual',
    archivo: '3.-cartel-apa3crifo-ctvYK4rTqYstudbb.jpeg',
    alt: 'Cartel de Apócrifo, o de los evangelios según el capital variable',
  },
];

/**
 * Retratos del elenco. Se muestran en rejilla uniforme, recortados
 * desde arriba para que la cara quede dentro del encuadre.
 */
export const ARCHIVO = [
  'picture1-S2SdCpPkz3usmN74.png',
  'picture2-Yh9ZthKpofTJD9tl.png',
  'picture3-PI5zeDcOVN6qa6vl.png',
  'picture4-0RVHVHsyNEv2LdBV.png',
  'picture5-vYCtycjAvx7memSk.png',
  'picture6-G2wZNa1ts5yfkGjD.png',
  'picture7-y1kLBK7oTSrexJrz.png',
  'picture8-Q4MNOOP37X3qGkGo.png',
  'picture9-8gImACSJv5hGKiHF.png',
  'picture10-K31qLmujnisIxg1G.png',
  'picture11-UxLOCkIvtLLRb3qx.png',
  'picture12-gXJbRxbQ9eMwcZgN.png',
  'picture13-ZA4f8wteaFGtPpjS.png',
  'picture14-FKQOSrilbfJVkyXT.png',
  'screen-shot-2026-08-07-at-19.59.06-MozrcHTpv7LaviZv.png',
  'screen-shot-2026-08-07-at-19.59.20-As6UbuuuiQuVfzKw.png',
  'screen-shot-2026-08-07-at-19.59.39-kmuvIEx02P84SxoD.png',
  '656225214_18448054462112966_1216893586778999024_n-ABqQGrCnJOmi4rqo.jpeg',
];
