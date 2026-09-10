import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Accion, Recurso } from '../models/usuario.model';
import { SesionService } from '../services/sesion.service';
import { UiService } from '../services/ui.service';

/**
 * Exige sesión iniciada. Si la ruta define data.recurso (y opcionalmente data.accion),
 * también exige que el puesto del usuario tenga ese permiso.
 */
export const authGuard: CanActivateFn = (route) => {
  const sesion = inject(SesionService);
  const router = inject(Router);
  const ui = inject(UiService);

  if (!sesion.usuario()) {
    return router.parseUrl('/login');
  }

  const recurso = route.data['recurso'] as Recurso | undefined;
  const accion = (route.data['accion'] as Accion | undefined) ?? 'leer';
  if (recurso && !sesion.puede(recurso, accion)) {
    void ui.aviso('Tu puesto de trabajo no tiene acceso a esa sección.', 'warning');
    return router.parseUrl('/inicio');
  }
  return true;
};

/** Evita mostrar el login cuando ya hay una sesión iniciada */
export const invitadoGuard: CanActivateFn = () => {
  const sesion = inject(SesionService);
  const router = inject(Router);
  return sesion.usuario() ? router.parseUrl('/inicio') : true;
};
