import { Component, inject } from '@angular/core';

import { Cotizacion } from '../../core/models/cotizacion.model';
import { PaginaLista } from '../../core/pagina-lista';
import { CotizacionesService } from '../../core/services/cotizaciones.service';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.page.html',
  standalone: false,
})
export class CotizacionesPage extends PaginaLista<Cotizacion> {
  private readonly cotizacionesService = inject(CotizacionesService);

  protected listar(): Promise<Cotizacion[]> {
    return this.cotizacionesService.listar();
  }

  protected textoBusqueda(cotizacion: Cotizacion): string {
    return `${cotizacion.id_cotizacion} ${cotizacion.cliente} ${cotizacion.vendedor} ${cotizacion.estado}`;
  }
}
