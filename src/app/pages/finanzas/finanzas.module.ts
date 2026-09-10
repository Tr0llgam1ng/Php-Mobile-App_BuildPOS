import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { FinanzasPageRoutingModule } from './finanzas-routing.module';
import { FinanzasPage } from './finanzas.page';

@NgModule({
  declarations: [FinanzasPage],
  imports: [SharedModule, FinanzasPageRoutingModule],
})
export class FinanzasPageModule {}
