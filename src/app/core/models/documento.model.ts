/** Línea de detalle de una venta o cotización */
export interface LineaDocumento {
  id_detalle: number;
  id_material: number;
  /** Nombre del material */
  material: string;
  /** Stock del material al momento de consultar */
  stock_actual: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

/** Campos comunes de ventas y cotizaciones */
export interface Documento {
  id_cliente: number;
  /** Nombre completo del cliente */
  cliente: string;
  id_usuario: number;
  /** Nombre del usuario que lo registró */
  vendedor: string;
  /** Fecha y hora generadas por el sistema */
  fecha: string;
  subtotal: number;
  /** Porcentaje aplicado (16 = IVA 16 %) */
  impuesto: number;
  total: number;
  /** Solo viene al consultar un registro por id */
  detalles?: LineaDocumento[];
}

/** Datos que se envían al registrar o reemplazar una venta o cotización */
export interface DocumentoGuardar {
  id_cliente: number;
  impuesto: number;
  detalles: { id_material: number; cantidad: number }[];
}

export function aDocumentoGuardar(documento: Documento): DocumentoGuardar {
  return {
    id_cliente: documento.id_cliente,
    impuesto: documento.impuesto,
    detalles: (documento.detalles ?? []).map(({ id_material, cantidad }) => ({ id_material, cantidad })),
  };
}
