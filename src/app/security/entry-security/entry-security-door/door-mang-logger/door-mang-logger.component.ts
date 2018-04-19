import { Component, OnInit } from '@angular/core';
import {EntryService} from "../../../../service/entry-security/entry-security.service";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {GlobalUserService} from "../../../../service/global-user/global-user.service";
import {UtilBuildingService} from "../../../../service/util-building/util-building.service";

@Component({
  selector: 'app-door-mang-logger',
  templateUrl: './door-mang-logger.component.html',
  styleUrls: ['./door-mang-logger.component.css'],
  providers: [UtilBuildingService,ErrorResponseService]
})
export class DoorMangLoggerComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public search: EntryService;
  public deptList: Array<any>;
  public buildings: Array<any>;
  public cardManage: Array<EntryService>;

  constructor(
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,
    private globalUserService:GlobalUserService,
    private utilBuildingService:UtilBuildingService

  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("后勤物业/出入安全管理");
    this.cardManage = [];
    this.search = new EntryService();
    this.search.deptId = this.globalUserService.getVal().deptId;
    this.search.building = '';
    this.getUserList(1);
    this.getDeptList();
    this.getBuildingList();
  }

  /*获取用户信息列表*/
  getUserList(pageNo){
    this.pageNo = pageNo;
    this.userPortalService.getUserList(this.pageNo,this.pageSize,this.search)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.cardManage = data.data.infos;
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
