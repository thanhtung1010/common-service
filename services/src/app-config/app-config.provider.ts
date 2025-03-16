import { Provider } from '@angular/core';
import { IAppConfig } from './app-config.interface';
import { AppConfigService } from './app-config.service';
import { APP_CONFIG_TOKEN } from './app-config.enum';

export function provideAppConfig(appConfig: IAppConfig): Provider {
    return [
        { provide: APP_CONFIG_TOKEN, useValue: appConfig },
        AppConfigService,
    ];
}
