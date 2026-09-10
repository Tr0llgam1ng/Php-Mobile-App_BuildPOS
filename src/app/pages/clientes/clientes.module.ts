import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ClienteFormPage } from './cliente-form/cliente-form.page';
import { ClientesPageRoutingModule } from './clientes-routing.module';
import { ClientesPage } from './clientes.page';

@NgModule({
  declarations: [ClientesPage, ClienteFormPage],
  imports: [SharedModule, ClientesPageRoutingModule],
})
export class ClientesPageModule {}
