import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-title',
  templateUrl: './nav-title.component.html',
  styleUrls: ['./nav-title.component.css']
})
export class NavTitleComponent implements OnInit {

  constructor(
    private router : Router
  ) { }

  ngOnInit() {
  }
  loginOut() {
    sessionStorage.setItem('isLoginIn', '');
    this.router.navigate(['login']);
  }

}
