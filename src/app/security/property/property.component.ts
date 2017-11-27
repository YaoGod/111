import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {

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
