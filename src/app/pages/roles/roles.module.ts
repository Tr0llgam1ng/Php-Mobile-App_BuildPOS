import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { RolesPageRoutingModule } from './roles-routing.module';
import { RolesPage } from './roles.page';

@NgModule({
  declarations: [RolesPage],
  imports: [SharedModule, RolesPageRoutingModule],
})
export class RolesPageModule {}
