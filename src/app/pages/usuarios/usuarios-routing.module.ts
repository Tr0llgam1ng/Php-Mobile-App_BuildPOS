import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { UsuarioFormPage } from './usuario-form/usuario-form.page';
import { UsuariosPage } from './usuarios.page';

const routes: Routes = [
  { path: '', component: UsuariosPage },
  {
    path: 'nuevo',
    component: UsuarioFormPage,
    canActivate: [authGuard],
    data: { recurso: 'usuarios', accion: 'crear' },
  },
  {
    path: ':id',
    component: UsuarioFormPage,
    canActivate: [authGuard],
    data: { recurso: 'usuarios', accion: 'editar' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosPageRoutingModule {}
