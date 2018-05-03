import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {EntrySecurityService, EntryService} from "../../../../service/entry-security/entry-security.service";
import {GlobalUserService} from "../../../../service/global-user/global-user.service";
import {InfoBuildingService} from "../../../../service/info-building/info-building.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";

declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-door-mang',
  templateUrl: './door-mang.component.html',
  styleUrls: ['./door-mang.component.css'],
  providers: [EntrySecurityService,ErrorResponseService,InfoBuildingService]
})
export class DoorMangComponent implements OnInit {

  public pageNo;
  public pageSize = 15;
  public total = 0;
  public length = 10;
  public search: EntryService;

  public entry:DoorMang;
  public deptList: Array<any>;

  public recordChild : Power;
  public record : Array<Power>;
  public editrecord : Array<DoorMang>;
  public buildings: Array<any>;
  public all :boolean;
  public beginCheck :boolean;
  public cardManage : Array<EntryService>;
  public arr = [];
  public userList = [];
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private infoBuildingService:InfoBuildingService,
    private entrySecurityService:EntrySecurityService,
    private entryService:EntrySecurityService,
    public ipSetting  : IpSettingService

  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("后勤物业/出入安全管理/门禁权限管理");
    this.cardManage = [];
    this.record = [];
    this.recordChild = new Power();
    this.editrecord = [];
    this.search = new EntryService();
    this.entry = new DoorMang();

    this.record.push(this.recordChild);
    // this.search.deptId = ''; this.globalUserService.getVal().deptId;
    // this.search.cardType = '';
    if(localStorage.getItem("deptIdDoorMang")){
      this.search.deptId = localStorage.getItem("deptIdDoorMang");
    }else{
      this.search.deptId = '';
    }
    if(localStorage.getItem("cardTypeDoorMang")){
      this.search.cardType = localStorage.getItem("cardTypeDoorMang");
    }else{
      this.search.cardType = '';
    }
    this.getUserList(1);
    this.getDeptList();
    this.getBuildingList(0);
  }

  /*获取用户信息列表*/
  getUserList(pageNo){
    this.all = false;
    this.pageNo = pageNo;
    this.entrySecurityService.getCardManageList(this.pageNo,this.pageSize,this.search)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.cardManage = data.data.list;
          this.total = data.data.total;
          localStorage.setItem("deptIdDoorMang",this.search.deptId);
          localStorage.setItem("cardTypeDoorMang",this.search.cardType);
        }
      })
  }
  /*获取所有部门下拉列表*/
  getDeptList(){
    this.entryService.getDeptList()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.deptList = data.data;
        }
      })
  }

  /*获取大楼列表*/
  getBuildingList(index) {
    this.entrySecurityService.getBuildingList('')
      .subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          this.record[index].buildings = data.data;
        }
      })
  }
  /*增加栏目*/
  addPro(){
    this.record.push(new Power());
    this.getBuildingList(this.record.length-1);
  }
  removePro(index){
    this.record.splice(index,1);
  }
  /*获取楼层名称*/
  getFloorNameListMsg(id,index) {
    if(id === ''){
      this.record[index].buildingId = '';
      this.record[index].buildingName = '';
      return false;
    }
    this.record[index].rooms = [];
    this.record[index].floorNum = '';
    this.record[index].roomNum = '';
    for(let i=0;i<this.record[index].buildings.length;i++){
       if(this.record[index].buildings[i].ID==id){
         this.record[index].buildingName = this.record[index].buildings[i].NAME;
       }
    }
    this.infoBuildingService.getFloorNameListMsg(id)
      .subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          this.record[index].floorNums = data.data;
        }
      });
  }
  /*获取楼层房间信息*/
  getRoomListMsg(id,index){
    if(id===''){
      return false;
    }
    for (let i=0;i<this.record[index].floorNums.length;i++) {
      if (this.record[index].floorNums[i].FLOOR_NUM == id) {
        this.infoBuildingService.getRoomListMsg( this.record[index].floorNums[i].ID, 1,99)
          .subscribe(data =>{
            if(this.errorResponseService.errorMsg(data)) {
              this.record[index].rooms = data.data.infos;
            }
          });
      }
    }
  }
  closeNewUser(){
    // this.record = [];
    this.editrecord = [];
    $('.red').removeClass('red');
    $('.error').html('');
    $('#newUser,#delUser').hide();
  }

  /*批量导入*/
  /*selecteFile(){
    this.entry = new EntryService();
    $('#selecteFile').show();
  }
  closeFile(){
    this.entry = new DoorMang();
    $('#selecteFile').hide();
  }*/

  /*新增提交*/
  submit(){
    let error = 0;
    let url = '/building/guard/addGuard';
    if(!this.record||this.record.length<1){
      confirmFunc.init({
        'title': '提示',
        'mes': '请增加授权信息！',
        'popType': 2,
        'imgType': 2,
      });
      return false;
    }
    let temporary = JSON.parse(JSON.stringify(this.record));
    for(let i=0;i<temporary.length;i++){
      delete temporary[i].buildings;
      delete temporary[i].floorNums;
      delete temporary[i].rooms;
    }
    for(let i=0;i<temporary.length;i++){
      if(!temporary[i].buildingId||temporary[i].buildingId===''){
        confirmFunc.init({
          'title': '提示',
          'mes': '大楼信息为必填！',
          'popType': 2,
          'imgType': 2,
        });
        return false;
      }
    }

    let postData = {
      guard: temporary,
      listUser: this.userList
    };
    /*for(let i=0;i<this.cardManage.length;i++){
      if(postData[0].userId === this.cardManage[i].employNo){
        for(let j=0;j<postData.length;j++){
          postData[j].userId = this.cardManage[i].employNo;
          postData[j].cardCode = this.cardManage[i].cardNo;
          postData[j].cardType = this.cardManage[i].cardType;
          postData[j].userDept = this.cardManage[i].deptId;
          postData[j].userName = this.cardManage[i].employee;
        }
      }
    }*/

    this.ipSetting.sendPost(url,postData)
      .subscribe(data => {
        if (this.errorResponseService.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data.msg,
            'popType': 2,
            'imgType': 1,
          });
          this.closeNewUser();
          this.getUserList(1);
        }
      })

  }

  /*新增授权*/
  addRecord(id,num) {
    if(!num){
      confirmFunc.init({
        'title': '提示',
        'mes': '暂无工号牌或已离职，无法授权！',
        'popType': 2,
        'imgType': 2
      });
      return false;
    }
    this.userList = [];
    this.record = [];
    this.record.push(new Power());
    this.getBuildingList(0);
    this.userList[0] = id;
    // this.record[0].cardType = cardType;
    $('#newUser').show();
  }
  /*取消授权操作*/
  editRecord(id){
    let url = '/building/guard/getGuardList/1/999';
    let postData = JSON.parse(JSON.stringify(this.search));
    postData.userId = id;
     this.ipSetting.sendPost(url,postData).subscribe(data => {
     if(this.errorResponseService.errorMsg(data)) {
      this.editrecord = data.data.infos;
      if(this.editrecord.length===0){
        confirmFunc.init({
          'title': '提示',
          'mes': '暂无授权',
          'popType': 2,
          'imgType': 1
        });
      }else{
        $('#delUser').fadeIn();
      }
     }
     });
  }
  /*删除单项授权*/
  delPro(index,id){
    let url = '/building/guard/updateGuardStatus';
    let postData = {
      id:id,
      status:'delete'
    };
    this.ipSetting.sendPost(url,postData).subscribe(data => {
      if (this.errorResponseService.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示',
          'mes': data.msg,
          'popType': 2,
          'imgType': 1
        });
        this.editrecord.splice(index,1);
      }
    });
  }
  /*全选*/
  public checkedAll(){
    let list = document.getElementsByName("orderCheck");
    for(let i = 0;i<list.length;i++){
      list[i]['checked'] = this.all;
    }
  }

  /*判断是否全选*/
  public checkIsAll(){
    let list = document.getElementsByName("orderCheck");
    for(let i = 0;i<list.length;i++){
      if(!list[i]['checked']){
        this.all = false;
      }
    }
  }
  /*批量授权*/
  batchAccredit(){
    this.beginCheck = false;
    this.userList = [];
    let list = document.getElementsByName("orderCheck");
    let str = [];
    let people = [];
    // let cardTypeArr = [];
    for(let i = 0;i<list.length;i++){
      if(list[i]['checked']){
        str.push(list[i]['checked']);
        people.push(list[i]['value']);
        // cardTypeArr.push(list[i]['value'].split(',')[1]);
      }
    }
    for(let i = 0;i<str.length;i++){
      if(str[i]===true){
        this.beginCheck = true;
      }
    }
    if(this.beginCheck){
      this.userList = people;
      this.record = [];
      this.record.push(new Power());
      this.getBuildingList(0);
      $('#newUser').show();
    }else{
      confirmFunc.init({
        'title': '提示',
        'mes': '请先选择员工！',
        'popType': 2,
        'imgType': 2
      });
    }

  }
  /*批量取消授权*/
  cancel(){
    this.beginCheck = false;
    let url = '/building/guard/deleteGuardStatusBatch';
    let list = document.getElementsByName("orderCheck");
    let postData = [];
    let str = [];
    for(let i = 0;i<list.length;i++){
      if(list[i]['checked']){
        str.push(list[i]['checked']);
        postData.push(list[i]['value']);
      }
    }
    for(let i = 0;i<str.length;i++){
      if(str[i]===true){
        this.beginCheck = true;
      }
    }
    if(this.beginCheck){
      confirmFunc.init({
        'title': '提示',
        'mes': '是否取消所选用户的门禁权限？',
        'popType': 1,
        'imgType': 3,
        "callback": () => {
          this.ipSetting.sendPost(url,postData)
            .subscribe(data => {
              if (this.errorResponseService.errorMsg(data)) {
                confirmFunc.init({
                  'title': '提示',
                  'mes': data.msg,
                  'popType': 2,
                  'imgType': 1
                });
                this.getUserList(1);
              }
            });
        }
      });
    }else{
      confirmFunc.init({
        'title': '提示',
        'mes': '请先选择员工！',
        'popType': 2,
        'imgType': 2
      });
    }

  }
  /*一键取消授权*/
  emptyRecord(id){
    let url = '/building/guard/getGuardList/1/999';
    let postData = JSON.parse(JSON.stringify(this.search));
    postData.userId = id;
    this.ipSetting.sendPost(url,postData).subscribe(data => {
      if(this.errorResponseService.errorMsg(data)) {
        this.editrecord = data.data.infos;
        if(this.editrecord.length===0){
          confirmFunc.init({
            'title': '提示',
            'mes': '暂无授权',
            'popType': 2,
            'imgType': 1
          });
        }else{
          confirmFunc.init({
            'title': '提示',
            'mes': '是否取消当前用户的门禁权限？',
            'popType': 1,
            'imgType': 3,
            "callback": () => {
              let url22 = '/building/guard/deleteGuardStatusBatch';
              let postData22 = [id];

              this.ipSetting.sendPost(url22,postData22)
                .subscribe(data2 => {
                  if (this.errorResponseService.errorMsg(data2)) {
                    confirmFunc.init({
                      'title': '提示',
                      'mes': data2.msg,
                      'popType': 2,
                      'imgType': 1
                    });
                    this.getUserList(1);
                  }
                });
            }
          });
        }
      }
    });

  }
  /*导出*/
  downloadTemplates() {
    console.log('下载模板');
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
}
export class Power{
  id: number;
  buildingId: string;
  buildingName: string;
  floorNum: string;
  roomNum: string;
  cardType: string;
  buildings: Array<any>;
  floorNums: Array<any>;
  rooms: Array<any>;
}
export class DoorMang {

  buildingId: string;
  buildingName: string;
  cardCode: string;
  cardType: string;
  floorNum: string;
  id: number;
  handleTime: string;
  note: string;
  roomNum: string;
  status: string;
  type: string;
  userDept: string;
  userId:string;
  userName: string;
  deptId: string;
  buildings: Array<any>;
  floorNums: Array<any>;
  rooms: Array<any>;
}
