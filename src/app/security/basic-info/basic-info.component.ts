import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css'],
})
export class BasicInfoComponent implements OnInit {
  constructor(
    public router: Router
  ) { }
  ngOnInit() {

  }
  loginOut() {
    sessionStorage.setItem('isLoginIn', '');
    this.router.navigate(['login']);
  }
}
