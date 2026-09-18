/**
 * Interacciones de interfaz — Deficciona Teatro
 * Todo lo que responde a una acción del usuario (no al scroll).
 */

const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Bloquea el scroll de la página mientras una capa está abierta.
 *
 * Con Lenis activo no basta `overflow: hidden`: el scroll lo produce
 * Lenis por su cuenta y la página seguiría moviéndose detrás del menú
 * o del visor. Hay que pausar las dos cosas.
 */
function bloquearScroll(activo) {
  document.documentElement.style.overflow = activo ? 'hidden' : '';
  const lenis = window.__lenis;
  if (!lenis) return; // movimiento reducido: no hay Lenis que pausar
  if (activo) lenis.stop();
  else lenis.start();
}

/* ── Barra de navegación ──────────────────────────────── */
const nav = document.querySelector('[data-nav]');
if (nav) {
  let anterior = 0;
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      nav.classList.toggle('nav-vidrio', y > 24);
      if (!nav.classList.contains('nav-abierto')) {
        nav.classList.toggle('nav-oculto', y > anterior && y > 520);
      }
      anterior = y;
    },
    { passive: true },
  );

  const boton = nav.querySelector('[data-menu-btn]');
  const lista = nav.querySelector('[data-menu]');
  const abrirMenu = estado => {
    nav.classList.toggle('nav-abierto', estado);
    boton.setAttribute('aria-expanded', String(estado));
    boton.setAttribute('aria-label', estado ? 'Cerrar menú' : 'Abrir menú');
    bloquearScroll(estado);
  };
  boton?.addEventListener('click', () =>
    abrirMenu(!nav.classList.contains('nav-abierto')),
  );
  lista?.addEventListener('click', e => {
    if (e.target.closest('a')) abrirMenu(false);
  });
  /* Si la ventana crece hasta escritorio con el menú abierto, el menú
     desaparece por CSS pero el scroll quedaría bloqueado */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && nav.classList.contains('nav-abierto'))
      abrirMenu(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('nav-abierto'))
      abrirMenu(false);
  });
}

/* ── Acordeón de preguntas frecuentes ─────────────────── */
document.querySelectorAll('[data-faq] details').forEach(bloque => {
  const cuerpo = bloque.querySelector('[data-faq-respuesta]');
  const titulo = bloque.querySelector('summary');
  if (!cuerpo || !titulo) return;

  titulo.addEventListener('click', e => {
    if (quieto) return;
    e.preventDefault();
    const limpiar = () => {
      cuerpo.style.transition = '';
      cuerpo.style.height = '';
    };
    const curva = 'height .46s cubic-bezier(.22,1,.36,1)';

    if (bloque.open) {
      cuerpo.style.height = cuerpo.scrollHeight + 'px';
      requestAnimationFrame(() => {
        cuerpo.style.transition = curva;
        cuerpo.style.height = '0px';
      });
      cuerpo.addEventListener(
        'transitionend',
        () => {
          bloque.open = false;
          limpiar();
        },
        { once: true },
      );
    } else {
      bloque.open = true;
      const alto = cuerpo.scrollHeight;
      cuerpo.style.height = '0px';
      requestAnimationFrame(() => {
        cuerpo.style.transition = curva;
        cuerpo.style.height = alto + 'px';
      });
      cuerpo.addEventListener('transitionend', limpiar, { once: true });
    }
  });
});

/* ── Visor de imágenes ────────────────────────────────── */
const visor = document.querySelector('[data-visor]');
if (visor) {
  const lienzo = visor.querySelector('img');
  const cerrarBtn = visor.querySelector('[data-visor-cerrar]');
  let focoPrevio = null;

  const abrir = (src, alt) => {
    focoPrevio = document.activeElement;
    lienzo.src = src;
    lienzo.alt = alt || '';
    visor.classList.add('visor-abierto');
    bloquearScroll(true);
    cerrarBtn.focus();
  };
  const cerrar = () => {
    visor.classList.remove('visor-abierto');
    bloquearScroll(false);
    setTimeout(() => lienzo.removeAttribute('src'), 460);
    focoPrevio?.focus();
  };

  const desde = elemento => {
    const img = elemento.querySelector('img');
    abrir(img.dataset.grande || img.src, img.alt);
  };

  document.addEventListener('click', e => {
    const pieza = e.target.closest('[data-ampliable]');
    if (pieza) desde(pieza);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && visor.classList.contains('visor-abierto'))
      cerrar();
    if (e.key === 'Enter' || e.key === ' ') {
      const pieza = e.target.closest?.('[data-ampliable]');
      if (pieza) {
        e.preventDefault();
        desde(pieza);
      }
    }
  });
  cerrarBtn.addEventListener('click', cerrar);
  visor.addEventListener('click', e => {
    if (e.target === visor) cerrar();
  });
}

/* ── Video bajo demanda (no carga YouTube hasta el clic) ─ */
document.querySelectorAll('[data-video]').forEach(caja => {
  const disparador = caja.querySelector('[data-video-play]');
  const id = caja.dataset.video;
  disparador?.addEventListener('click', () => {
    const marco = document.createElement('iframe');
    marco.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    marco.title = 'Video de Deficciona Teatro';
    marco.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    marco.allowFullscreen = true;
    marco.className = 'absolute inset-0 h-full w-full border-0';
    disparador.replaceWith(marco);
  });
});
