export type Recurso =
  | 'usuarios'
  | 'roles'
  | 'clientes'
  | 'proveedores'
  | 'materiales'
  | 'ventas'
  | 'cotizaciones'
  | 'finanzas';

export type Accion = 'leer' | 'crear' | 'editar' | 'eliminar';

/** Permisos del puesto de trabajo, calculados por la API: { materiales: ['leer', 'crear'], ... } */
export type Permisos = Partial<Record<Recurso, Accion[]>>;

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  edad: number;
  id_rol: number;
  /** Nombre del puesto de trabajo */
  rol: string;
  telefono: string;
  correo: string;
}

/** Usuario de la sesión, con sus permisos */
export interface UsuarioSesion extends Usuario {
  permisos: Permisos;
}

/** Datos para registrar o editar un usuario (la contraseña solo es obligatoria al registrar) */
export interface UsuarioGuardar {
  nombre: string;
  apellido: string;
  edad: number;
  id_rol: number;
  telefono: string;
  correo: string;
  password?: string;
}

export interface LoginRespuesta {
  token: string;
  usuario: UsuarioSesion;
}
