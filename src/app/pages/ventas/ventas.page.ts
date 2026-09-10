import { Component, inject } from '@angular/core';

import { Venta } from '../../core/models/venta.model';
import { PaginaLista } from '../../core/pagina-lista';
import { VentasService } from '../../core/services/ventas.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  standalone: false,
})
export class VentasPage extends PaginaLista<Venta> {
  private readonly ventasService = inject(VentasService);

  protected listar(): Promise<Venta[]> {
    return this.ventasService.listar();
  }

  protected textoBusqueda(venta: Venta): string {
    return `${venta.id_venta} ${venta.cliente} ${venta.vendedor}`;
  }
}
