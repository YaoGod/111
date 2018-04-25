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
  public pageSize = 10;
  public total = 0;
  public search: EntryService;
  public deptList: Array<any>;
  public entry:DoorMang;
  public record : Array<DoorMang>;
  public buildings: Array<any>;
  public building   : Array<any>;
  public floors   : Array<any>;

  public floorNames   : Array<any>; /*大楼楼层信息列表*/
  public rooms        : Array<any>;/*大楼指定楼层房间信息列表*/
  public cardManage : Array<EntryService>;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,
    private globalUserService:GlobalUserService,
    private infoBuildingService:InfoBuildingService,
    private entrySecurityService:EntrySecurityService,
    private entryService:EntrySecurityService,
    public ipSetting  : IpSettingService

  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("后勤物业/出入安全管理");
    this.cardManage = [];
    this.record = [];
    this.search = new EntryService();
    this.entry = new DoorMang();
    this.record.push(this.entry);
    this.search.deptId = '';// this.globalUserService.getVal().deptId;
    this.search.cardType = '';
    this.getUserList(1);
    this.getDeptList();
    this.getBuildingList(0);
  }

  /*获取用户信息列表*/
  getUserList(pageNo){
    this.pageNo = pageNo;
    this.entrySecurityService.getCardManageList(this.pageNo,this.pageSize,this.search)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          // console.log(data.data);
          this.cardManage = data.data.list;
          this.total = data.data.total;
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
    this.record.push(new DoorMang());
    this.getBuildingList(this.record.length-1);
    console.log(this.record);
    // this.floors.length = this.record.length;
  }
  removePro(index){
    this.record.splice(index,1);
  }
  /*获取楼层名称*/
  getFloorNameListMsg(id,index) {
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
    // console.log(this.record[index].floorNums);
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
    this.entry = new DoorMang();
    $('.red').removeClass('red');
    $('.error').html('');
    $('#newUser').hide();
  }

  /*批量导入*/
  /*selecteFile(){
    this.entry = new EntryService();
    $('#selecteFile').show();
  }*/
  closeFile(){
    this.entry = new DoorMang();
    $('#selecteFile').hide();
  }

  /*新增提交*/
  submit(){
    let error = 0;
    let url = '/building/guard/addGuard';
    let postData = JSON.parse(JSON.stringify(this.record));
    for(let i=0;i<this.cardManage.length;i++){
      if(postData[0].userId === this.cardManage[i].employNo){
        for(let j=0;j<postData.length;j++){
          postData[j].userId = this.cardManage[i].employNo;
          postData[j].cardCode = this.cardManage[i].cardNo;
          postData[j].cardType = this.cardManage[i].cardType;
          // postData[j].type = this.cardManage[i].employNo;
          postData[j].userDept = this.cardManage[i].deptName;
          postData[j].userName = this.cardManage[i].employee;
          postData[j].deptId = this.cardManage[i].deptId;
        }
      }
    }
    if(error === 0) {
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
            // this.getUserList(1);
          }
        })
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

  /*修改*/
  /*/building/guard/getGuardInfo/*/
  editRecord(id) {
    /*let url = '/building/guard/getGuardInfo/'+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorResponseService.errorMsg(data)) {
        console.log(data.data);
        this.record = data.data;
      }
    });*/
    this.record[0].userId = id;
    $('#newUser').show();
  }


  /*授权或取消授权*/
  cancelOrAuthority(id){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否取消授权？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        this.userPortalService.deleteUserInfo(id)
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
  }
/*导出*/
  downloadTemplates() {
    console.log('下载模板');
  }

}
export class DoorMang {

  buildingId: string;
  buildingName: string;
  cardCode: string;
  cardType: string;
  floorNum: string;
  id: number;
  modifyTime: string;
  modifyUserId:string;
  note: string;
  roomNum: string;
  status: string;
  type: string;
  userDept: string;
  userId: string;
  userName: string;
  deptId: string;
  buildings: Array<any>;
  floorNums: Array<any>;
  rooms: Array<any>;
}
