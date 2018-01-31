import { Injectable } from '@angular/core';
import { CanActivate,
          Router,
          ActivatedRouteSnapshot,
          RouterStateSnapshot
        } from '@angular/router';
import {UserPortalService} from "../user-portal/user-portal.service";
import {ErrorResponseService} from "../error-response/error-response.service";
import {GlobalUserService} from "../global-user/global-user.service";
import {User} from "../../mode/user/user.service";
@Injectable()
export class RouteGuardService implements CanActivate{
  constructor(
    private router: Router,
    private userPortalService:UserPortalService,
    private globalUserService:GlobalUserService,
    private errorResponseService:ErrorResponseService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }
  checkLogin(url: string): boolean {
    if(url.indexOf("?")>0&&sessionStorage.getItem('isLoginIn') !== 'Login'){
      let encrypt =url.slice(url.indexOf("?")+1).replace("=","").trim();
      this.getEncryptLogin(encrypt,url.slice(0,url.indexOf("?")));
      sessionStorage.setItem('isLoginIn','Login');
      return false;
    }
    if (sessionStorage.getItem('isLoginIn') === 'Login') {
      return true;
    }
    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }
  getEncryptLogin(encrypt,url){
    this.userPortalService.getEncryptLogin(encrypt)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.globalUserService.setVal(data.data.userInfo);
          this.router.navigate([url]);
          return true;
        }else{
          sessionStorage.setItem('isLoginIn','');
          return false;
        }
      })
  }
    }
