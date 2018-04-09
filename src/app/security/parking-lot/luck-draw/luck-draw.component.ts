import { Component, OnInit } from '@angular/core';
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {Http} from "@angular/http";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-luck-draw',
  templateUrl: './luck-draw.component.html',
  styleUrls: ['./luck-draw.component.css'],
  providers:[UtilBuildingService,]
})
export class LuckDrawComponent implements OnInit {
  public pageSize = 15;
  public pageNo = 1;
  public total = 0;
  public length = 10;
  private contractBool = true;
  public buildings: any;
  public setInfo = new CardInfo();
  constructor(private http: Http,
              private errorVoid:ErrorResponseService,
              private utilBuildingService:UtilBuildingService,
              public ipSetting  : IpSettingService,) { }

  ngOnInit() {
    this.getParkNumber();
    this.getBuildings();
  }

  /*获取大楼列表*/
  private getBuildings() {
    this.utilBuildingService.getBuildingList('')
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.buildings = data['data'];
          // console.log(this.buildings);
        }
      })
  }
  /*获取剩余停车证数量*/
  getParkNumber() {
      let url = "/building/parking/getPermitCount";
      let postData = JSON.parse(JSON.stringify(this.setInfo));
      this.ipSetting.sendPost(url,postData).subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.setInfo.parkNumber = data.data;
        }
      });
  }

  verfyNumber(){

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
  buildingName:string=''; // 大楼名称
  buildingId:string; // 大楼ID
  useUserId: string;// 员工编号
  useUserName:string; // 员工姓名
  useUserDept: string; // 员工部门
  lotNumber:string; // 摇号的数量
  eTime:string; // 有效期开始日期
  bTime: string; // 有效期截止日期
  parkNumber:string; // 剩余停车证数量
  useCarCode: string; // 车牌号

  type: string=''; // 停车证类型
  note:string; // 备注

}
