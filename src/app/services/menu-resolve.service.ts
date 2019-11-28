import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { MenuService } from './menu.service';


@Injectable({
  providedIn: 'root'
})
export class MenuResolveService implements Resolve<string[]> {

  constructor(private menuService: MenuService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string[]> | string[] {
    return this.menuService.getMenu().then(m => {
      return m
    })
  }

}
