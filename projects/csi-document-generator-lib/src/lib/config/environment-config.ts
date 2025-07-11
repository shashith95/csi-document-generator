import { InjectionToken } from '@angular/core';

export interface EnvironmentConfig {
  apiBaseUrl: string;
  featureToggleX?: boolean;
}

export const ENVIRONMENT_CONFIG = new InjectionToken<EnvironmentConfig>('ENVIRONMENT_CONFIG');
