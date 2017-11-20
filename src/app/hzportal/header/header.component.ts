import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Catalog } from '../../mode/catalog/catalog.service'
import
  * as $
  from
    'jquery';
declare var $: any;
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
            name: '大楼基础信息',
            routeUrl: 'security/basic'
          },
          {
            name: '大楼日常管理',
            routeUrl: 'security/daily'
          },
          {
            name: '大楼物业档案管理',
            routeUrl: 'security/property'
          }
        ]
      },
      {
        name: '餐饮管理平台',
        childs: [{
          name: '餐饮1',
          routeUrl: 'security/basic'
        },
          {
            name: '餐饮2',
            routeUrl: 'security/daily'
          },
          {
            name: '餐饮3',
            routeUrl: 'security/property'
          }]
      }];
  }

  private Listslider(event) {
    $('.menu-one').not($(event.target)).removeClass('active');
    $(event.target).toggleClass('active');
    $('.menu-second').removeClass('active');
    $('.menu-second').stop().slideUp();
    $(event.target).siblings('ol').stop().slideToggle(); // addClass('abc');
    event.stopPropagation();
  }

  loginOut() {
    sessionStorage.setItem('isLoginIn', '');
    this.router.navigate(['login']);
  }
}
