import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {EntrySecurityService, EntryService} from "../../../../service/entry-security/entry-security.service";
import {InfoBuildingService} from "../../../../service/info-building/info-building.service";
import {UserPortalService} from "../../../../service/user-portal/user-portal.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {ActivatedRoute, Router} from "@angular/router";

declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-resubmit',
  templateUrl: './resubmit.component.html',
  styleUrls: ['./resubmit.component.css'],
  providers: [EntrySecurityService,ErrorResponseService,InfoBuildingService]
})

export class ResubmitComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public userList : Array<Person>;
  public buildings;
  public powerId = [];
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
  public content = [];
  public arguments : any;
  public lastAddPower = [];
  public powerIndex:number;
  constructor(
    private router: Router,
    private route    : ActivatedRoute,
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private entrySecurityService:EntrySecurityService,
    private infoBuildingService:InfoBuildingService,
    private userPortalService:UserPortalService,
    public ipSetting  : IpSettingService,
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
    this.postData.handleURL = '/security/entrySecurity/door/apply';
    this.types = ['授权','取消授权','清空授权'];
    this.personTypes = ['自有员工','第三方员工'];
    this.entrySecurity.productType = this.types[0];
    this.entrySecurity.personType = this.personTypes[0];

    this.getBuildingList(0);
    this.getGuardGroupId();
    this.getFlowList();
    this.route.params.subscribe(data => {
      this.arguments = data.id;
    });
    this.getGuardFlow();
  }

  /*获取类型下拉列表*/
  getDeptList(){
    this.entrySecurityService.getDeptList()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          // this.deptList = data.data;
        }
      })
  }
  /*获取get参数*/
  getParameter(){
      let url = window.document.location.href.toString();
      let u = url.split("?");
      if(typeof(u[1]) == "string"){
        u = u[1].split("&");
        let get = {};
        for(let i in u){
          let j = u[i].split("=");
          get[j[0]] = j[1];
        }
        return get;
      } else {
        return {};
      }
  }
  /*根据批次号获取本次编辑的内容*/
  getGuardFlow(){
    let id = this.arguments;
    this.postData.batchId = id;
    let url = '/building/guard/getGuardFlowByBatch?batchId='+id;

    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorResponseService.errorMsg(data)) {
        console.log(data.data);
        if(data.data.flowInfo){
          this.postData.cause = data.data.flowInfo.cause;
          this.postData.type = data.data.flowInfo.type;
        }
        this.postData.data = data.data.guard;
      }
    });
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
      if(this.entrySecurity.productType === '申请清空授权'){
        this.havePower = [];
        return false;
      }
      let url = '/building/guard/getGuardList/1/999';
      let postData = {userId:id,status:'valid'};
      this.ipSetting.sendPost(url,postData).subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          this.havePower = data.data.infos;
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
        let urlSecond = '/workflow/group/getUserSelect/'+this.groupId;
        this.ipSetting.sendGet(urlSecond).subscribe(data2 => {
          if(this.errorResponseService.errorMsg(data2)) {
            this.handleUserId = data2.data;
          }
        });
      }
    });
  }
  /*获取门禁申请流程*/
  getFlowList(){
    let url = '/workflow/flow/getFlowList/1/99';
    let postData = {
      name:'门禁权限申请'
    };
    this.ipSetting.sendPost(url,postData).subscribe(data => {
      if(this.errorResponseService.errorMsg(data)) {
        this.content = data.data.infos[0].content;
      }
    });
  }
  /*切换工单类型清空已输入内容*/
  emptyPro(){
    this.postData.cause = '';
    this.postData.data = [];
    this.close();
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
  /*编辑个人申请内容*/
  editPerson(index){
    $('.mask1').fadeIn();
    this.powerIndex = index;
    this.record = [];
    this.addUser.userid = this.postData.data[index].userId;
    this.getUserInfo(this.addUser.userid);
    if(this.postData.type === '门禁权限申请'){
      this.record.push(new Power());
      this.getBuildingList(this.record.length-1);
      this.lastAddPower = this.postData.data[index].guard;
    }else if(this.postData.type === '申请取消授权'){
      this.lastAddPower = [];
    }

  }
  /*保存申请内容信息(申请授权）*/
  saveContent(index){
    if(this.postData.type === '门禁权限申请'){
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
      for(let i=0;i<this.lastAddPower.length;i++){
        delete this.lastAddPower[i].id;
        delete this.lastAddPower[i].note;
      }
      let postData = {
        guard: temporary.concat(this.lastAddPower),
        userId: this.addUser.userid,
        userName: this.addUser.username
      };
      if(index===0){
        this.lastAddPower = postData.guard;
        this.postData.data[this.powerIndex] = postData;
      }else if(index===1){
        this.postData.data.push(postData);
      }

      this.close();
    }else if(this.postData.type === '申请取消授权'){
      let postData = {
        guard: this.powerId,
        userId: this.addUser.userid,
        userName: this.addUser.username
      };
      if(index===0){
        this.postData.data[this.powerIndex] = postData;
      }else if(index===1){
        this.postData.data.push(postData);
      }
      // console.log(this.postData.data);
      this.close();
    }else if(this.postData.type === '申请清空授权'){
      let postData = {
        guard: this.powerId,
        userId: this.addUser.userid,
        userName: this.addUser.username
      };
      if(index===0){
        this.postData.data[this.powerIndex] = postData;
      }else if(index===1){
        this.postData.data.push(postData);
      }
      // console.log(this.postData.data);
      this.close();
    }

  }

  /*增加人员弹窗*/
  addPerson(){
    $('.mask2').fadeIn();
    this.addUser = new Person();
    this.record = [];
    if(this.postData.type === '门禁权限申请'){
      this.record.push(new Power());
      this.getBuildingList(this.record.length-1);
    }
  }
  /*删除人员*/
  removePerson(index){
    this.postData.data.splice(index,1);
  }
  /*提交*/
  submitPassword(){
    let list = document.getElementsByName("orderCheck");
    let str = [];
    for(let i = 0;i<list.length;i++){
      if(list[i]['checked']){
        str.push(list[i]['value']);
      }
    }
    this.postData.handleUserId = str.join(',');
    // console.log(this.postData);
    if(this.postData.data.length===0){
      confirmFunc.init({
        'title': '提示',
        'mes': '请填写申请人员信息！',
        'popType': 2,
        'imgType': 2,
      });
      return false;
    }
    if(this.postData.cause.trim()===''){
      confirmFunc.init({
        'title': '提示',
        'mes': '请填写申请原因！',
        'popType': 2,
        'imgType': 2,
      });
      return false;
    }
    if(this.postData.handleUserId.length === 0){
      confirmFunc.init({
        'title': '提示',
        'mes': '请选择审批人！',
        'popType': 2,
        'imgType': 2,
      });
      return false;
    }
    let url = '';
    if(this.postData.type === '门禁权限申请'){
      url = '/building/guard/updateFlowGuard';
      this.ipSetting.sendPost(url,this.postData).subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          // console.log(data);
          confirmFunc.init({
            'title': '提示',
            'mes': '提交成功！',
            'popType': 2,
            'imgType': 1,
          });
          this.postData = new Wotany();
          this.postData.data = [];
          this.postData.handleURL = '/security/entrySecurity/door/resubmit';
          $("input:checkbox[name='orderCheck']").prop('checked',false);
          this.router.navigate(['/hzportal/system/examine']);
        }
      });
    }else if(this.postData.type === '申请取消授权'){
      url = '/building/guard/deleteGuardBatch';
      let inner = [];
      for(let i=0;i<this.postData.data.length;i++){
        for(let j=0;j<this.postData.data[i].guard.length;j++){
          inner.push(this.postData.data[i].guard[j]);
        }
      }
      let subInfo = {
        data: inner,
        batchId:this.postData.batchId,
        cause: this.postData.cause,
        handleUserId: this.postData.handleUserId,
        handleURL:'/security/entrySecurity/door/resubmit'
      };
      this.ipSetting.sendPost(url,subInfo).subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          // console.log(data);
          confirmFunc.init({
            'title': '提示',
            'mes': '提交成功！',
            'popType': 2,
            'imgType': 1,
          });
          this.postData = new Wotany();
          this.postData.data = [];
          this.postData.handleURL = '/security/entrySecurity/door/resubmit';
          $("input:checkbox[name='orderCheck']").prop('checked',false);
          this.router.navigate(['/hzportal/system/examine']);
        }
      });
    }else if(this.postData.type === '申请清空授权'){
      url = '/building/guard/deleteUserGuardBatch';
      let inner = [];
      for(let i=0;i<this.postData.data.length;i++){
        inner.push(this.postData.data[i].userId);
      }
      let subInfo = {
        data: inner,
        batchId:this.postData.batchId,
        cause: this.postData.cause,
        handleUserId: this.postData.handleUserId,
        handleURL:'/security/entrySecurity/door/resubmit'
      };
      this.ipSetting.sendPost(url,subInfo).subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          // console.log(data);
          confirmFunc.init({
            'title': '提示',
            'mes': '提交成功！',
            'popType': 2,
            'imgType': 1,
          });
          this.postData = new Wotany();
          this.postData.data = [];
          this.postData.handleURL = '/security/entrySecurity/door/resubmit';
          $("input:checkbox[name='orderCheck']").prop('checked',false);
          this.router.navigate(['/hzportal/system/examine']);
        }
      });
    }
  }
  close(){
    this.havePower = [];
    this.lastAddPower = [];
    this.powerId = [];
    $('.mask,.mask1,.mask2').hide();
    $('.error').html('');
  }
  /*编辑已申请授权的取消*/
  removelastPower(index){
    this.lastAddPower.splice(index,1);
  }
  /*申请取消授权*/
  removehavePower(index,id){
    this.havePower.splice(index,1);
    this.powerId.push(id);
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
  type:string;
  cause: string;
  handleUserId: string;
  handleURL:string;
  batchId:string;
}
export class Guard{
  userId:string;
  userName:string;
  guard:Array<Power>;
}
