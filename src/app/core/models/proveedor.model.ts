export interface Proveedor {
  id_proveedor: number;
  nombre: string;
  direccion: string;
}

export type ProveedorGuardar = Omit<Proveedor, 'id_proveedor'>;
