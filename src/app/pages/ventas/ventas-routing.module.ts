import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { VentaDetallePage } from './venta-detalle/venta-detalle.page';
import { VentaFormPage } from './venta-form/venta-form.page';
import { VentasPage } from './ventas.page';

const routes: Routes = [
  { path: '', component: VentasPage },
  {
    path: 'nueva',
    component: VentaFormPage,
    canActivate: [authGuard],
    data: { recurso: 'ventas', accion: 'crear' },
  },
  { path: ':id', component: VentaDetallePage },
  {
    path: ':id/editar',
    component: VentaFormPage,
    canActivate: [authGuard],
    data: { recurso: 'ventas', accion: 'editar' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentasPageRoutingModule {}
