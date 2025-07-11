import { InjectionToken } from '@angular/core';

export interface EnvironmentConfig {
  apiBaseUrl: string;
  APPLICATION?: string;
  whiteSpaceFix?: boolean;
}

export const ENVIRONMENT_CONFIG = new InjectionToken<EnvironmentConfig>('ENVIRONMENT_CONFIG');
