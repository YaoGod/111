import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {SaleProductEmployeeService} from "../../../../service/sale-product-employee/sale-product-employee.service";
import {UtilBuildingService} from "../../../../service/util-building/util-building.service";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {ActivatedRoute} from "@angular/router";

declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-paperinfo',
  templateUrl: './paperinfo.component.html',
  styleUrls: ['./paperinfo.component.css'],
  providers:[UtilBuildingService,SaleProductEmployeeService,]
})
export class PaperinfoComponent implements OnInit {
  public ID:string;
  public eTime:string;
  public newCard = new CardInfo();
  public history:any;
  constructor(private http: Http,
              private errorVoid:ErrorResponseService,
              private globalCatalogService:GlobalCatalogService,
              private utilBuildingService:UtilBuildingService,
              private saleProductEmployeeService:SaleProductEmployeeService,
              private route:ActivatedRoute,
              public ipSetting  : IpSettingService) { }

  ngOnInit() {
    this.route.params.subscribe(data => {
       this.editCardInfo(data.id);
       this.ID = data.id;
    });
    // this.editCardInfo();
  }
  editCardInfo(id){
    // this.getUserName(useId);
    // this.getUserCar(useId);
    let url = '/building/parking/getParkingPermitInfo/'+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.newCard = data.data.object;
        this.history = data.data.useList;
        this.eTime = this.newCard.eTime;
        this.getUserName(this.newCard.useUserId);
      }
    });
  }
  /*根据员工号获取人员和姓名*/
  getUserName(value) {
    if (value && value.length > 7) {
      let url = "/portal/user/getUserInfo/" + value;
      this.ipSetting.sendGet(url).subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.newCard.useUserDept = data.data.deptId;
          this.newCard.useUserName = data.data.username;
          this.newCard.useUserTel = data.data.teleNum;
        }
        if (data.status === 1) {
          this.newCard.useUserDept = '';
          this.newCard.useUserName = '';
          this.newCard.useUserTel = '';
        }
      });
    }
  }
  /*点击延期*/
  addDate(){
    this.eTime = this.newCard.eTime;
    $('.mask').fadeIn();
  }
  /*点击失效*/
  invalid(){
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否确认该停车证失效？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let url = "/building/parking/updateParkingPermitInfo";
        if (!this.verifyeTime()) {
          return false;
        }
        let postData = JSON.parse(JSON.stringify(this.newCard));
        postData.status = 'invalid';
        this.ipSetting.sendPost(url, postData).subscribe(data => {
          if(this.errorVoid.errorMsg(data)){
            confirmFunc.init({
              'title': '提示' ,
              'mes': '该停车证已失效！',
              'popType': 0 ,
              'imgType': 1 ,
            });
            this.editCardInfo(this.ID);
            this.addCancel();
          }
        });
      }
    });
  }
  /*延期取消*/
  addCancel(){
    $('.mask').fadeOut();
    $('.errorMessage').html('');
  }

  public verifyeTime() {
    if (!this.isEmpty('eTime', '不能为空')) {
      return false;
    }
    return true;
  }
  /*提交*/
  submit(){
    let url = "/building/parking/updateParkingPermitInfo";

    if (!this.verifyeTime()) {
      return false;
    }
    let postData = JSON.parse(JSON.stringify(this.newCard));
    postData.eTime = this.eTime;
    this.ipSetting.sendPost(url, postData).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '延期成功',
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.editCardInfo(this.ID);
        this.addCancel();
      }
    });
  }
  /**非空校验*/
  public isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if(data === null){
      this.addErrorClass(id, error);
      return false;
    }else{
      if (data.toString().trim() === '')  {
        this.addErrorClass(id, error);
        return false;
      }else {
        this.removeErrorClass(id);
        return true;
      }
    }
  }
  /** 添加错误信息class */
  public  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-inp').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /**去除错误信息class */
  public  removeErrorClass(id: string) {
    $('#' + id).parents('.form-inp').removeClass('form-error');
    $('#' + id).parents('.form-inp').children('.errorMessage').html('');
  }
}
export class CardInfo {
  id: number; // 本条信息ID
  buildingName:string; // 大楼名称
  buildingId:string; // 大楼ID
  useUserId: string;// 员工编号
  useUserName:string; // 员工姓名
  useUserDept: string; // 员工部门
  useUserTel:string; // 员工电话
  eTime:string; // 有效期开始日期
  bTime: string; // 有效期截止日期
  modifyTime:string; // 发放日期
  useETime:string; // 发放截止日期
  useCarCode: string; // 车牌号
  permitStatus: string; // 使用状态
  useStatus:string; // 发放状态
  name:string;// 停车证名称x
  code: string; // 停车证编码
  type: string; // 停车证类型
  note:string; // 备注

}
