import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Colección "obras": el repertorio de la compañía.
 *
 * Cada obra es un archivo Markdown en src/content/obras/. El frontmatter
 * alimenta la tarjeta de la portada; el cuerpo del archivo se renderiza
 * como nota de la obra en su propia página, /obras/<nombre-del-archivo>.
 *
 * Para dar de alta un montaje nuevo basta con crear otro archivo.
 */
const obras = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/obras' }),
  schema: z.object({
    titulo: z.string(),
    orden: z.number(),
    /** Frase corta para el encabezado de la página de la obra */
    entrada: z.string(),
    sinopsis: z.string(),
    duracion: z.string(),
    clasificacion: z.string(),
    espacio: z.string(),
    /** Requisitos que un programador necesita para decidir */
    requisitos: z
      .array(z.object({ campo: z.string(), valor: z.string() }))
      .default([]),
    cartel: z.string(),
    cartelAlt: z.string(),
    /** Imagen ancha para el encabezado de la página de la obra */
    portada: z.string().optional(),
    portadaAlt: z.string().optional(),
    galeria: z
      .array(z.object({ archivo: z.string(), alt: z.string() }))
      .default([]),
    reservaUrl: z.string(),
    /** El lado en que se coloca el cartel en la portada */
    invertida: z.boolean().default(false),
  }),
});

export const collections = { obras };
