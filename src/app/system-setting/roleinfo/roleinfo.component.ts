import { Component, OnInit } from '@angular/core';
import {Role} from "../../mode/user/user.service";
import {sndCatalog} from "../../mode/catalog/catalog.service";
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-roleinfo',
  templateUrl: './roleinfo.component.html',
  styleUrls: ['./roleinfo.component.css']
})
export class RoleinfoComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public search: Role;
  public roles: Array<Role>;
  public deptList: Array<any>;
  public copyRole: Role;
  public winTitle: string;
  public rule: sndCatalog = new sndCatalog();
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,

  ) {
    this.rule = this.globalCatalogService.getRole("system/role");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/角色管理");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("system/role");
      }
    );
    this.roles = [];
    this.search = new Role();
    this.search.roleName = "";
    this.copyRole = new Role();
    this.getRoleList(1);
  }
  /*获取权限信息列表*/
  getRoleList(pageNo){
    this.pageNo = pageNo;
    this.userPortalService.getRoleList(this.pageNo,this.pageSize,this.search)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.roles = data.data.infos;
          this.total = data.data.total;
        }
      })
  }

}
