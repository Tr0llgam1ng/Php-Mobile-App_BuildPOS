import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { ClienteFormPage } from './cliente-form/cliente-form.page';
import { ClientesPage } from './clientes.page';

const routes: Routes = [
  { path: '', component: ClientesPage },
  {
    path: 'nuevo',
    component: ClienteFormPage,
    canActivate: [authGuard],
    data: { recurso: 'clientes', accion: 'crear' },
  },
  {
    path: ':id',
    component: ClienteFormPage,
    canActivate: [authGuard],
    data: { recurso: 'clientes', accion: 'editar' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesPageRoutingModule {}
