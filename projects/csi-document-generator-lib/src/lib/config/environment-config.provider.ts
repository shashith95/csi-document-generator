import { Provider } from '@angular/core';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from './environment-config';

export function provideEnvironmentConfig(config: EnvironmentConfig): Provider {
  return {
    provide: ENVIRONMENT_CONFIG,
    useValue: config,
  };
}
