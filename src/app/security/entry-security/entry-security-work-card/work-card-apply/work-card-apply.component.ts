import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {EntrySecurityService, EntryService} from "../../../../service/entry-security/entry-security.service";

declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-work-card-apply',
  templateUrl: './work-card-apply.component.html',
  styleUrls: ['./work-card-apply.component.css'],
  providers: [EntrySecurityService,ErrorResponseService],
})
export class WorkCardApplyComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public deptList;
  public buildings;
  public applyList : Array<EntryService>;
  public search: EntryService;
  public entrySecurity:EntryService;
  public types : Array<string>;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,
    private entrySecurityService:EntrySecurityService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("后勤物业/出入安全管理");
    this.applyList = [];
    this.search = new EntryService();
    this.search.building = '';
    this.entrySecurity = new EntryService();
    this.types = ['新申请','补发'];
    this.entrySecurity.productType = this.types[0];
    this.search.module = '';
    let today = new Date().toJSON().substr(0,10);
    this.search.bTime = today;
    this.search.eTime = '';
    this.getDeptList();
    this.getSystemLogger(1);
    this.getBuildingList();
  }

  /*获取日志列表*/
  getSystemLogger(pageNo){
    this.pageNo = pageNo;
    this.userPortalService.getSysLog(this.pageNo,this.pageSize,this.search)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.applyList = data.data.infos;
          this.total = data.data.total;
        }
      })
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

  /*获取大楼名称列表*/
  getBuildingList() {
    this.entrySecurityService.getBuildingList('')
      .subscribe(data => {
        if(this.errorResponseService.errorMsg(data)) {
          this.buildings = data.data;
        }
      })
  }
  submitPassword(){

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
