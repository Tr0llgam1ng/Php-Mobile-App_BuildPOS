import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { UsuarioFormPage } from './usuario-form/usuario-form.page';
import { UsuariosPageRoutingModule } from './usuarios-routing.module';
import { UsuariosPage } from './usuarios.page';

@NgModule({
  declarations: [UsuariosPage, UsuarioFormPage],
  imports: [SharedModule, UsuariosPageRoutingModule],
})
export class UsuariosPageModule {}
