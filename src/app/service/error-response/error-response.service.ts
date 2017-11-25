import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable()
export class ErrorResponseService {

  constructor(
    private router: Router
  ) { }
  errorMsg(data) {
    if (data === 10) {
      console.log('用户信息过期');
      this.router.navigate(['login']);
      return false;
    }else if (data === 1) {
      console.log('系统错误请稍后再试');
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
