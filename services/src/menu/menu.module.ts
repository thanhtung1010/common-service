import { ModuleWithProviders, NgModule } from '@angular/core';
import { MENU_TOKEN } from './menu.enum';
import { MenuService } from './menu.service';
import { IMenuItem } from './menu.interface';

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
