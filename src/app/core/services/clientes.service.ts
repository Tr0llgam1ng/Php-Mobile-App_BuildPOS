import { Injectable } from '@angular/core';

import { Cliente, ClienteGuardar } from '../models/cliente.model';
import { CrudService } from './crud.service';

@Injectable({ providedIn: 'root' })
export class ClientesService extends CrudService<Cliente, ClienteGuardar> {
  protected readonly archivo = 'clientes.php';
}
