import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { APP_CONFIG_TOKEN } from "./app-config.enum";
import { IAppConfig } from "./app-config.interface";
import { AppConfigModel } from "./app-config.model";

@Injectable({
  providedIn: 'root'
})

export class AppConfigService {
  private _config: BehaviorSubject<AppConfigModel> = new BehaviorSubject(AppConfigModel.createEmpty());

  get config(): BehaviorSubject<AppConfigModel> {
    return this._config;
  }

  constructor(@Inject(APP_CONFIG_TOKEN) private appConfig: IAppConfig) {}

  init() {
    this._config.next(AppConfigModel.fromJson(this.appConfig));
  }
}

