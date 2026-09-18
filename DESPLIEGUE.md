# Despliegue y HTTPS

El sitio es estático. No necesita Node, PHP ni base de datos en el
servidor: se suben archivos y funciona.

## 1. Compilar

```bash
pnpm install
pnpm build
```

Queda todo en `dist/`, incluido el `.htaccess` (Astro copia el
contenido de `public/` tal cual).

Antes de compilar, revisa que `site` en `astro.config.mjs` sea el
dominio definitivo. De ahí salen la URL canónica, el `sitemap` y el
`robots.txt`.

## 2. Subir

Sube **el contenido** de `dist/`, no la carpeta, a `public_html` del
subdominio. Por FTP o por el administrador de archivos de hPanel.

Comprueba que `.htaccess` llegó: muchos clientes FTP ocultan los
archivos que empiezan por punto. En el administrador de hPanel hay
que activar "mostrar archivos ocultos".

Debe quedar así:

```
public_html/
├── .htaccess
├── index.html
├── 404.html
├── robots.txt
├── sitemap-index.xml
├── sitemap-0.xml
├── _astro/
└── obras/
    ├── mila-morez/index.html
    └── transitare/index.html
```

## 3. Activar el certificado

Hostinger incluye SSL gratuito de Let's Encrypt en cada dominio y
subdominio del plan, con renovación automática cada 90 días.

1. Entra a hPanel y abre **Websites**.
2. Pulsa **Dashboard** junto a `teatro.deficciona.com`.
3. En la barra lateral, **Security → SSL**.
4. Pulsa **Install SSL**.

El estado pasa por _Installing_ y queda en _Active_ en pocos minutos.
Si los botones no aparecen, ya hay un certificado instalado.

Requisitos previos: el subdominio debe estar añadido al plan y el DNS
debe estar propagado. Si el dominio no está registrado en Hostinger,
los nameservers del registrador tienen que apuntar allí. La
propagación puede tardar hasta 24 horas.

## 4. Forzar HTTPS

En la misma pantalla de **Security → SSL** hay un interruptor **Force
HTTPS**. Actívalo.

**No actives además el bloque de redirección del `.htaccess`.** Está
comentado a propósito. Usar los dos a la vez puede provocar un bucle
de redirecciones. El bloque está ahí solo por si tu plan no ofrece el
interruptor.

## 5. Comprobar

Abre el sitio en una ventana de incógnito, porque el navegador cachea
agresivamente las redirecciones.

- El candado aparece en la barra de direcciones.
- `http://teatro.deficciona.com` redirige a `https://`.
- La consola del navegador no muestra avisos de contenido mixto.
- `https://teatro.deficciona.com/obras/transitare` carga.
- Una ruta inventada muestra la página 404 del sitio, no la de Apache.

Para una revisión externa: SSL Labs (`ssllabs.com/ssltest`) da el
detalle del certificado y la configuración del servidor.

## 6. HSTS, después

El `.htaccess` trae HSTS comentado. Actívalo solo cuando el
certificado lleve unos días sin fallos, y empieza con `max-age=300`.

La razón: HSTS le ordena al navegador no volver a intentar HTTP nunca
más durante todo el `max-age`. Es una instrucción que se guarda en el
cliente, así que si algo se rompe no se puede revertir desde el
servidor; hay que esperar a que expire. Con cinco minutos el riesgo es
nulo. Cuando lleves una semana tranquilo, súbelo a `31536000`.

## Notas

**El sitemap se declara solo.** `robots.txt` apunta a
`https://teatro.deficciona.com/sitemap-index.xml`. Conviene enviarlo a
Google Search Console tras publicar.

**Las imágenes siguen en el CDN de Zyrosite**, el del sitio anterior.
Se sirven por HTTPS, así que no rompen el candado, pero el sitio
depende de ese CDN. Antes de dar de baja el sitio viejo hay que
migrarlas a `src/images/`.

**El caché es agresivo con `/_astro/`**: un año e `immutable`. Es
seguro porque esos archivos llevan un hash en el nombre y cambian de
nombre al cambiar de contenido. El HTML se revalida siempre, así que
una actualización se ve de inmediato.
