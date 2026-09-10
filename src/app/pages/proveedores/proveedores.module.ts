import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ProveedorFormPage } from './proveedor-form/proveedor-form.page';
import { ProveedoresPageRoutingModule } from './proveedores-routing.module';
import { ProveedoresPage } from './proveedores.page';

@NgModule({
  declarations: [ProveedoresPage, ProveedorFormPage],
  imports: [SharedModule, ProveedoresPageRoutingModule],
})
export class ProveedoresPageModule {}
