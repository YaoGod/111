import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {Logger} from "../../mode/logger/logger.service";
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public loggers : Array<Logger>;
  public search: Logger;
  public moduleList;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/日志管理");
    this.loggers = [];
    this.search = new Logger();
    this.search.module = '';
    let today = new Date().toJSON().substr(0,10);
    this.search.bTime = today;
    this.search.eTime = '';
    this.getModuleList();
    this.getSystemLogger(1);
  }
  /*获取类型下拉列表*/
  getModuleList(){
    this.userPortalService.getModuleList()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.moduleList = data.data;
        }
      })
  }
  /*获取日志列表*/
  getSystemLogger(pageNo){
    this.pageNo = pageNo;
    this.userPortalService.getSysLog(this.pageNo,this.pageSize,this.search)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.loggers = data.data.infos;
          this.total = data.data.total;
        }
      })
  }
  /*导出*/
  exportSysLog(){
    return this.userPortalService.exportSysLog(this.pageNo,this.pageSize,this.search);
  }
}
