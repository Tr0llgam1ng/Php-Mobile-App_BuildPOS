import { Injectable, inject } from '@angular/core';

import { ResumenFinanzas } from '../models/finanzas.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class FinanzasService {
  private readonly api = inject(ApiService);

  resumen(): Promise<ResumenFinanzas> {
    return this.api.get<ResumenFinanzas>('finanzas.php');
  }
}
