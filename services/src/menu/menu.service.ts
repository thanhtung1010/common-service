import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { MENU_TOKEN } from './menu.enum';
import { MenuItemDto } from './menu.dto';
import { IMenuItem } from './menu.interface';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class MenuService {
    //#region variable
    private _menu$: BehaviorSubject<Array<MenuItemDto>> = new BehaviorSubject<Array<MenuItemDto>>([]);
    private _toggleVisibleMenu$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private _breadcrumb$: BehaviorSubject<Array<string>> = new BehaviorSubject<Array<string>>([]);
    //#endregion

    //#region get set
    get menu(): BehaviorSubject<Array<MenuItemDto>> {
        return this._menu$;
    }

    get toggleVisibleMenu(): BehaviorSubject<boolean> {
        return this._toggleVisibleMenu$;
    }

    set toggleVisibleMenu(value: boolean) {
        this._toggleVisibleMenu$.next(value);
    }

    get breadcrumb(): BehaviorSubject<Array<string>> {
        return this._breadcrumb$;
    }

    set breadcrumb(breadcrumb: Array<string>) {
        this._breadcrumb$.next(breadcrumb);
    }

    constructor(
        private router: Router,
        @Inject(MENU_TOKEN) private menuData: Array<IMenuItem>,
    ) {}

    init() {
        const _menu = this.menuData.map((menu) => {
            return MenuItemDto.fromJson({
                ...menu,
                active: location.pathname === menu.href,
            });
        });
        this._menu$.next(_menu);
    }

    getBreadcrumb(): Observable<Array<string>> {
        return this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => this.router.url.split('/').filter(path => path)),
        );
    }
}
