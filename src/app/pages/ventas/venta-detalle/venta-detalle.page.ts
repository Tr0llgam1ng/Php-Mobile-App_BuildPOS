import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ViewWillEnter } from '@ionic/angular';

import { Venta } from '../../../core/models/venta.model';
import { SesionService } from '../../../core/services/sesion.service';
import { UiService } from '../../../core/services/ui.service';
import { VentasService } from '../../../core/services/ventas.service';
import { idDeRuta } from '../../../core/utils';

@Component({
  selector: 'app-venta-detalle',
  templateUrl: './venta-detalle.page.html',
  standalone: false,
})
export class VentaDetallePage implements ViewWillEnter {
  private readonly route = inject(ActivatedRoute);
  private readonly nav = inject(NavController);
  private readonly ventasService = inject(VentasService);
  private readonly ui = inject(UiService);
  protected readonly sesion = inject(SesionService);

  protected readonly id = idDeRuta(this.route) as number;
  protected readonly venta = signal<Venta | null>(null);

  ionViewWillEnter(): void {
    void this.cargar();
  }

  protected async eliminar(): Promise<void> {
    const confirmado = await this.ui.confirmar(
      'Eliminar venta',
      `Se eliminará la venta #${this.id} y sus materiales regresarán al inventario.`,
    );
    if (!confirmado) {
      return;
    }
    try {
      await this.ventasService.eliminar(this.id);
      void this.ui.aviso('Venta eliminada. El stock regresó al inventario.');
      await this.nav.navigateBack('/ventas');
    } catch (error) {
      void this.ui.error(error);
    }
  }

  private async cargar(): Promise<void> {
    try {
      this.venta.set(await this.ventasService.obtener(this.id));
    } catch (error) {
      void this.ui.error(error);
      void this.nav.navigateBack('/ventas');
    }
  }
}
