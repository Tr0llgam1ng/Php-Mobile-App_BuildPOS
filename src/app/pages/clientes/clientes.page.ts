import { Component, inject } from '@angular/core';

import { Cliente } from '../../core/models/cliente.model';
import { PaginaLista } from '../../core/pagina-lista';
import { ClientesService } from '../../core/services/clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  standalone: false,
})
export class ClientesPage extends PaginaLista<Cliente> {
  private readonly clientesService = inject(ClientesService);

  protected listar(): Promise<Cliente[]> {
    return this.clientesService.listar();
  }

  protected textoBusqueda(cliente: Cliente): string {
    return `${cliente.nombre} ${cliente.apellido} ${cliente.telefono} ${cliente.domicilio}`;
  }

  protected async eliminar(cliente: Cliente): Promise<void> {
    if (!(await this.ui.confirmar('Eliminar cliente', `¿Eliminar a ${cliente.nombre} ${cliente.apellido}?`))) {
      return;
    }
    try {
      await this.clientesService.eliminar(cliente.id_cliente);
      this.registros.update((lista) => lista.filter((c) => c.id_cliente !== cliente.id_cliente));
      void this.ui.aviso('Cliente eliminado.');
    } catch (error) {
      void this.ui.error(error);
    }
  }
}
