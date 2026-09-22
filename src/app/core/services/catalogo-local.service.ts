import { Injectable, inject } from '@angular/core';

import { CLAVE_CATALOGO_CLIENTES, CLAVE_CATALOGO_MATERIALES } from '../constantes';
import { Cliente } from '../models/cliente.model';
import { Material } from '../models/material.model';
import { AlmacenamientoService } from './almacenamiento.service';
import { ClientesService } from './clientes.service';
import { MaterialesService } from './materiales.service';

interface CopiaCatalogo<T> {
  guardado: string;
  datos: T[];
}

export interface Catalogo<T> {
  datos: T[];
  /** Fecha de la copia local cuando no se pudo consultar la API; null si los datos vienen del servidor */
  copiaDel: string | null;
}

/**
 * Clientes y materiales con copia local: cada consulta exitosa a la API se guarda en el dispositivo
 * y, si después no hay conexión, se usa esa copia para poder seguir armando borradores.
 */
@Injectable({ providedIn: 'root' })
export class CatalogoLocalService {
  private readonly almacen = inject(AlmacenamientoService);
  private readonly clientesService = inject(ClientesService);
  private readonly materialesService = inject(MaterialesService);

  clientes(): Promise<Catalogo<Cliente>> {
    return this.consultar(CLAVE_CATALOGO_CLIENTES, () => this.clientesService.listar());
  }

  materiales(): Promise<Catalogo<Material>> {
    return this.consultar(CLAVE_CATALOGO_MATERIALES, () => this.materialesService.listar());
  }

  private async consultar<T>(clave: string, desdeApi: () => Promise<T[]>): Promise<Catalogo<T>> {
    try {
      const datos = await desdeApi();
      await this.almacen.guardar(clave, { guardado: new Date().toISOString(), datos } satisfies CopiaCatalogo<T>);
      return { datos, copiaDel: null };
    } catch (error) {
      const copia = await this.almacen.leer<CopiaCatalogo<T> | null>(clave, null);
      if (!copia) {
        throw error;
      }
      return { datos: copia.datos, copiaDel: copia.guardado };
    }
  }
}
