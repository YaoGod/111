import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {GlobalUserService} from "../../service/global-user/global-user.service";
import {User} from "../../mode/user/user.service";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-join-role',
  templateUrl: './join-role.component.html',
  styleUrls: ['./join-role.component.css']
})
export class JoinRoleComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public user:User;
  public roles: Array<any>;
  constructor(
    private route: ActivatedRoute,
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,
    private globalUserService:GlobalUserService
  ) { }

  ngOnInit() {
    this.user = new User();
    this.roles = [];
    this.globalCatalogService.setTitle("系统管理/用户配置角色");
    if(typeof (this.route.params['_value']['id']) !== "undefined"){
      let tempid = 0;
      this.route.params
        .switchMap((params: Params) => this.user.userid  = params['id'])
        .subscribe(() => {
          if (tempid === 0) {
            this.getUserMsg(this.user.userid);
            tempid++;
          }
        });
    }
  }
  getUserMsg(id){
    this.userPortalService.getUserInfo(id)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.user = data.data;
          this.getRoleList(1);
        }
      })
  }
  getRoleList(pageNo){
    this.pageNo = pageNo;
    this.userPortalService.getUserRole(this.user.userid,this.pageNo,this.pageSize)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.roles = data.data.infos;
          this.total = data.data.total;
        }
      })
  }
}
