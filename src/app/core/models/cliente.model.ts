export interface Cliente {
  id_cliente: number;
  nombre: string;
  apellido: string;
  domicilio: string;
  telefono: string;
}

export type ClienteGuardar = Omit<Cliente, 'id_cliente'>;
