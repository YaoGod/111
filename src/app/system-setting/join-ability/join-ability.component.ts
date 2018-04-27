import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {GlobalUserService} from "../../service/global-user/global-user.service";
import {Role} from "../../mode/user/user.service";
import 'rxjs/add/operator/switchMap';
import {Catalog} from "../../mode/catalog/catalog.service";
declare var confirmFunc:any;
declare var $: any;
@Component({
  selector: 'app-join-ability',
  templateUrl: './join-ability.component.html',
  styleUrls: ['./join-ability.component.css']
})
export class JoinAbilityComponent implements OnInit {

  public role:Role;
  public abilities: Array<Catalog>;
  public adrList: Array<Catalog>;
  public resultList: Array<Catalog>;
  private clickStatus: boolean;
  constructor(
    private route: ActivatedRoute,
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,
    private globalUserService:GlobalUserService,
    public el: ElementRef
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/角色配权限");
    this.role = new Role();
    this.adrList = [];
    this.resultList = [];
    this.clickStatus = true;
    if(typeof (this.route.params['_value']['id']) !== "undefined"){
      let tempid = 0;
      this.route.params
        .switchMap((params: Params) => this.role.roleId  = params['id'])
        .subscribe(() => {
          if (tempid === 0) {
            this.getRoleMsg(this.role.roleId);
            let temp = new Catalog();
            temp.id = "";
            temp.name = "所有权限";
            this.getAbilityList(temp,1);
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
  /*获取角色的权限*/
  getAbilityList(ability,flag) {
    if(this.clickStatus){
      this.userPortalService.getAbilityCata(this.role.roleId,ability.id)
        .subscribe(data => {
          if (this.errorResponseService.errorMsg(data)) {
            if(data.data.length>0){
              this.abilities = this.checkGetData(data.data);
              if(flag === 1){
                this.adrList.push(ability);
              }
              else if(flag === -1){
                let temp = [];
                for(let i =0 ;i<this.adrList.length;i++){
                  temp.push(this.adrList[i]);
                  if(this.adrList[i].id === ability.id){
                    i = this.adrList.length;
                  }
                }
                this.adrList = temp;
              }
              this.clickStatus = true;
            }
          }
        })
    }

  }
  /*记录改变的数据*/
  setResult(ability){
    let type = "normal";
    for(let i = 0;i<this.resultList.length;i++){
      if(this.resultList[i].id === ability.id){
        type = "repeat";
        this.resultList[i] = ability;
      }
    }
    if(type === "normal"){
      this.resultList.push(ability);
    }
  }
  checkGetData(data){
    for(let i = 0;i<data.length;i++){
      for(let j = 0;j<this.resultList.length;j++){
        if(data[i].id === this.resultList[j].id){
          data[i] = this.resultList[j];
        }
      }
    }
    return data;
  }
  submit(postData){
    for(let i = 0;i<postData.length;i++){
      postData[i].roleId = this.role.roleId;
      postData[i].cataId = postData[i].id;
      postData[i].isSelect = postData[i].isSelect.toString();
      postData[i].isInstall = postData[i].isInstall.toString();
      postData[i].isUpdate = postData[i].isUpdate.toString();
      postData[i].isDelete = postData[i].isDelete.toString();
    }
    this.userPortalService.updateRoleCata(postData)
      .subscribe(data => {
        if (this.errorResponseService.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data.msg,
            'popType': 2,
            'imgType': 1
          });
          this.resultList = [];
          this.getAbilityList(this.adrList[this.adrList.length-1],-1);
        }
      });
  }
}
