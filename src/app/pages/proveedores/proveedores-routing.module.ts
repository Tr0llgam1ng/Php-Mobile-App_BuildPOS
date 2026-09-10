import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { ProveedorFormPage } from './proveedor-form/proveedor-form.page';
import { ProveedoresPage } from './proveedores.page';

const routes: Routes = [
  { path: '', component: ProveedoresPage },
  {
    path: 'nuevo',
    component: ProveedorFormPage,
    canActivate: [authGuard],
    data: { recurso: 'proveedores', accion: 'crear' },
  },
  {
    path: ':id',
    component: ProveedorFormPage,
    canActivate: [authGuard],
    data: { recurso: 'proveedores', accion: 'editar' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProveedoresPageRoutingModule {}
