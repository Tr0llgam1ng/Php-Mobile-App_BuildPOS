import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';

@NgModule({
  declarations: [LoginPage],
  imports: [SharedModule, LoginPageRoutingModule],
})
export class LoginPageModule {}
