import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { registrarIconos } from './core/iconos';
import { MENU } from './core/menu';
import { AuthService } from './core/services/auth.service';
import { SesionService } from './core/services/sesion.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  protected readonly sesion = inject(SesionService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Opciones del menú lateral permitidas para el puesto del usuario */
  protected readonly opciones = computed(() =>
    this.sesion.usuario() ? MENU.filter((opcion) => !opcion.recurso || this.sesion.puede(opcion.recurso)) : [],
  );

  constructor() {
    registrarIconos();
    // Actualiza puesto y permisos por si un administrador los cambió desde el último inicio de sesión
    this.auth.refrescarPerfil().catch(() => undefined);
  }

  protected async cerrarSesion(): Promise<void> {
    await this.auth.cerrarSesion();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
