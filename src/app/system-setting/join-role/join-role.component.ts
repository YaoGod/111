import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {GlobalUserService} from "../../service/global-user/global-user.service";
import {Role, User} from "../../mode/user/user.service";
import {ActivatedRoute, Params} from "@angular/router";
declare var confirmFunc:any;
@Component({
  selector: 'app-join-role',
  templateUrl: './join-role.component.html',
  styleUrls: ['./join-role.component.css']
})
export class JoinRoleComponent implements OnInit {

  public user:User;
  public roles: Array<Role>;
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
          this.getRoleList();
        }
      })
  }
  getRoleList(){
    this.userPortalService.getUserRole(this.user.userid)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.roles = data.data;
          for(let i = 0;i<this.roles.length;i++){
            if(this.roles[i].flag === 'Y'){
              this.roles[i].choose = true;
            }else {
              this.roles[i].choose = false;
            }
          }
        }
      })
  }
  submit(){
    let roleIDLIst = [];
    for(let i = 0;i<this.roles.length;i++){
      if(this.roles[i].choose){
        roleIDLIst.push(this.roles[i].roleId);
      }
    }
    this.userPortalService.updateUserRoles(this.user.userid,roleIDLIst)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          confirmFunc.init({
            'title': '提示' ,
            'mes': data.msg,
            'popType': 2 ,
            'imgType': 1 ,
          });
        }
      })
  }
}

