import { Inject, Injectable } from '@angular/core';
import { filter, map, Observable, Subject } from 'rxjs';
import { MENU_TOKEN } from './menu.enum';
import { MenuItemDto } from './menu.dto';
import { IMenuItem } from './menu.interface';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class MenuService {
    //#region variable
    private _menu$: Subject<Array<MenuItemDto>> = new Subject();
    private _toggleVisibleMenu$: Subject<boolean> = new Subject();
    private _breadcrumb$: Subject<Array<string>> = new Subject();
    //#endregion

    //#region get set
    get menu(): Observable<Array<MenuItemDto>> {
        return this._menu$.asObservable();
    }

    get toggleVisibleMenu(): Observable<boolean> {
        return this._toggleVisibleMenu$.asObservable();
    }

    set toggleVisibleMenu(value: boolean) {
        this._toggleVisibleMenu$.next(value);
    }

    get breadcrumb(): Observable<Array<string>> {
        return this._breadcrumb$.asObservable();
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
