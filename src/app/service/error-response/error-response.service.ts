import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
declare var confirmFunc: any;
@Injectable()
export class ErrorResponseService {

  constructor(
    private router: Router
  ) { }
  errorMsg(data) {
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
      console.log('权限不足');
      alert('权限不足');
      return false;
    }else if (data === 104) {
      console.log('请求地址有误，找不到对应路径');
      return false;
    }else{
      return true;
    }
  }
}
