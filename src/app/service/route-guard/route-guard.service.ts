import { Injectable } from '@angular/core';
import { CanActivate,
          Router,
          ActivatedRouteSnapshot,
          RouterStateSnapshot
        } from '@angular/router';
@Injectable()
export class RouteGuardService implements CanActivate{
  constructor(
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }
  checkLogin(url: string): boolean {
    if (sessionStorage.getItem('isLoginIn') === 'Login') {
      return true;
    }

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }
}
