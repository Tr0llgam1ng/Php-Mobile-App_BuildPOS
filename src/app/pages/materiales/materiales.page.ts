import { Component, computed, inject, signal } from '@angular/core';

import { STOCK_MINIMO } from '../../core/constantes';
import { Material } from '../../core/models/material.model';
import { PaginaLista } from '../../core/pagina-lista';
import { MaterialesService } from '../../core/services/materiales.service';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.page.html',
  standalone: false,
})
export class MaterialesPage extends PaginaLista<Material> {
  private readonly materialesService = inject(MaterialesService);

  protected readonly stockMinimo = STOCK_MINIMO;
  protected readonly soloStockBajo = signal(false);
  protected readonly visibles = computed(() =>
    this.soloStockBajo() ? this.filtrados().filter((material) => material.stock <= STOCK_MINIMO) : this.filtrados(),
  );

  protected listar(): Promise<Material[]> {
    return this.materialesService.listar();
  }

  protected textoBusqueda(material: Material): string {
    return `${material.nombre} ${material.proveedor}`;
  }

  protected async ajustarStock(material: Material): Promise<void> {
    const valor = await this.ui.pedirValor({
      titulo: `Stock de ${material.nombre}`,
      etiqueta: 'Nuevo stock',
      valor: material.stock,
      tipo: 'number',
    });
    if (valor === null) {
      return;
    }

    const stock = Number(valor);
    if (valor === '' || !Number.isInteger(stock) || stock < 0) {
      void this.ui.aviso('El stock debe ser un número entero mayor o igual a 0.', 'warning');
      return;
    }

    try {
      // PATCH: solo se envía el campo "stock"
      const actualizado = await this.materialesService.modificar(material.id_material, { stock });
      this.registros.update((lista) => lista.map((m) => (m.id_material === material.id_material ? actualizado : m)));
      void this.ui.aviso(`Stock de ${material.nombre} actualizado a ${stock}.`);
    } catch (error) {
      void this.ui.error(error);
    }
  }

  protected async eliminar(material: Material): Promise<void> {
    if (!(await this.ui.confirmar('Eliminar material', `¿Eliminar "${material.nombre}"?`))) {
      return;
    }
    try {
      await this.materialesService.eliminar(material.id_material);
      this.registros.update((lista) => lista.filter((m) => m.id_material !== material.id_material));
      void this.ui.aviso('Material eliminado.');
    } catch (error) {
      void this.ui.error(error);
    }
  }
}
