import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {SaleProductEmployeeService} from "../../../service/sale-product-employee/sale-product-employee.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {Http} from "@angular/http";
import {split} from "ts-node/dist";

declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-export-report',
  templateUrl: './export-report.component.html',
  styleUrls: ['./export-report.component.css'],
  providers:[UtilBuildingService,SaleProductEmployeeService],
})
export class ExportReportComponent implements OnInit {

  public pageNo:number;
  public pageSize:number;
  public total: number;
  public list: Array<any>;
  public search: Report;
  public repairDept = [];
  public record:any;
  public countType:string;
  public typeTemplate:string;
  public imageName: any;
  public abc = ['三会一课','"六好"党支部建设月报','"主题党日"活动简报','党建实践案例','党委委员调研党支部信息','党支部工作计划和总结',
    '党支部岗区队建设情况','支部特色','学习时间'];
  constructor(
    private http:Http,
    private globalCatalogService:GlobalCatalogService,
    private saleProductEmployeeService:SaleProductEmployeeService,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.pageNo = 1;
    this.pageSize = 15;
    this.globalCatalogService.setTitle("党建管理/工作报表管理");
    this.search = new Report();
    this.search.type = "1";
    this.typeTemplate = '1';
    this.search.subType = '';
    this.search.branchName = '';
    this.search.BTime = '';
    this.search.ETime = '';
    this.getRepairDept();
    this.getDataList(1);
  }
  getDataList(num){
    this.search.type = this.typeTemplate;
    let url = '/party/report/getList/'+num+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.search).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.record = data.data.list;
        this.total = data.data.total;
        for(let i = 0;i<this.record.length;i++){
          if(this.record[i].imageName){
            this.record[i].arr = this.record[i].imageName.split(',');
            this.filter_array(this.record[i].arr);
            if(this.record[i].arr.length === 0){
              this.record[i].aaa = '';
              this.record[i].bbb = '';
              this.record[i].ccc = '';
            }
            if(this.record[i].arr.length === 1){
              this.record[i].aaa = this.record[i].arr[0];
              this.record[i].bbb = '';
              this.record[i].ccc = '';
            }
            if(this.record[i].arr.length === 2){
              this.record[i].aaa = this.record[i].arr[0];
              this.record[i].bbb = this.record[i].arr[1];
              this.record[i].ccc = '';
            }
            if(this.record[i].arr.length === 3){
              this.record[i].aaa = this.record[i].arr[0];
              this.record[i].bbb = this.record[i].arr[1];
              this.record[i].ccc = this.record[i].arr[2];
            }
          }
        }
        /*if(this.record.imageName){
         this.imageName = this.record.imageName.split(',');
         if(this.imageName&&this.imageName.length===0){
         this.activity1 = this.imageName[0];
         }else if(this.imageName&&this.imageName.length===1){
         this.activity1 = this.imageName[0];
         this.activity2 = this.imageName[1];
         }else if(this.imageName&&this.imageName.length===2){
         this.activity1 = this.imageName[0];
         this.activity2 = this.imageName[1];
         this.activity3 = this.imageName[2];
         }
         }*/
      }
    });
  }
  private filter_array(array) {
    for(let i = 0 ;i<array.length;i++) {
      if(array[i] == "" || typeof(array[i]) == "undefined") {
        array.splice(i,1);
        i= i-1;
      }
    }
    return array;
  }
  /*获取部门列表*/
  getRepairDept(){
    let url = '/party/report/getDeptList';
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.repairDept = data.data;
      }
    });
  };
  changeAttr(){
    this.search.subType = '';
    this.search.branchName = '';
    this.search.BTime = '';
    this.search.ETime = '';
  }
  public downDeriving(){
    let parms = 'branchName';
    if(this.search.type === '1'){
      parms += 'branchAttach,subType,host,recorder,beginTime,endTime,address,shouldNum,factNum,absentNum,reason,theme,createUserName,' +
        'createTime,';
    }else if(this.search.type === '2'){
      parms += ',branchAttach,month,typicalMethod,dynamicMessage,createUserName,createTime';
    }else if(this.search.type === '3'){
      parms += ',branchAttach,subType,month,shouldNum,factNum,createUserName,createTime';
    }else if(this.search.type === '4'){
      parms += ',branchAttach,theme,subType,month,createUserName,createTime';
    }else if(this.search.type === '5'){
      parms += ',branchAttach,month,host,theme,createUserName,createTime';
    }else if(this.search.type === '6'){
      parms += ',branchAttach,subType,month,createUserName,createTime';
    }else if(this.search.type === '7'){
      parms += ',branchAttach,month,pioneerNum,dutyNum,commandoNum,frequency,createUserName,createTime';
    }else if(this.search.type === '8'){
      confirmFunc.init({
        'title': '提示' ,
        'mes': '支部特色不支持导出功能！',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }else if(this.search.type === '9'){
      parms += ',branchAttach,theme';
    }
    else if(this.search.type === '9'){
      parms += ',theme,createUserName,createTime';
    }
    let url = this.ipSetting.ip + "/party/report/getListExcel?parms="+parms+"&type="+ this.search.type+"&subType="+this.search.subType+
    "&branchName="+this.search.branchName+"&BTime="+this.search.BTime+"&ETime="+this.search.ETime;
    this.http.get(url)
    // .map(res => res.json())
      .subscribe(data => {
        this.getDataList(1);
        window.location.href = url;
        $('#deriving').fadeOut();
      });
  }
  changeDate(){
    if(this.countType ==='1'){
      $("#date1").show();
      $("#date2").hide();
      $("#date3").hide();
    }
    if(this.countType ==='2'){
      $("#date2").show();
      $("#date1").hide();
      $("#date3").hide();
    }
    if(this.countType ==='3'){
      $("#date3").show();
      $("#date1").hide();
      $("#date2").hide();
    }
    this.pageNo = 1;
  }
}


export class Report {
  id: number; // 本条信息ID
  BTime:string;
  ETime:string;
  branchName:string; // 支部名称
  type:string; // 会议类型(三会一课同级)
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
  typicalMethod:string; // 典型做法篇数
  dynamicMessage:number; // 动态情况简讯篇数
  pioneerNum:string; // 先锋岗数量
  dutyNum:string; // 责任区数量
  commandoNum:string; // 突击队数量
  frequency:string; // 开展频次

}
