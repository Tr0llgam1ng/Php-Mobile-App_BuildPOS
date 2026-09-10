import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { CotizacionDetallePage } from './cotizacion-detalle/cotizacion-detalle.page';
import { CotizacionFormPage } from './cotizacion-form/cotizacion-form.page';
import { CotizacionesPage } from './cotizaciones.page';

const routes: Routes = [
  { path: '', component: CotizacionesPage },
  {
    path: 'nueva',
    component: CotizacionFormPage,
    canActivate: [authGuard],
    data: { recurso: 'cotizaciones', accion: 'crear' },
  },
  { path: ':id', component: CotizacionDetallePage },
  {
    path: ':id/editar',
    component: CotizacionFormPage,
    canActivate: [authGuard],
    data: { recurso: 'cotizaciones', accion: 'editar' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CotizacionesPageRoutingModule {}
