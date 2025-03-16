import { Pipe, PipeTransform } from '@angular/core';
import { ASSETS_TYPE } from '../base/base.interface';
import { AppConfigService } from '../app-config/app-config.service';

@Pipe({
    name: 'AssetsLink',
    standalone: true,
})
export class AssetsLink implements PipeTransform {
    private paths: { path: string; type: ASSETS_TYPE }[] = [
        {
            path: 'assets/icons/',
            type: 'svg',
        },
        {
            path: 'assets/imgs/',
            type: 'png',
        },
        {
            path: 'assets/',
            type: 'i18n',
        },
    ];

    constructor(private appConfigService: AppConfigService) {}

    transform(name: string, type: string, ...args: any): string {
        try {
            const _existPath = this.paths.find((path) => path.type === type);

            if (!_existPath) return '';

            return (
                this.appConfigService.config?.value.assetsUrl +
                _existPath.path +
                name +
                '.' +
                type
            );
        } catch (error) {
            return '';
        }
    }
}
