import { Injectable } from '@angular/core';

import { Proveedor, ProveedorGuardar } from '../models/proveedor.model';
import { CrudService } from './crud.service';

@Injectable({ providedIn: 'root' })
export class ProveedoresService extends CrudService<Proveedor, ProveedorGuardar> {
  protected readonly archivo = 'proveedores.php';
}
