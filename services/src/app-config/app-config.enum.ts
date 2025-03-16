import { InjectionToken } from '@angular/core';
import { IAppConfig } from './app-config.interface';

export const APP_CONFIG_TOKEN = new InjectionToken<IAppConfig>('appConfig');
