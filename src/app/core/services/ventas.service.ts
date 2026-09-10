import { Injectable } from '@angular/core';

import { DocumentoGuardar } from '../models/documento.model';
import { Venta } from '../models/venta.model';
import { CrudService } from './crud.service';

/** Registrar una venta descuenta stock; eliminarla lo devuelve */
@Injectable({ providedIn: 'root' })
export class VentasService extends CrudService<Venta, DocumentoGuardar> {
  protected readonly archivo = 'ventas.php';
}
