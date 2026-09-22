import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BorradorFormPage } from './borrador-form/borrador-form.page';
import { BorradoresPage } from './borradores.page';

// El permiso (cotizaciones → crear) ya lo revisa la ruta padre en AppRoutingModule
const routes: Routes = [
  { path: '', component: BorradoresPage },
  { path: 'nuevo', component: BorradorFormPage },
  { path: ':id', component: BorradorFormPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BorradoresPageRoutingModule {}
