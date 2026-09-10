export interface Rol {
  id_rol: number;
  nombre: string;
  total_usuarios: number;
  /** Administrador, Almacenista y Empleado: no se pueden renombrar ni eliminar */
  es_base: boolean;
}

export type RolGuardar = Pick<Rol, 'nombre'>;
