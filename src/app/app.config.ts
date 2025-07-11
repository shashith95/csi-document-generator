import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { provideToastr } from 'ngx-toastr';
import {
  provideEnvironmentConfig
} from '../../projects/csi-document-generator-lib/src/lib/config/environment-config.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideEnvironmentConfig({
      apiBaseUrl: environment.apiBaseUrl,
      featureToggleX: true
    }),
    provideToastr()
  ]
};
