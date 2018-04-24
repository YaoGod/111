import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {GlobalUserService} from "../../service/global-user/global-user.service";
import {Role} from "../../mode/user/user.service";
@Component({
  selector: 'app-join-ability',
  templateUrl: './join-ability.component.html',
  styleUrls: ['./join-ability.component.css']
})
export class JoinAbilityComponent implements OnInit {

  public role:Role;
  constructor(
    private route: ActivatedRoute,
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,
    private globalUserService:GlobalUserService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/角色配权限");
    this.role = new Role();
    if(typeof (this.route.params['_value']['id']) !== "undefined"){
      let tempid = 0;
      this.route.params
        .switchMap((params: Params) => this.role.roleId  = params['id'])
        .subscribe(() => {
          if (tempid === 0) {
            this.getRoleMsg(this.role.roleId);
            tempid++;
          }
        });
    }
  }
  /*获取角色信息*/
  getRoleMsg(id){
    this.userPortalService.getRoleInfo(id)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.role = data.data;
        }
      })
  }
  submit(){

  }
}
