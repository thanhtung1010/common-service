import { InjectionToken } from '@angular/core';
import { IMenuItem } from './menu.interface';

export const MENU_TOKEN = new InjectionToken<Array<IMenuItem>>('menuData');
