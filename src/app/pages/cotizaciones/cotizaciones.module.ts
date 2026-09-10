import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { CotizacionDetallePage } from './cotizacion-detalle/cotizacion-detalle.page';
import { CotizacionFormPage } from './cotizacion-form/cotizacion-form.page';
import { CotizacionesPageRoutingModule } from './cotizaciones-routing.module';
import { CotizacionesPage } from './cotizaciones.page';

@NgModule({
  declarations: [CotizacionesPage, CotizacionFormPage, CotizacionDetallePage],
  imports: [SharedModule, CotizacionesPageRoutingModule],
})
export class CotizacionesPageModule {}
