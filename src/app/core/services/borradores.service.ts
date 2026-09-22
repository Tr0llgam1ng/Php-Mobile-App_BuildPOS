import { Injectable, inject } from '@angular/core';

import { Borrador, BorradorGuardar } from '../models/borrador.model';
import { AlmacenamientoService } from './almacenamiento.service';
import { SesionService } from './sesion.service';

const CLAVE = 'borradores_cotizacion';

/** Alta, consulta, modificación y eliminación de borradores de cotización en el dispositivo */
@Injectable({ providedIn: 'root' })
export class BorradoresService {
  private readonly almacen = inject(AlmacenamientoService);
  private readonly sesion = inject(SesionService);

  /** Borradores del usuario de la sesión, del más reciente al más antiguo */
  async listar(): Promise<Borrador[]> {
    const idUsuario = this.sesion.usuario()?.id_usuario;
    const todos = await this.leerTodos();
    return todos
      .filter((borrador) => borrador.id_usuario === idUsuario)
      .sort((a, b) => b.actualizado.localeCompare(a.actualizado));
  }

  async obtener(id: string): Promise<Borrador> {
    const borrador = (await this.listar()).find((b) => b.id === id);
    if (!borrador) {
      throw new Error('El borrador ya no existe en este dispositivo.');
    }
    return borrador;
  }

  async crear(entrada: BorradorGuardar): Promise<Borrador> {
    const usuario = this.sesion.usuario();
    if (!usuario) {
      throw new Error('Inicia sesión para guardar borradores.');
    }
    const ahora = new Date().toISOString();
    const borrador: Borrador = {
      ...entrada,
      id: nuevoId(),
      id_usuario: usuario.id_usuario,
      creado: ahora,
      actualizado: ahora,
    };
    const todos = await this.leerTodos();
    await this.almacen.guardar(CLAVE, [...todos, borrador]);
    return borrador;
  }

  async actualizar(id: string, entrada: BorradorGuardar): Promise<Borrador> {
    const actual = await this.obtener(id);
    const borrador: Borrador = { ...actual, ...entrada, actualizado: new Date().toISOString() };
    const todos = await this.leerTodos();
    await this.almacen.guardar(
      CLAVE,
      todos.map((b) => (b.id === id ? borrador : b)),
    );
    return borrador;
  }

  async eliminar(id: string): Promise<void> {
    const todos = await this.leerTodos();
    await this.almacen.guardar(
      CLAVE,
      todos.filter((b) => b.id !== id),
    );
  }

  private leerTodos(): Promise<Borrador[]> {
    return this.almacen.leer<Borrador[]>(CLAVE, []);
  }
}

/** Id corto y único dentro del dispositivo (crypto.randomUUID no está disponible en http://IP-de-la-PC) */
function nuevoId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
