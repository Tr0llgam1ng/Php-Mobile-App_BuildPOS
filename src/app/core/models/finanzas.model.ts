export interface ResumenVentas {
  numero_ventas: number;
  subtotal: number;
  impuestos: number;
  total: number;
}

export interface ResumenFinanzas {
  ventas: ResumenVentas & { costo_estimado: number; ganancia_estimada: number };
  mes_actual: ResumenVentas;
  inventario: { materiales: number; unidades: number; valor_costo: number; valor_venta: number };
  cotizaciones_pendientes: { cantidad: number; total: number };
  mas_vendidos: { id_material: number; nombre: string; unidades: number; importe: number }[];
  stock_minimo: number;
  stock_bajo: { id_material: number; nombre: string; stock: number }[];
}
