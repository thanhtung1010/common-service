import { ModuleWithProviders, NgModule } from "@angular/core";
import { APP_CONFIG_TOKEN } from "./app-config.enum";
import { IAppConfig } from "./app-config.interface";
import { AppConfigService } from "./app-config.service";

@NgModule({
  imports: [],
})

export class AppConfigModule {

  static forRoot(appConfig: IAppConfig): ModuleWithProviders<AppConfigModule> {
    return {
      ngModule: AppConfigModule,
      providers: [
        {
          provide: APP_CONFIG_TOKEN,
          useValue: appConfig,
        },
        AppConfigService,
      ]
    }
  }
}
