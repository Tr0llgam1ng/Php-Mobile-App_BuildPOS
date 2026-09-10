import { computed, inject, signal } from '@angular/core';
import type { RefresherEventDetail, ViewWillEnter } from '@ionic/angular';

import { SesionService } from './services/sesion.service';
import { UiService } from './services/ui.service';
import { filtrar } from './utils';

/**
 * Base de las páginas de listado: recarga al entrar a la vista,
 * "jalar para actualizar" y búsqueda local.
 */
export abstract class PaginaLista<T> implements ViewWillEnter {
  protected readonly ui = inject(UiService);
  protected readonly sesion = inject(SesionService);

  protected readonly registros = signal<T[]>([]);
  protected readonly cargando = signal(true);
  protected readonly busqueda = signal('');
  protected readonly filtrados = computed(() =>
    filtrar(this.registros(), this.busqueda(), (registro) => this.textoBusqueda(registro)),
  );

  protected abstract listar(): Promise<T[]>;

  /** Texto donde se busca lo escrito en la barra de búsqueda */
  protected abstract textoBusqueda(registro: T): string;

  ionViewWillEnter(): void {
    void this.cargar();
  }

  protected async cargar(evento?: CustomEvent<RefresherEventDetail>): Promise<void> {
    try {
      this.registros.set(await this.listar());
    } catch (error) {
      void this.ui.error(error);
    } finally {
      this.cargando.set(false);
      evento?.detail.complete();
    }
  }
}
