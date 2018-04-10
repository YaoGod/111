import { Component, OnInit } from '@angular/core';
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {Http} from "@angular/http";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {SaleProductEmployeeService} from "../../../service/sale-product-employee/sale-product-employee.service";
import {User} from "../../../mode/user/user.service";
declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-luck-draw',
  templateUrl: './luck-draw.component.html',
  styleUrls: ['./luck-draw.component.css'],
  providers:[UtilBuildingService,SaleProductEmployeeService]
})
export class LuckDrawComponent implements OnInit {
  public user:User;
  public pageSize = 15;
  public pageNo = 1;
  public total = 0;
  public length = 10;
  private contractBool = true;
  public buildings: any;
  public setInfo = new CardInfo();
  public deptList: Array<Department>;
  public targetName = [];
  public targetId = [];
  public perNum = [];
  public isAllDept:boolean;
  constructor(private http: Http,
              private errorVoid:ErrorResponseService,
              private utilBuildingService:UtilBuildingService,
              private saleProductEmployeeService:SaleProductEmployeeService,
              public ipSetting  : IpSettingService,) { }

  ngOnInit() {
    // this.getParkNumber();
    this.getBuildings();
    this.getDeptList();
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
  /*获取所有部门列表*/
  getDeptList(){
    this.saleProductEmployeeService.getDeptList()
      .subscribe(data =>{
        if(this.errorVoid.errorMsg(data)){
          this.deptList = data.data;
          for(let i = 0;i<this.deptList.length;i++){
            this.deptList[i].choose = false;
            if(this.deptList[i].DEPT_ID === this.targetId[0]){
              this.deptList[i].choose = true;
            }
          }
        }
      });
  }
  /*打开部门选择框*/
  openChooseWin(){
    $('#deptSltWin').show();
    for(let i = 0;i<this.deptList.length;i++){
      this.deptList[i].choose = false;
    }
    for(let i = 0;i<this.deptList.length;i++){
      for(let j = 0 ;j<this.targetId.length;j++){
        if(this.deptList[i].DEPT_ID === this.targetId[j]){
          this.deptList[i].choose = true;
        }
        /*if(this.targetId[j] === 'all'){
          this.isAllDept = true;
        }*/
      }
    }
  }
  /*选取部门*/
  chooseDept(){
    this.isAllDept = false;
    this.targetId = [];
    this.targetName = [];
    for(let i = 0;i<this.deptList.length;i++){
      if(this.deptList[i].choose){
        this.targetId.push(this.deptList[i].DEPT_ID);
        this.targetName.push(this.deptList[i].DEPT_NAME);
      }
    }
    // console.log(this.targetId); console.log(this.targetName);
  }
  /*全选*/
  /*chooseAll() {
    this.isAllDept = true;
    this.targetId = 'all';
    this.targetName = '所有人员';
    for (let i = 0; i < this.deptList.length; i++) {
      this.deptList[i].choose = false;
    }
  }*/
  public getPersonNum(){
    $('#deptSltWin').fadeOut();
    let url = '/building/parking/getDeptShakeNum?deptId='+this.targetId.join(',');
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.perNum = data.data;
      }
    });
  }

  public verfydeptId(){
    if (!this.isEmpty('lotNumber', '不能为空')) {
      return false;
    }
    return true;
  }
  public verfylotNumber(){
    if (!this.isEmpty('lotNumber', '不能为空')) {
      return false;
    }
    return true;
  }
  /*开始摇号*/
  beiginDraw(){
    if (this.setInfo.parkNumber === undefined){
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请先查看未发放停车证数量',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }

    if (!this.verfydeptId()||!this.verfylotNumber()){
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请选择摇号部门和摇号数量',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }
    $('.mask').fadeIn();
    this.setInfo.deptId = this.targetId.join(',');
    if(this.setInfo.num<=this.setInfo.parkNumber){
      let url = '/building/parking/getShakeResult?num='+this.setInfo.num+'&&deptId='+this.setInfo.deptId;
      let postData = JSON.parse(JSON.stringify(this.setInfo));
      this.ipSetting.sendPost(url,postData).subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          console.log(data.data);
        }
      });
    }else{
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请确保有足够的停车证！',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }

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
  deptId: string; // 参与摇号部门
  num:number; // 摇号的数量
  eTime:string; // 有效期开始日期
  bTime: string; // 有效期截止日期
  parkNumber:number; // 剩余停车证数量
  useCarCode: string; // 车牌号
  pstatus:string; // 分配方式
  type: string=''; // 停车证类型
  note:string; // 备注

}
export class Department {
  DEPT_ID   : string;
  DEPT_NAME : string;
  choose    : boolean;
}
