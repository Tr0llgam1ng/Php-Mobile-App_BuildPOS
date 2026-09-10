import { Injectable } from '@angular/core';

import { Cotizacion } from '../models/cotizacion.model';
import { DocumentoGuardar } from '../models/documento.model';
import { CrudService } from './crud.service';

/** Las cotizaciones verifican existencia pero no descuentan stock hasta convertirse en venta */
@Injectable({ providedIn: 'root' })
export class CotizacionesService extends CrudService<Cotizacion, DocumentoGuardar> {
  protected readonly archivo = 'cotizaciones.php';

  /** Genera la venta con los precios cotizados y descuenta el stock */
  convertir(id: number): Promise<Cotizacion> {
    return this.api.post<Cotizacion>(this.archivo, null, { id, accion: 'convertir' });
  }
}
