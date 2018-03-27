import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalCatalogService } from '../../service/global-catalog/global-catalog.service';
declare var $:any;
@Component({
  selector: 'app-title',
  templateUrl: './nav-title.component.html',
  styleUrls: ['./nav-title.component.css']
})
export class NavTitleComponent implements OnInit {

  public title:string;
  constructor(
    private router : Router,
    private globalCatalogService: GlobalCatalogService
  ) {
    this.title = this.globalCatalogService.getTitle();
  }

  ngOnInit() {
    this.title = this.globalCatalogService.getTitle();
    this.globalCatalogService.titleUpdate.subscribe(
      (val) =>{
        this.title = this.globalCatalogService.getTitle();
      });
  }
  loginOut() {
    sessionStorage.setItem('isLoginIn', '');
    localStorage.removeItem("showUserName");
    this.router.navigate(['login']);
  }

}
