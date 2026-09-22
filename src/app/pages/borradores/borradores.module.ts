import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { BorradorFormPage } from './borrador-form/borrador-form.page';
import { BorradoresPageRoutingModule } from './borradores-routing.module';
import { BorradoresPage } from './borradores.page';

@NgModule({
  declarations: [BorradoresPage, BorradorFormPage],
  imports: [SharedModule, BorradoresPageRoutingModule],
})
export class BorradoresPageModule {}
