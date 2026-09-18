/**
 * Motor de movimiento — Deficciona Teatro
 *
 * Lenis produce el scroll con inercia; GSAP ScrollTrigger ata cada
 * animación a la posición del scroll (scrub) en lugar de dispararla.
 * Los dos comparten un solo ticker para que no compitan por frames.
 */

import '@styles/lenis.css';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const raiz = document.documentElement;
const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Si el usuario pidió menos movimiento, mostramos todo estático y salimos. */
if (quieto) {
  raiz.classList.add('sin-motor');
  raiz.classList.remove('lenis', 'lenis-smooth');
} else {
  arrancar();
}

function arrancar() {
  /* ── Scroll con inercia ─────────────────────────────── */
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);

  /* Lenis toma el control del scroll, así que `overflow: hidden` deja de
     detenerlo. Cualquier capa que se abra encima (menú, visor) necesita
     pausarlo de verdad, y para eso tiene que poder alcanzarlo. */
  window.__lenis = lenis;
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  /* Los anclas del menú pasan por Lenis para que el salto sea suave */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const destino = document.querySelector(a.getAttribute('href'));
      if (!destino) return;
      e.preventDefault();
      lenis.scrollTo(destino, { offset: -56, duration: 1.2 });
    });
  });

  const mm = gsap.matchMedia();

  /* ── 1. Hero: se enciende la luz de escena ──────────── */
  /*
   * Entrada (una sola vez, no atada al scroll): la sala está a
   * oscuras y la luz sube en dos tiempos, primero el relleno y
   * después la principal. El nombre aparece cuando la luz llega.
   *
   * Salida (atada al scroll): la luz baja. No hay zoom; alejarse
   * es gesto de página de producto, apagarse es gesto de teatro.
   */
  const heroPin = document.querySelector('[data-hero]');
  if (heroPin) {
    const fondo = heroPin.querySelector('[data-hero-fondo]');
    const lineas = heroPin.querySelectorAll('[data-hero-linea]');
    const textos = heroPin.querySelectorAll('[data-hero-texto]');
    const flecha = heroPin.querySelector('[data-hero-flecha]');

    const entrada = gsap.timeline({ delay: 0.2 });

    entrada
      /* luz de relleno: la escena se insinúa */
      .to(fondo, {
        filter: 'brightness(0.34) saturate(0.6)',
        duration: 0.7,
        ease: 'power1.inOut',
      })
      /* luz principal: la escena queda a plena luz */
      .to(fondo, {
        filter: 'brightness(1) saturate(1)',
        duration: 1.2,
        ease: 'power2.out',
      })
      /* el nombre entra desde detrás de su propia línea */
      .fromTo(
        lineas,
        { yPercent: 108, opacity: 1 },
        { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.1 },
        '-=1.15',
      )
      .to(
        textos,
        { opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.08 },
        '-=0.55',
      )
      .to(flecha, { opacity: 1, duration: 0.6 }, '-=0.3');

    /* Si alguien empieza a bajar antes de que la luz termine de
       subir, no tiene sentido retenerlo: se completa de inmediato. */
    const adelantar = () => {
      if (entrada.progress() < 1) entrada.progress(1);
      window.removeEventListener('wheel', adelantar);
      window.removeEventListener('touchstart', adelantar);
      window.removeEventListener('keydown', adelantar);
    };
    window.addEventListener('wheel', adelantar, { passive: true, once: false });
    window.addEventListener('touchstart', adelantar, { passive: true });
    window.addEventListener('keydown', adelantar);

    /* El recorrido de salida se arma cuando la luz ya subió, para
       que las dos animaciones no se peleen por las mismas props. */
    entrada.eventCallback('onComplete', () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: heroPin,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        })
        .to(
          fondo,
          { filter: 'brightness(0.12) saturate(0.4)', ease: 'none' },
          0,
        )
        .to(
          '[data-hero-cuerpo]',
          { y: -80, opacity: 0, ease: 'power1.in' },
          0.15,
        )
        .to(flecha, { opacity: 0, duration: 0.1 }, 0);

      ScrollTrigger.refresh();
    });
  }

  /* ── 2. Manifiesto: las palabras se encienden ───────── */
  document.querySelectorAll('[data-frase]').forEach(frase => {
    const palabras = frase.querySelectorAll('.js-palabra');
    if (!palabras.length) return;
    gsap.to(palabras, {
      opacity: 1,
      ease: 'none',
      stagger: 0.5,
      scrollTrigger: {
        trigger: frase,
        start: 'top 78%',
        end: 'bottom 55%',
        scrub: 0.4,
      },
    });
  });

  /* ── 3. Repertorio: el cartel entra tras el texto ───── */
  mm.add('(min-width: 1024px)', () => {
    document.querySelectorAll('.obra .cartel img').forEach(img => {
      gsap.fromTo(
        img,
        { clipPath: 'inset(14% 0% 0% 0%)', scale: 1.1 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.obra'),
            start: 'top 85%',
            end: 'center 55%',
            scrub: 0.7,
          },
        },
      );
    });
  });

  /* ── 4. Recorrido horizontal (Transitare) ───────────── */
  mm.add('(min-width: 901px)', () => {
    const pin = document.querySelector('[data-viaje-pin]');
    const riel = document.querySelector('[data-riel]');
    const barra = document.querySelector('[data-barra]');
    if (!pin || !riel) return;

    const recorrido = () =>
      Math.max(riel.scrollWidth - window.innerWidth + 40, 0);

    const st = gsap.to(riel, {
      x: () => -recorrido(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => '+=' + recorrido(),
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          if (barra) gsap.set(barra, { scaleX: self.progress });
        },
      },
    });
    return () => st.scrollTrigger?.kill();
  });

  /* ── 5. Parallax suave de imágenes sueltas ──────────── */
  mm.add('(min-width: 901px)', () => {
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const fuerza = parseFloat(el.dataset.parallax) || 40;
      gsap.fromTo(
        el,
        { y: fuerza / 2 },
        {
          y: -fuerza / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.9,
          },
        },
      );
    });
  });

  /* ── 5b. Rótulos de escena ──────────────────────────── */
  document.querySelectorAll('[data-rotulo] .filete').forEach(filete => {
    gsap.to(filete, {
      scaleX: 1,
      duration: 0.9,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: filete.closest('[data-rotulo]'),
        start: 'top 88%',
        once: true,
      },
    });
  });

  /* ── 6. Bandas y fondos: parallax de imagen ─────────── */
  mm.add('(min-width: 701px)', () => {
    /* La banda se mueve más lento que la página: da profundidad
       sin despegarse del contenido. */
    const banda = document.querySelector('[data-banda]');
    if (banda) {
      gsap.fromTo(
        banda,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: banda.closest('section'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.9,
          },
        },
      );
    }

    const fondoContacto = document.querySelector('[data-parallax-fondo]');
    if (fondoContacto) {
      gsap.fromTo(
        fondoContacto,
        { yPercent: -6, scale: 1.08 },
        {
          yPercent: 6,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: fondoContacto.closest('section'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.9,
          },
        },
      );
    }

    /* La foto del taller se revela desde abajo al entrar */
    const taller = document.querySelector('[data-taller] img');
    if (taller) {
      gsap.fromTo(
        taller,
        { scale: 1.12, yPercent: -4 },
        {
          scale: 1,
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: taller.closest('figure'),
            start: 'top bottom',
            end: 'bottom center',
            scrub: 0.8,
          },
        },
      );
    }
  });

  /* ── 7. Botón flotante: aparece al dejar el hero ────── */
  const heroSeccion = document.querySelector('[data-hero]');
  if (heroSeccion) {
    ScrollTrigger.create({
      trigger: heroSeccion,
      start: 'bottom 80%',
      onEnter: () => raiz.classList.add('accion-visible'),
      onLeaveBack: () => raiz.classList.remove('accion-visible'),
    });
  } else {
    /* En páginas sin hero el botón está disponible desde el inicio */
    raiz.classList.add('accion-visible');
  }

  /* ── 8. Entradas escalonadas ────────────────────────── */
  ScrollTrigger.batch('.js-entra', {
    start: 'top 88%',
    once: true,
    onEnter: lote =>
      gsap.to(lote, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: true,
      }),
  });

  /* ── 9. Progreso y contador de escena ───────────────── */
  const progreso = document.querySelector('[data-progreso] i');
  if (progreso) {
    gsap.to(progreso, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    });
  }

  /* El contador muestra en qué escena está el lector. Se activa por
     ancla, así que basta con que exista el id en la página. */
  const contador = document.querySelector('[data-contador]');
  if (contador) {
    const marcas = contador.querySelectorAll('[data-contador-item]');
    const activar = ancla =>
      marcas.forEach(m =>
        m.toggleAttribute('data-activa', m.dataset.contadorItem === ancla),
      );

    marcas.forEach(marca => {
      const destino = document.getElementById(marca.dataset.contadorItem);
      if (!destino) return;
      ScrollTrigger.create({
        trigger: destino,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => activar(marca.dataset.contadorItem),
        onEnterBack: () => activar(marca.dataset.contadorItem),
      });
    });
    activar('inicio');
  }

  /* Con imágenes remotas el alto cambia al cargar: recalculamos */
  window.addEventListener('load', () => ScrollTrigger.refresh());

  /* Salvavidas: si algo falló y quedó contenido invisible, lo mostramos */
  setTimeout(() => {
    document.querySelectorAll('.js-entra').forEach(el => {
      if (
        getComputedStyle(el).opacity === '0' &&
        el.getBoundingClientRect().top < window.innerHeight
      ) {
        gsap.set(el, { opacity: 1, y: 0 });
      }
    });
  }, 3000);
}
