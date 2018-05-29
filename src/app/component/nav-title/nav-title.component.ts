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
  public abc:boolean;
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
        // if(this.title==='党建管理/工作台账上传'||this.title === '党建管理/工作报表管理'){
        if(this.title.indexOf('党建')!==-1){
          this.abc=true;
        }else{
          this.abc=false;
        }
      });
  }
  loginOut() {
    sessionStorage.setItem('isLoginIn', '');
    localStorage.removeItem("showUserName");
    this.router.navigate(['login']);
  }

}
