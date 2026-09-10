import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { MaterialFormPage } from './material-form/material-form.page';
import { MaterialesPageRoutingModule } from './materiales-routing.module';
import { MaterialesPage } from './materiales.page';

@NgModule({
  declarations: [MaterialesPage, MaterialFormPage],
  imports: [SharedModule, MaterialesPageRoutingModule],
})
export class MaterialesPageModule {}
