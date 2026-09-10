import { Injectable } from '@angular/core';

import { Usuario, UsuarioGuardar } from '../models/usuario.model';
import { CrudService } from './crud.service';

@Injectable({ providedIn: 'root' })
export class UsuariosService extends CrudService<Usuario, UsuarioGuardar> {
  protected readonly archivo = 'usuarios.php';
}
