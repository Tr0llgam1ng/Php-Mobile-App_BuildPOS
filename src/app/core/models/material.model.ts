export interface Material {
  id_material: number;
  nombre: string;
  stock: number;
  id_proveedor: number;
  /** Nombre del proveedor */
  proveedor: string;
  /** Solo lo reciben los puestos que pueden registrar materiales */
  precio_compra?: number;
  precio_venta: number;
}

export interface MaterialGuardar {
  nombre: string;
  id_proveedor: number;
  stock: number;
  precio_compra: number;
  precio_venta: number;
}
