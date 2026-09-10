import { Injectable, inject } from '@angular/core';

import { LoginRespuesta, UsuarioSesion } from '../models/usuario.model';
import { ApiService } from './api.service';
import { SesionService } from './sesion.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly sesion = inject(SesionService);

  /** @param usuario correo o número de contacto */
  async iniciarSesion(usuario: string, password: string): Promise<UsuarioSesion> {
    const respuesta = await this.api.post<LoginRespuesta>('login.php', { usuario, password });
    this.sesion.iniciar(respuesta.token, respuesta.usuario);
    return respuesta.usuario;
  }

  /** Vuelve a consultar nombre, puesto y permisos del usuario de la sesión */
  async refrescarPerfil(): Promise<void> {
    if (!this.sesion.token) {
      return;
    }
    this.sesion.actualizarUsuario(await this.api.get<UsuarioSesion>('perfil.php'));
  }

  async cerrarSesion(): Promise<void> {
    // Aunque el servidor no responda, la sesión local se cierra
    await this.api.post('logout.php').catch(() => undefined);
    this.sesion.cerrar();
  }
}
