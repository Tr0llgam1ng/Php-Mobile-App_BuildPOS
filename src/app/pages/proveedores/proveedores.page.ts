import { Component, inject } from '@angular/core';

import { Proveedor } from '../../core/models/proveedor.model';
import { PaginaLista } from '../../core/pagina-lista';
import { ProveedoresService } from '../../core/services/proveedores.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.page.html',
  standalone: false,
})
export class ProveedoresPage extends PaginaLista<Proveedor> {
  private readonly proveedoresService = inject(ProveedoresService);

  protected listar(): Promise<Proveedor[]> {
    return this.proveedoresService.listar();
  }

  protected textoBusqueda(proveedor: Proveedor): string {
    return `${proveedor.nombre} ${proveedor.direccion}`;
  }

  protected async eliminar(proveedor: Proveedor): Promise<void> {
    if (!(await this.ui.confirmar('Eliminar proveedor', `¿Eliminar a "${proveedor.nombre}"?`))) {
      return;
    }
    try {
      await this.proveedoresService.eliminar(proveedor.id_proveedor);
      this.registros.update((lista) => lista.filter((p) => p.id_proveedor !== proveedor.id_proveedor));
      void this.ui.aviso('Proveedor eliminado.');
    } catch (error) {
      void this.ui.error(error);
    }
  }
}
