import { Injectable, inject, signal } from '@angular/core';

import { CLAVE_CATALOGO_CLIENTES, CLAVE_CATALOGO_MATERIALES } from '../constantes';
import { Accion, Recurso, UsuarioSesion } from '../models/usuario.model';
import { AlmacenamientoService } from './almacenamiento.service';

const CLAVE_TOKEN = 'movil_token';
const CLAVE_USUARIO = 'movil_usuario';

/**
 * Guarda el token y el usuario de la sesión, y responde qué puede hacer según su puesto.
 * La sesión se persiste con Capacitor Preferences para que siga iniciada al cerrar y reabrir la app.
 * Se lee una sola vez al arrancar (ver provideAppInitializer en AppModule) y luego se trabaja en memoria.
 */
@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly almacen = inject(AlmacenamientoService);
  private readonly usuarioActual = signal<UsuarioSesion | null>(null);
  private tokenActual: string | null = null;

  readonly usuario = this.usuarioActual.asReadonly();

  get token(): string | null {
    return this.tokenActual;
  }

  /** Recupera la sesión guardada en el dispositivo */
  async cargar(): Promise<void> {
    await migrarDeLocalStorage(this.almacen);
    const [token, usuario] = await Promise.all([
      this.almacen.leer<string | null>(CLAVE_TOKEN, null),
      this.almacen.leer<UsuarioSesion | null>(CLAVE_USUARIO, null),
    ]);
    if (token && usuario) {
      this.tokenActual = token;
      this.usuarioActual.set(usuario);
    }
  }

  iniciar(token: string, usuario: UsuarioSesion): void {
    this.tokenActual = token;
    void this.almacen.guardar(CLAVE_TOKEN, token);
    this.actualizarUsuario(usuario);
  }

  actualizarUsuario(usuario: UsuarioSesion): void {
    this.usuarioActual.set(usuario);
    void this.almacen.guardar(CLAVE_USUARIO, usuario);
  }

  cerrar(): void {
    this.tokenActual = null;
    this.usuarioActual.set(null);
    void this.almacen.eliminar(CLAVE_TOKEN);
    void this.almacen.eliminar(CLAVE_USUARIO);
    // La copia local de clientes y materiales es del usuario que salió; los borradores sí se conservan
    void this.almacen.eliminar(CLAVE_CATALOGO_CLIENTES);
    void this.almacen.eliminar(CLAVE_CATALOGO_MATERIALES);
  }

  puede(recurso: Recurso, accion: Accion = 'leer'): boolean {
    return this.usuarioActual()?.permisos[recurso]?.includes(accion) ?? false;
  }
}

/** Versiones anteriores guardaban la sesión directo en localStorage; se mueve una sola vez a Preferences */
async function migrarDeLocalStorage(almacen: AlmacenamientoService): Promise<void> {
  const token = localStorage.getItem(CLAVE_TOKEN);
  const usuario = localStorage.getItem(CLAVE_USUARIO);
  if (token === null) {
    return;
  }
  await almacen.guardar(CLAVE_TOKEN, token);
  if (usuario !== null) {
    try {
      await almacen.guardar(CLAVE_USUARIO, JSON.parse(usuario));
    } catch {
      // Usuario dañado: se descarta y se pedirá iniciar sesión otra vez
    }
  }
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_USUARIO);
}
