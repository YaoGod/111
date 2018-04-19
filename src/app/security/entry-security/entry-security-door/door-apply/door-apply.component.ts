import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {EntrySecurityService, EntryService} from "../../../../service/entry-security/entry-security.service";

declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-door-apply',
  templateUrl: './door-apply.component.html',
  styleUrls: ['./door-apply.component.css'],
  providers: [EntrySecurityService,ErrorResponseService]
})
export class DoorApplyComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public applyList : Array<EntryService>;
  public deptList;
  public buildings;
  public search: EntryService;
  public entrySecurity:EntryService;
  public types : Array<string>;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private entrySecurityService:EntrySecurityService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("后勤物业/出入安全管理");
    this.applyList = [];
    this.search = new EntryService();
    this.search.building = '';
    this.entrySecurity = new EntryService();
    this.types = ['授权','取消授权'];
    this.entrySecurity.productType = this.types[0];

    /*要删*/
    this.search.module = '';
    let today = new Date().toJSON().substr(0,10);
    this.search.bTime = today;
    this.search.eTime = '';

    this.getSystemLogger(1);
    this.getDeptList();
    this.getBuildingList();
  }

  /*获取日志列表*/
  getSystemLogger(pageNo){
    this.pageNo = pageNo;
    this.entrySecurityService.getSysLog(this.pageNo,this.pageSize,this.search)
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
