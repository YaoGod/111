///<reference path="../../mode/catalog/catalog.service.ts"/>
import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {Ability} from "../../mode/user/user.service";
declare var $:any;
declare var confirmFunc:any;
import * as echarts from 'echarts';
import {sndCatalog} from "../../mode/catalog/catalog.service";
@Component({
  selector: 'app-ability',
  templateUrl: './ability.component.html',
  styleUrls: ['./ability.component.css']
})
export class AbilityComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public search: Ability;
  public abilities: Array<Ability>;
  public deptList: Array<any>;
  public copyAbility: Ability;
  public winTitle: string;
  public rule: sndCatalog = new sndCatalog();
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,
  ) {
    this.rule = this.globalCatalogService.getRole("system/ability");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/权限管理");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("system/ability");
      }
    );
    this.abilities = [];
    this.search = new Ability();
    this.search.cataName = "";
    this.copyAbility = new Ability();
    this.getAbilityList(1);
    this.getDeptList();
    this.getAbilityEcharts('AbilityChart');
  }
  /*获取角色信息列表*/
  getAbilityList(pageNo){
    this.pageNo = pageNo;
    this.userPortalService.getAbilityList(this.pageNo,this.pageSize,this.search)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.abilities = data.data.infos;
          this.total = data.data.total;
        }
      })
  }
  /*获取所有部门下拉列表*/
  getDeptList(){
    this.userPortalService.getDeptList()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.deptList = data.data;
        }
      })
  }
  /*删除用户*/
  delete(id){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除该目录权限？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        this.userPortalService.deleteCataInfo(id)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1
              });
              this.getAbilityList(1);
            }
          });
      }
    });
  }
  /*编辑用户*/
  edit(ability:Ability){
    this.newUser();
    this.winTitle = "编辑";
    this.copyAbility = JSON.parse(JSON.stringify(ability));
  }
  /*新建用户*/
  newUser(){
    this.copyAbility = new Ability();
    this.winTitle = "新增";
    $('#newUser').show();
  }
  closeNewUser(){
    this.copyAbility = new Ability();
    $('.red').removeClass('red');
    $('.error').fadeOut();
    $('#newUser').hide();
  }
  /*新增角色表单提交*/
  submit(){
    let error = 0;
    this.verifyEmpty(this.copyAbility.id,'id');
    this.verifyEmpty(this.copyAbility.cataName,'cataName');
    if($('.red').length === 0 && error === 0) {
      if(this.winTitle === "新增"){
        this.userPortalService.addCataInfo(this.copyAbility)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
              });
              this.closeNewUser();
              this.getAbilityList(1);
            }
          })
      }
      else {
        this.userPortalService.updateCataInfo(this.copyAbility)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
              });
              this.closeNewUser();
              this.getAbilityList(this.pageNo);
            }
          })
      }

    }
  }
  /*非空验证*/
  verifyEmpty( value, id?){
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id,'该值不能为空');
      return false;
    }else{
      this.removeErrorClass(id);
      return true;
    }
  }
  /* 添加错误信息*/
  private addErrorClass(id: string, error: string)  {
    $('#' + id).addClass('red');
    $('#' + id).parent().next('.error').fadeIn().html(error);
  }
  /*去除错误信息*/
  private  removeErrorClass(id: string) {
    $('#' + id).removeClass('red');
    $('#' + id).parent().next('.error').fadeOut();
  }
  /*获取权限树杈图*/
  getAbilityEcharts(id){
    this.userPortalService.getCataTree()
      .subscribe(data => {
        if (this.errorResponseService.errorMsg(data)) {
        let option = {
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
          },
          series: [
            {
              type: 'tree',

              data: [data.data],

              top: '1%',
              left: '1%',
              bottom: '1%',
              right: '20%',
              symbolSize: 10,
              initialTreeDepth: 2,
              label: {
                normal: {
                  position: 'left',
                  verticalAlign: 'middle',
                  align: 'right',
                  fontSize: 9
                }
              },

              leaves: {
                label: {
                  normal: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                  }
                }
              },

              expandAndCollapse: true,
              animationDuration: 550,
              animationDurationUpdate: 750
            }
          ]
        };
        let chart = echarts.init(document.getElementById(id));
        chart.setOption(option);
        }
      })
  }
}
