import { Provider } from "@angular/core";
import { MenuService } from "./menu.service";
import { MENU_TOKEN } from "./menu.enum";
import { IMenuItem } from "./menu.interface";

export function provideMenuService(menuData: Array<IMenuItem>): Provider {
  return [
    { provide: MENU_TOKEN, useValue: menuData },
    MenuService,
  ];
}
