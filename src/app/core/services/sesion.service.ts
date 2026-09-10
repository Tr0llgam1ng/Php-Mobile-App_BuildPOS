import { Injectable, signal } from '@angular/core';

import { Accion, Recurso, UsuarioSesion } from '../models/usuario.model';

const CLAVE_TOKEN = 'movil_token';
const CLAVE_USUARIO = 'movil_usuario';

/** Guarda el token y el usuario de la sesión, y responde qué puede hacer según su puesto */
@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly usuarioActual = signal<UsuarioSesion | null>(leerUsuarioGuardado());

  readonly usuario = this.usuarioActual.asReadonly();

  get token(): string | null {
    return localStorage.getItem(CLAVE_TOKEN);
  }

  iniciar(token: string, usuario: UsuarioSesion): void {
    localStorage.setItem(CLAVE_TOKEN, token);
    this.actualizarUsuario(usuario);
  }

  actualizarUsuario(usuario: UsuarioSesion): void {
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    this.usuarioActual.set(usuario);
  }

  cerrar(): void {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    this.usuarioActual.set(null);
  }

  puede(recurso: Recurso, accion: Accion = 'leer'): boolean {
    return this.usuarioActual()?.permisos[recurso]?.includes(accion) ?? false;
  }
}

function leerUsuarioGuardado(): UsuarioSesion | null {
  if (!localStorage.getItem(CLAVE_TOKEN)) {
    return null;
  }
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIO) ?? 'null') as UsuarioSesion | null;
  } catch {
    return null;
  }
}
