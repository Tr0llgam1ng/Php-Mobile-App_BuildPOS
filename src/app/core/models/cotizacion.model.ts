import { Documento } from './documento.model';

export type EstadoCotizacion = 'pendiente' | 'convertida';

export interface Cotizacion extends Documento {
  id_cotizacion: number;
  estado: EstadoCotizacion;
  /** Venta generada al convertirla */
  id_venta: number | null;
  /** Solo viene al consultar por id: true si hay existencia de todos los materiales */
  hay_stock?: boolean;
}
