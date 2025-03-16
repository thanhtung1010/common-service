import { Provider } from "@angular/core";
import { IMenuItem } from "common-firebase";
import { MenuService } from "./menu.service";
import { MENU_TOKEN } from "./menu.enum";

export function provideMenuService(menuData: Array<IMenuItem>): Provider {
  return [
    { provide: MENU_TOKEN, useValue: menuData },
    MenuService,
  ];
}
