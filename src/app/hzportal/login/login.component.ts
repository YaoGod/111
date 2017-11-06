import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { User } from "../../mode/user/user.service";
import
  * as $
  from
    'jquery';
declare var $: any;
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    public router: Router,
  ) {
  }
  private user: User;
  ngOnInit() {
    this.user = {
      id: 1,
      name: '',
      password: ''
    };
  }
  /*登陆*/
  loginIn(){

      sessionStorage.setItem("isLoginIn","Login");
      this.router.navigate(['/hzportal/']);
  }
  /*回车登陆*/
  keyLogin(event: any) {

    if (event.keyCode == 13) {console.log(this.user.name);
      if (typeof this.user.name === 'undefined' ||  this.user.name === '') {
        $('#userName').focus();
      }else if ( typeof this.user.password === 'undefined' || this.user.password === '') {
        $('#password').focus();
      }else {
        this.loginIn();
      }
    }
  }
}
