import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { User } from "../../mode/user/user.service";
import { UserPortalService } from '../../service/user-portal/user-portal.service';
import * as $ from 'jquery';
declare var $: any;
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ UserPortalService ]
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private userPortal: UserPortalService
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
    var data = {
      username: 'admin',
      password: 'admin'
    };
      this.userPortal.portalLogin(data)
        .subscribe(data =>{
          console.log(data);
        });
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
