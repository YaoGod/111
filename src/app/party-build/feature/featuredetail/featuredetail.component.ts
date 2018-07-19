import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";

declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-featuredetail',
  templateUrl: './featuredetail.component.html',
  styleUrls: ['./featuredetail.component.css']
})
export class FeaturedetailComponent implements OnInit {
  public ID:string;
  public eTime:string;
  public newCard = new CardInfo();
  public history:any;
  public imgInfo = [];
  public imgName = [];
  constructor(
    private route    : ActivatedRoute,
    private globalCatalogService:GlobalCatalogService,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/工作台账上传");
    this.route.params.subscribe(data => {
      this.getWelfare(data.id);
    });
  }
  /*获取当前id的会议内容*/
  getWelfare(id){
    let url = "/party/report/detail/"+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        console.log(data);
        this.newCard = data.data;
        if(this.newCard.imgPathList){
          this.imgInfo = this.newCard.imgPathList;
          this.imgName = this.filter_array(this.newCard.imageName.split(','));
        }
      }
    });

  }
  private filter_array(array) {
    for(var i = 0 ;i<array.length;i++) {
      if(array[i] == "" || typeof(array[i]) == "undefined") {
        array.splice(i,1);
        i= i-1;
      }
    }
    return array;
  }
}
export class CardInfo {
  id: number; // 本条信息ID
  branchName:string; // 支部名称
  branchAttach:string;
  type:string; // 会议类型
  subType:string; // 子类型
  month: string;// 月份
  name:string; // 文件名称
  beginTime:string; // 开始时间
  endTime:string; // 结束时间
  host:string; // 主持人
  recorder:string; // 记录人
  shouldNum:number; // 应到人数
  factNum:number; // 实到人数
  absentNum:number; // 缺席人数
  reason:string; // 缺席原因
  theme:string; // 会议主题
  note:string; // 会议议程
  address:string; // 会议地点
  imageName:string;
  fileName=[];
  filePath=[];
  fileContract:any;
  imgPath:string;
  imgPathList = [];
}