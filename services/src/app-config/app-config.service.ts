import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { APP_CONFIG_TOKEN } from './app-config.enum';
import { IAppConfig } from './app-config.interface';
import { AppConfigDto } from './app-config.dto';

@Injectable({
    providedIn: 'root',
})
export class AppConfigService {
    private _config: BehaviorSubject<AppConfigDto> = new BehaviorSubject(
        AppConfigDto.createEmpty()
    );

    get config(): BehaviorSubject<AppConfigDto> {
        return this._config;
    }

    constructor(@Inject(APP_CONFIG_TOKEN) private appConfig: IAppConfig) {}

    init() {
        this._config.next(AppConfigDto.fromJson(this.appConfig));
    }
}
