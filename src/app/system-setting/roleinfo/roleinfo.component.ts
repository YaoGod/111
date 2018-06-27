import { Component, OnInit } from '@angular/core';
import {Role} from "../../mode/user/user.service";
import {sndCatalog} from "../../mode/catalog/catalog.service";
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {Logger} from "../../mode/logger/logger.service";
declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-roleinfo',
  templateUrl: './roleinfo.component.html',
  styleUrls: ['./roleinfo.component.css']
})
export class RoleinfoComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public loggers : Array<Logger>;
  public search: Logger;
  public deptList: Array<any>;
  public winTitle: string;
  public rule: sndCatalog = new sndCatalog();
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,

  ) {
    this.rule = this.globalCatalogService.getRole("system/role");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/角色管理");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("system/role");
      }
    );
    this.loggers = [];
    this.search = new Logger();
    this.search.module = '角色管理';
    let today = new Date().toJSON().substr(0,10);
    this.search.bTime = today;
    this.search.eTime = '';
    this.search.userDept = "";
    this.search.userName = "";
    this.getSystemLogger(1);
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

}
