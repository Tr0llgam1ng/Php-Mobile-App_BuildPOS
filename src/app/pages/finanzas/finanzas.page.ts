import { Component, inject, signal } from '@angular/core';
import type { RefresherEventDetail, ViewWillEnter } from '@ionic/angular';

import { ResumenFinanzas } from '../../core/models/finanzas.model';
import { FinanzasService } from '../../core/services/finanzas.service';
import { UiService } from '../../core/services/ui.service';

@Component({
  selector: 'app-finanzas',
  templateUrl: './finanzas.page.html',
  standalone: false,
})
export class FinanzasPage implements ViewWillEnter {
  private readonly finanzasService = inject(FinanzasService);
  private readonly ui = inject(UiService);

  protected readonly resumen = signal<ResumenFinanzas | null>(null);
  protected readonly cargando = signal(true);

  ionViewWillEnter(): void {
    void this.cargar();
  }

  protected async cargar(evento?: CustomEvent<RefresherEventDetail>): Promise<void> {
    try {
      this.resumen.set(await this.finanzasService.resumen());
    } catch (error) {
      void this.ui.error(error);
    } finally {
      this.cargando.set(false);
      evento?.detail.complete();
    }
  }
}
