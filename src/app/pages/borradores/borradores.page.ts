import { Component, inject, signal } from '@angular/core';
import { NavController } from '@ionic/angular';

import { Borrador } from '../../core/models/borrador.model';
import { PaginaLista } from '../../core/pagina-lista';
import { BorradoresService } from '../../core/services/borradores.service';
import { CotizacionesService } from '../../core/services/cotizaciones.service';

/** Consulta de borradores guardados en el dispositivo; desde aquí se eliminan o se envían a la API */
@Component({
  selector: 'app-borradores',
  templateUrl: './borradores.page.html',
  standalone: false,
})
export class BorradoresPage extends PaginaLista<Borrador> {
  private readonly borradoresService = inject(BorradoresService);
  private readonly cotizacionesService = inject(CotizacionesService);
  private readonly nav = inject(NavController);

  /** Id del borrador que se está enviando, para deshabilitar sus botones */
  protected readonly enviando = signal<string | null>(null);

  protected listar(): Promise<Borrador[]> {
    return this.borradoresService.listar();
  }

  protected textoBusqueda(borrador: Borrador): string {
    return `${borrador.referencia} ${borrador.cliente} ${borrador.notas}`;
  }

  protected async eliminar(borrador: Borrador): Promise<void> {
    const nombre = borrador.referencia || borrador.cliente;
    if (!(await this.ui.confirmar('Eliminar borrador', `¿Eliminar el borrador "${nombre}" de este dispositivo?`))) {
      return;
    }
    try {
      await this.borradoresService.eliminar(borrador.id);
      this.registros.update((lista) => lista.filter((b) => b.id !== borrador.id));
      void this.ui.aviso('Borrador eliminado.');
    } catch (error) {
      void this.ui.error(error);
    }
  }

  /** Registra el borrador como cotización real (POST cotizaciones.php) y lo quita del dispositivo */
  protected async enviar(borrador: Borrador): Promise<void> {
    const confirmado = await this.ui.confirmar(
      'Enviar como cotización',
      'Se registrará la cotización en el sistema con los precios actuales y el borrador se quitará del dispositivo.',
      'Enviar',
    );
    if (!confirmado) {
      return;
    }
    this.enviando.set(borrador.id);
    try {
      const cotizacion = await this.cotizacionesService.crear(borrador.datos);
      await this.borradoresService.eliminar(borrador.id);
      void this.ui.aviso(`Borrador enviado como la cotización #${cotizacion.id_cotizacion}.`);
      await this.nav.navigateForward(['/cotizaciones', cotizacion.id_cotizacion]);
    } catch (error) {
      // Sin conexión o sin existencia: el borrador se queda guardado para intentarlo después
      void this.ui.error(error);
    } finally {
      this.enviando.set(null);
    }
  }
}
