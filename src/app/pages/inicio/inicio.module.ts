import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { InicioPageRoutingModule } from './inicio-routing.module';
import { InicioPage } from './inicio.page';

@NgModule({
  declarations: [InicioPage],
  imports: [SharedModule, InicioPageRoutingModule],
})
export class InicioPageModule {}
