import { ModuleWithProviders, NgModule } from '@angular/core';
import { IMenuItem } from 'common-firebase';
import { MENU_TOKEN } from './menu.enum';
import { MenuService } from './menu.service';

@NgModule({
    imports: [],
})
export class MenuModule {
    static forRoot(
        menuData: Array<IMenuItem>
    ): ModuleWithProviders<MenuModule> {
        return {
            ngModule: MenuModule,
            providers: [
                {
                    provide: MENU_TOKEN,
                    useValue: menuData,
                },
                MenuService,
            ],
        };
    }
}
