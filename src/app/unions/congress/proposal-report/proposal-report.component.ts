import { Component, OnInit } from '@angular/core';
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {sndCatalog} from "../../../mode/catalog/catalog.service";
import {Http} from "@angular/http";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../../service/user-portal/user-portal.service";
declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-proposal-report',
  templateUrl: './proposal-report.component.html',
  styleUrls: ['./proposal-report.component.css'],
  providers:[UtilBuildingService,sndCatalog],
})
export class ProposalReportComponent implements OnInit {
  public newCard = new CardInfo();
  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public length = 10;
  public searchInfo = new SearchInfo();
  public record:any;
  public rule : sndCatalog = new sndCatalog();
  public entrySecurity:any;
  public beginTime:string;
  public endTime:string;
  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
    private userPortalService:UserPortalService,
    private globalCatalogService:GlobalCatalogService
  ) {
    this.rule = this.globalCatalogService.getRole("party/upload");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("工会管理/职代会");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("party/upload");
      }
    );
    this.searchInfo.isFound = 'success,disagree';
    this.searchInfo.type = '';
    this.searchInfo.bTime = '';
    this.searchInfo.eTime = '';
    this.repairSearch(1);
    this.getListTime();
  }

  /*查询*/
  repairSearch(num){
    let url = '/soclaty/flow/getSoclatyFlowList/'+num+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.searchInfo).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.record = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  /*获取开放时间信息*/
  getListTime(){
    let url = "/portal/cata/getCataList/1/999?cataName=职代会提案发起时间";
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.entrySecurity = data.data.infos[0];
        this.beginTime = this.entrySecurity.beginTime;
        this.endTime = this.entrySecurity.endTime;

      }
    });
  }
  /*保存时间更改*/
  saveContent(){
    let temporary = JSON.parse(JSON.stringify(this.entrySecurity));
    temporary.beginTime = this.beginTime;
    temporary.endTime = this.endTime;
    this.userPortalService.updateCataInfo(temporary)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data.msg,
            'popType': 2,
            'imgType': 1,
          });
          this.getListTime();
        }
      })
  }

  /*导出*/
  exportReport() {
    let url = this.ipSetting.ip+'/soclaty/flow/getSoclatyFlowExcel?type='+this.searchInfo.type+'&bTime='+
      this.searchInfo.bTime+'&eTime='+this.searchInfo.eTime;
    this.http.get(url)
      .subscribe(data => {
        window.location.href = url;
      });
  }
}
export class CardInfo {
  id: number; // 本条信息ID
  code:string;   // 提案编号
  theme:string; // 提案主题
  type:string; // 提案类型
  isFound:string; // 是否立案
  hostDeptName:string; // 主办部门
  helpDeptName:string; // 协办部门
  createTime:string; // 开始时间
}
export class SearchInfo {
  id: number; // 本条信息ID
  isFound:string; // 提案状态
  type:string; // 提案类型
  bTime:string; // 开始时间
  eTime:string; // 结束时间
}
