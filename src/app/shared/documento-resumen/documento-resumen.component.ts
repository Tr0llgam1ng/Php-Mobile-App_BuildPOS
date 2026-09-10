import { Component, computed, input } from '@angular/core';

import { Documento } from '../../core/models/documento.model';
import { redondear } from '../../core/utils';

/** Detalle de solo lectura de una venta o cotización: cliente, materiales y totales */
@Component({
  selector: 'app-documento-resumen',
  templateUrl: './documento-resumen.component.html',
  standalone: false,
})
export class DocumentoResumenComponent {
  readonly documento = input.required<Documento>();
  /** Indica por cada material si hay existencia suficiente (cotizaciones pendientes) */
  readonly mostrarExistencia = input(false);

  protected readonly montoImpuesto = computed(() => redondear(this.documento().total - this.documento().subtotal));
}
