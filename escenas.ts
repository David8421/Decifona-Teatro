/**
 * Las escenas de la obra.
 *
 * La página se recorre como una función: cada bloque es una escena
 * numerada, con su rótulo y su ancla. Esta lista alimenta tres cosas
 * a la vez —los rótulos de sección, el contador fijo y el menú— para
 * que no se puedan desincronizar.
 */
export interface Escena {
  numero: string;
  rotulo: string;
  ancla: string;
  /** Si aparece en el menú principal */
  enMenu?: boolean;
}

export const ESCENAS: Escena[] = [
  { numero: '01', rotulo: 'Obertura', ancla: 'inicio' },
  { numero: '02', rotulo: 'Manifiesto', ancla: 'manifiesto' },
  { numero: '03', rotulo: 'Repertorio', ancla: 'obras', enMenu: true },
  { numero: '04', rotulo: 'Historial', ancla: 'historial', enMenu: true },
  { numero: '05', rotulo: 'La compañía', ancla: 'nosotros', enMenu: true },
  { numero: '06', rotulo: 'Formación', ancla: 'talleres', enMenu: true },
  { numero: '07', rotulo: 'Última escena', ancla: 'contacto', enMenu: true },
];

export const escena = (ancla: string) =>
  ESCENAS.find(e => e.ancla === ancla) as Escena;
