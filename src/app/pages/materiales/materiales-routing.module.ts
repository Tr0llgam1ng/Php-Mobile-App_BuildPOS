import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { MaterialFormPage } from './material-form/material-form.page';
import { MaterialesPage } from './materiales.page';

const routes: Routes = [
  { path: '', component: MaterialesPage },
  {
    path: 'nuevo',
    component: MaterialFormPage,
    canActivate: [authGuard],
    data: { recurso: 'materiales', accion: 'crear' },
  },
  {
    path: ':id',
    component: MaterialFormPage,
    canActivate: [authGuard],
    data: { recurso: 'materiales', accion: 'editar' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialesPageRoutingModule {}
