import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import {
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  NgModule,
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SesionService } from './core/services/sesion.service';
import { SharedModule } from './shared/shared.module';

// Fechas y moneda en formato de México ($1,234.50)
registerLocaleData(localeEsMx);

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, SharedModule],
  providers: [
    provideZonelessChangeDetection(),
    // Antes de mostrar la primera pantalla se recupera la sesión guardada en el dispositivo
    provideAppInitializer(() => inject(SesionService).cargar()),
    provideIonicAngular({ backButtonText: 'Atrás' }),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es-MX' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'MXN' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
