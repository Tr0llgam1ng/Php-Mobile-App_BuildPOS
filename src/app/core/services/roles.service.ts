import { Injectable } from '@angular/core';

import { Rol, RolGuardar } from '../models/rol.model';
import { CrudService } from './crud.service';

@Injectable({ providedIn: 'root' })
export class RolesService extends CrudService<Rol, RolGuardar> {
  protected readonly archivo = 'roles.php';
}
