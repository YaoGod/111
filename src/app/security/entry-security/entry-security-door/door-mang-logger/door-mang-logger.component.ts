import { Component, OnInit } from '@angular/core';
import {EntrySecurityService, EntryService} from "../../../../service/entry-security/entry-security.service";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {GlobalUserService} from "../../../../service/global-user/global-user.service";
import {UtilBuildingService} from "../../../../service/util-building/util-building.service";
import {ActivatedRoute} from "@angular/router";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-door-mang-logger',
  templateUrl: './door-mang-logger.component.html',
  styleUrls: ['./door-mang-logger.component.css'],
  providers: [UtilBuildingService,ErrorResponseService,EntrySecurityService]
})
export class DoorMangLoggerComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public recordSearch: EntryService;
  public deptList: Array<any>;
  public buildings: Array<any>;
  public cardManage: Array<EntryService>;
  public recordUser : EntryService;
  public record : Array<DoorMang>;
  public history: Array<HistoryLog>;
  public ID:number;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private globalUserService:GlobalUserService,
    private utilBuildingService:UtilBuildingService,
    private entrySecurityService:EntrySecurityService,
    private route:ActivatedRoute,
    public ipSetting  : IpSettingService

  ) { }

  ngOnInit() {
    this.route.params.subscribe(data => {
      // this.editCardInfo(data.id);
      this.ID = data.id;
    });
    this.globalCatalogService.setTitle("后勤物业/出入安全管理");
    this.cardManage = [];
    this.record = [];
    this.history = [];
    this.recordUser = new EntryService();
    this.recordSearch = new EntryService();
    // this.search.deptId = this.globalUserService.getVal().deptId;
    // this.search.building = '';
    this.getUserList(1);
    this.getGuardList();
    this.getBuildingList();
    this.getGuardRecord(1);
  }
  /*获取用户信息列表*/
  getUserList(pageNo){
    this.pageNo = pageNo;
    let postData = JSON.parse(JSON.stringify(this.recordSearch));
    postData.employNo = this.ID;
    this.entrySecurityService.getCardManageList(this.pageNo,this.pageSize,postData)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.recordUser = data.data.list[0];
          this.total = data.data.total;
        }
      })
  }
  /*获取用户权限信息列表*/
  getGuardList(){
    let url = '/building/guard/getGuardList/1/999';
    let postData = JSON.parse(JSON.stringify(this.recordSearch));
    postData.userId = this.ID;
    this.ipSetting.sendPost(url,postData).subscribe(data => {
      if(this.errorResponseService.errorMsg(data)) {
        this.record = data.data.infos;
      }
    });
  }
  getGuardRecord(num){
    let url = '/building/guard/getGuardRecord/'+this.ID+'/'+num+'/'+this.pageSize;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorResponseService.errorMsg(data)) {
        // console.log(data.data);
        this.history = data.data.infos;
        this.total = data.data.total;
      }
    });

  }
  /*获取大楼名称列表*/
  getBuildingList() {
    this.utilBuildingService.getBuildingList('')
      .subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          this.buildings = data.data;
        }
      })
  }

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
  userId: string;
  userName: string;
  deptId: string;
  buildings: Array<any>;
  floorNums: Array<any>;
  rooms: Array<any>;
}
export class HistoryLog {
  guardId: number;
  handleTime: string;
  handleType: string;// 变更方式
  handleContent: string; // 变更对象
  handleUserDept: string; // 操作人员部门
  handleUserId: string; // 操作人员编号
  handleUserName: string; // 操作人员姓名
  id: number;
  userDept: string; // 员工部门
  userId: string; // 员工编号
  userName: string; // 员工姓名
}
