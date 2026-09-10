import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { VentaDetallePage } from './venta-detalle/venta-detalle.page';
import { VentaFormPage } from './venta-form/venta-form.page';
import { VentasPageRoutingModule } from './ventas-routing.module';
import { VentasPage } from './ventas.page';

@NgModule({
  declarations: [VentasPage, VentaFormPage, VentaDetallePage],
  imports: [SharedModule, VentasPageRoutingModule],
})
export class VentasPageModule {}
