import { DocumentoGuardar } from './documento.model';

/**
 * Borrador de cotización guardado solo en el dispositivo.
 * Sirve para armar una cotización en la obra (incluso sin conexión)
 * y enviarla a la API cuando el vendedor lo decida.
 */
export interface Borrador {
  /** Identificador local (no existe en MySQL) */
  id: string;
  /** Referencia libre: nombre de la obra, calle, etc. */
  referencia: string;
  notas: string;
  /** Lo mismo que se envía a cotizaciones.php al registrar */
  datos: DocumentoGuardar;
  /** Copia del nombre del cliente y del total para mostrarlos sin consultar la API */
  cliente: string;
  total: number;
  /** Usuario que lo creó: cada quien ve solo sus borradores */
  id_usuario: number;
  creado: string;
  actualizado: string;
}

/** Campos que captura el formulario */
export interface BorradorGuardar {
  referencia: string;
  notas: string;
  datos: DocumentoGuardar;
  cliente: string;
  total: number;
}
