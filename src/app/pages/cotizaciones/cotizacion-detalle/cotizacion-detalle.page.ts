import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ViewWillEnter } from '@ionic/angular';

import { Cotizacion } from '../../../core/models/cotizacion.model';
import { CotizacionesService } from '../../../core/services/cotizaciones.service';
import { SesionService } from '../../../core/services/sesion.service';
import { UiService } from '../../../core/services/ui.service';
import { idDeRuta } from '../../../core/utils';

@Component({
  selector: 'app-cotizacion-detalle',
  templateUrl: './cotizacion-detalle.page.html',
  standalone: false,
})
export class CotizacionDetallePage implements ViewWillEnter {
  private readonly route = inject(ActivatedRoute);
  private readonly nav = inject(NavController);
  private readonly cotizacionesService = inject(CotizacionesService);
  private readonly ui = inject(UiService);
  protected readonly sesion = inject(SesionService);

  protected readonly id = idDeRuta(this.route) as number;
  protected readonly cotizacion = signal<Cotizacion | null>(null);
  protected readonly procesando = signal(false);
  protected readonly pendiente = computed(() => this.cotizacion()?.estado === 'pendiente');
  protected readonly puedeConvertir = computed(
    () => this.sesion.puede('cotizaciones', 'editar') && this.sesion.puede('ventas', 'crear'),
  );

  ionViewWillEnter(): void {
    void this.cargar();
  }

  protected async convertir(): Promise<void> {
    const confirmado = await this.ui.confirmar(
      'Convertir en venta',
      'Se registrará una venta con los precios cotizados y se descontará el stock de los materiales.',
      'Convertir',
    );
    if (!confirmado) {
      return;
    }

    this.procesando.set(true);
    try {
      const cotizacion = await this.cotizacionesService.convertir(this.id);
      this.cotizacion.set(cotizacion);
      void this.ui.aviso(`Cotización convertida en la venta #${cotizacion.id_venta}. Se descontó el stock.`);
    } catch (error) {
      void this.ui.error(error);
      // Refresca las existencias por si cambiaron
      await this.cargar();
    } finally {
      this.procesando.set(false);
    }
  }

  protected async eliminar(): Promise<void> {
    if (!(await this.ui.confirmar('Eliminar cotización', `¿Eliminar la cotización #${this.id}?`))) {
      return;
    }
    try {
      await this.cotizacionesService.eliminar(this.id);
      void this.ui.aviso('Cotización eliminada.');
      await this.nav.navigateBack('/cotizaciones');
    } catch (error) {
      void this.ui.error(error);
    }
  }

  private async cargar(): Promise<void> {
    try {
      this.cotizacion.set(await this.cotizacionesService.obtener(this.id));
    } catch (error) {
      void this.ui.error(error);
      void this.nav.navigateBack('/cotizaciones');
    }
  }
}
