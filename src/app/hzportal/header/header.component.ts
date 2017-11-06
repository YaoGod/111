import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Catalog } from '../../mode/catalog/catalog.service'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public catalogs: Array<Catalog>;

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
    this.catalogs = [{
        name: '大楼综合管理平台',
        childs: [
          {
            name:'大楼基础信息',
            routeUrl:'security/basic'
          },
          {
            name:'大楼日常管理',
            routeUrl:'security/daily'
          },
          {
            name:'大楼物业档案管理',
            routeUrl:'security/property'
          }
        ]
      },
      {
        name: '餐饮管理平台',
        childs: []
      }];
  }
  loginOut(){
    sessionStorage.setItem("isLoginIn","");
    this.router.navigate(['login']);
  }
}
