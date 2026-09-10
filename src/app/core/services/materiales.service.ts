import { Injectable } from '@angular/core';

import { Material, MaterialGuardar } from '../models/material.model';
import { CrudService } from './crud.service';

@Injectable({ providedIn: 'root' })
export class MaterialesService extends CrudService<Material, MaterialGuardar> {
  protected readonly archivo = 'materiales.php';
}
