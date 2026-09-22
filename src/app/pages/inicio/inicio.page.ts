import { Component, computed, inject } from '@angular/core';

import { MENU } from '../../core/menu';
import { SesionService } from '../../core/services/sesion.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})
export class InicioPage {
  protected readonly sesion = inject(SesionService);

  /** Módulos a los que tiene acceso el puesto del usuario */
  protected readonly opciones = computed(() =>
    MENU.filter((opcion) => opcion.recurso && this.sesion.puede(opcion.recurso, opcion.accion)),
  );
}
