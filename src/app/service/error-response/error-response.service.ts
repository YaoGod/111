import { Injectable } from '@angular/core';
import { GlobalUserService } from '../global-user/global-user.service';
import { Router } from '@angular/router';
declare var confirmFunc: any;
@Injectable()
export class ErrorResponseService {

  constructor(
    private router: Router,
    private globalUser:GlobalUserService
  ) { }
  errorMsg(data) {
    if(this.globalUser.getVal().username !== localStorage.getItem("username")){
      let newUser = this.globalUser.getVal();
      newUser.username = localStorage.getItem("username")
      this.globalUser.setVal(newUser);
    }
    if (data.status === 10) {
      confirmFunc.init({
        'title': '提示' ,
        'mes': data.msg,
        'popType': 2 ,
        'imgType': 2 ,
        'callback':()=> {
          this.router.navigate(['login']);
        },
        'cancel': ()=> {
          this.router.navigate(['login']);
        }
      });
      return false;
    }else if (data.status === 1) {
      confirmFunc.init({
        'title': '提示' ,
        'mes': data.msg,
        'popType': 2 ,
        'imgType': 2 ,
      });
      return false;
    }else if (data === 103) {

      alert('权限不足');
      return false;
    }else if (data === 104) {

      return false;
    }else{
      return true;
    }
  }
}
