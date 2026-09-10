import { Documento } from './documento.model';

export interface Venta extends Documento {
  id_venta: number;
  /** Cotización de la que proviene, si se generó al convertir una */
  id_cotizacion: number | null;
}
