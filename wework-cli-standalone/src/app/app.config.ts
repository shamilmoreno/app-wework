import { HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, isDevMode, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { ngxUiLoaderConfig } from './core/configs/ngx-loader.config';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { LucideAngularModule, User, Mail, Settings, LogOut } from 'lucide-angular';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsVe from '@angular/common/locales/es-VE';

const icons = {
  User,
  Mail,
  Settings,
  LogOut,
};

// Configuración de Traducción (ngx-translate)
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { LocalStorageService } from '@core/services/local-storage.service';
import { provideNativeDateAdapter } from '@angular/material/core';
registerLocaleData(localeEsVe, 'es-VE');

// Función necesaria para cargar los archivos JSON de idiomas desde assets
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideAnimations(),
    provideNativeDateAdapter(),
    provideHttpClient(withInterceptorsFromDi()),

    // Configuración del Service Worker para PWA
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
    }),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },

    importProvidersFrom(LucideAngularModule.pick(icons)),

    // Configuración Global de Traducciones
    importProvidersFrom(
      NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ),

    // Servicio de LocalStorage
    LocalStorageService,

    // Configuración Regional de Moneda y Formatos para Venezuela
    { provide: LOCALE_ID, useValue: 'es-VE' },
  ],
};
