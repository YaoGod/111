import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {EntrySecurityService, EntryService} from "../../../../service/entry-security/entry-security.service";
import {InfoBuildingService} from "../../../../service/info-building/info-building.service";
import {UserPortalService} from "../../../../service/user-portal/user-portal.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";

declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-door-apply',
  templateUrl: './door-apply.component.html',
  styleUrls: ['./door-apply.component.css'],
  providers: [EntrySecurityService,ErrorResponseService,InfoBuildingService]
})
export class DoorApplyComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public userList : Array<Person>;
  public deptList;
  public buildings;
  public search: EntryService;
  public entrySecurity:EntryService;
  public types : Array<string>;
  public personTypes : Array<string>;
  public record : Array<Power>;
  public havePower:any;
  public addUser:Person;
  public postData:Wotany;
  public userId:string;
  public handleUserId:any;
  public groupId:string;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private entrySecurityService:EntrySecurityService,
    private infoBuildingService:InfoBuildingService,
    private userPortalService:UserPortalService,
    public ipSetting  : IpSettingService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("后勤物业/出入安全管理");
    this.userId = '';
    this.record = [];
    this.record.push(new Power());
    this.userList = [];
    this.userList.push(new Person());
    this.entrySecurity = new EntryService();
    this.addUser = new Person();
    this.postData = new Wotany();
    this.postData.data = [];
    this.types = ['授权','取消授权'];
    this.personTypes = ['自有员工','第三方员工'];
    this.entrySecurity.productType = this.types[0];
    this.entrySecurity.personType = this.personTypes[0];

    this.getDeptList();
    this.getBuildingList(0);
    this.getGuardGroupId();
  }

  /*获取类型下拉列表*/
  getDeptList(){
    this.entrySecurityService.getDeptList()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.deptList = data.data;
        }
      })
  }
  /*根据用户id获取姓名和部门*/
  getUserInfo(id){
    if(id&&id.length>7) {
      this.userId = id;
      this.userPortalService.getUserInfo(id)
        .subscribe(data => {
          if (this.errorResponseService.errorMsg(data)) {
            this.addUser = data.data;
          }
        });
      let url = '/building/guard/getGuardList/1/999';
      let postData = {userId:id};
      this.ipSetting.sendPost(url,postData).subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          this.havePower = data.data.infos;
          console.log(this.havePower);
        }
      });
    }
  }
  /*获取审批群组ID*/
  getGuardGroupId(){
    let url = '/building/guard/getGuardGroup';
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorResponseService.errorMsg(data)) {
        this.groupId = data.data;
        console.log(data);
        let urlSecond = '/workflow/group/getUserSelect/'+this.groupId;
        this.ipSetting.sendGet(urlSecond).subscribe(data2 => {
          if(this.errorResponseService.errorMsg(data2)) {
            this.handleUserId = data2.data;
            console.log(data2.data);
          }
        });
      }
    });
  }
  /*增加授权栏目*/
  addPro(){
    this.record.push(new Power());
    this.getBuildingList(this.record.length-1);
  }

  /*获取大楼列表*/
  getBuildingList(index) {

      this.entrySecurityService.getBuildingList('')
        .subscribe(data => {
          if(this.errorResponseService.errorMsg(data)) {
            if(index>0){
              this.record[index].buildings = data.data;
            }else{
              this.record[0].buildings = data.data;
            }
          }
        })

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
  /*保存申请内容信息*/
  saveContent(){
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
      userId: this.addUser.userid,
      userName: this.addUser.username
    };
    this.postData.data.push(postData);
    this.close();
  }

  /*增加人员弹窗*/
  addPerson(){
    $('.mask2').fadeIn();
    this.addUser = new Person();
    this.record = [];
    if(this.entrySecurity.productType==='授权'){
      this.record.push(new Power());
    }
    this.getBuildingList(this.record.length-1);
  }
  /*删除人员*/
  removePerson(index){
    this.postData.data.splice(index,1);
  }
  submitPassword(){
    // this.postData.handleUserId = localStorage.getItem('username');
    let list = document.getElementsByName("orderCheck");
    let str = [];
    for(let i = 0;i<list.length;i++){
      if(list[i]['checked']){
        str.push(list[i]['value']);
      }
    }
    this.postData.handleUserId = str.join(',');
    console.log(this.postData);
  }
  close(){
    this.havePower = [];
    $('.mask,.mask1,.mask2').hide();
    $('.error').html('');
  }
  /*申请取消授权*/
  removehavePower(index){
    this.havePower.splice(index,1);
  }
  /*删除增加的申请内容*/
  removePro(index){
    this.record.splice(index,1);
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
export class Person{
  id: number;
  userid: string;
  username: string;
  deptId: string;
  deptName: string;
}
export class Wotany{
  data: Array<Guard>;
  cause: string;
  handleUserId: string;
}
export class Guard{
  userId:string;
  userName:string;
  guard:Array<Power>;
}
