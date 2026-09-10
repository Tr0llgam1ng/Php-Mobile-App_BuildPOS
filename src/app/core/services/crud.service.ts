import { inject } from '@angular/core';

import { ApiService } from './api.service';

/**
 * Operaciones CRUD de un endpoint de la API.
 * T = registro que devuelve la API; G = datos que se envían al guardar.
 */
export abstract class CrudService<T, G> {
  protected readonly api = inject(ApiService);

  /** Archivo PHP del endpoint, p. ej. "clientes.php" */
  protected abstract readonly archivo: string;

  listar(): Promise<T[]> {
    return this.api.get<T[]>(this.archivo);
  }

  obtener(id: number): Promise<T> {
    return this.api.get<T>(this.archivo, { id });
  }

  crear(datos: G): Promise<T> {
    return this.api.post<T>(this.archivo, datos);
  }

  /** PUT: reemplaza el registro completo (se envían todos los campos) */
  reemplazar(id: number, datos: G): Promise<T> {
    return this.api.put<T>(this.archivo, datos, { id });
  }

  /** PATCH: modifica solo los campos enviados */
  modificar(id: number, cambios: Partial<G>): Promise<T> {
    return this.api.patch<T>(this.archivo, cambios, { id });
  }

  eliminar(id: number): Promise<null> {
    return this.api.delete(this.archivo, { id });
  }
}
