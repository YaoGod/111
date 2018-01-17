import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import * as $ from 'jquery';
import {GoodsOrder, GoodsOrderItem} from "../goodsorder/goodsorder.component";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {WorkspaceMydeskService} from "../../../../service/workspace-mydesk/workspace-mydesk.service";

declare var confirmFunc: any;
declare var tinymce: any;
@Component({
  selector: 'app-goodsnotice',
  templateUrl: './goodsnotice.component.html',
  styleUrls: ['./goodsnotice.component.css'],
  providers: [ErrorResponseService,WorkspaceMydeskService]
})
export class GoodsnoticeComponent implements OnInit {
  public rule;
  public catas;
  public imgPrefix: string;
  public search;
  public pageNo = 1;
  public pageSize = 10;
  public total = 0;
  public all :boolean;
  public orders:Array<GoodsOrder>;
  public deptId:string;
  private delId: any;
  public updateOrder={
    orderNo:'',
    status:0,
    note:''
  };
  public serviceCenters: Array <any> = [];
  public orderItems:Array<GoodsOrderItem>;
  constructor(
    private ipSetting  : IpSettingService,
    private errorVoid: ErrorResponseService,
    private globalCatalogService: GlobalCatalogService,
    private workspaceMydeskService: WorkspaceMydeskService) { }

  ngOnInit() {
    this.getRule();
    this.getServiceCenter();
    this.search = {};
    this.search.orderNo = "";
    this.search.status = '';
    this.search.paymentType = '';
    this.search.serviceCenter = "";
    this.search.userName = "";
    this.search.deptName = "";
    this.search.paymentType = "";
    this.search.createBtime = "";
    this.search.createEtime = "";
    this.search.sendBtime = "";
    this.search.sendEtime = "";
    this.imgPrefix = this.ipSetting.ip;
    this.getOrderAllList(1);
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'market','employ/market/reserve')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;
          for(let i = 0;i<this.catas.length;i++){
            if(this.catas[i].routeUrl === "employ/market/reserve/goodsnotice"){
              this.rule = this.catas[i];
            }
          }
        }
      })
  }
  /*获取订单列表*/
  getOrderAllList(pageNo){
    this.pageNo = pageNo;
    if(this.search.status!=null){
      this.search.status = this.search.status.trim();
    }
    if(this.search.orderNo!=null){
      this.search.orderNo = this.search.orderNo.trim();
    }
    if(this.search.serviceCenter!=null){
      this.search.serviceCenter = this.search.serviceCenter.trim();
    }

    let url = '/goodsOrder/search/list/' + this.pageNo+'/'+this.pageSize+
      '?serviceCenter=' + this.search.serviceCenter +
      '&orderNo=' + this.search.orderNo +
      '&status=' + this.search.status +
      '&userName='+ this.search.userName +
      '&deptName=' +this.search.deptName+
      '&paymentType='+ this.search.paymentType +
      '&createBtime=' +this.search.createBtime.replace(/-/g,'/') +
      '&createEtime='+ this.search.createEtime.replace(/-/g,'/') +
      '&sendBtime=' +this.search.sendBtime.replace(/-/g,'/') +
      '&sendEtime='+ this.search.sendEtime.replace(/-/g,'/');
    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.orders = data.data.list;
          this.total = data.data.total;
        }
      });
  }
  export(){
    if(this.search.status!=null){
      this.search.status = this.search.status.trim();
    }
    if(this.search.orderNo!=null){
      this.search.orderNo = this.search.orderNo.trim();
    }
    if(this.search.serviceCenter!=null){
      this.search.serviceCenter = this.search.serviceCenter.trim();
    }

    let url = this.ipSetting.ip+'/goodsOrder/search/excel/' + this.pageNo+'/'+this.pageSize+
      '?serviceCenter=' + this.search.serviceCenter +
      '&orderNo=' + this.search.orderNo +
      '&status=' + this.search.status +
      '&userName='+ this.search.userName +
      '&deptName=' +this.search.deptName +
      '&paymentType='+ this.search.paymentType +
      '&createBtime=' +this.search.createBtime.replace(/-/g,'/') +
      '&createEtime='+ this.search.createEtime.replace(/-/g,'/') +
      '&sendBtime=' +this.search.sendBtime.replace(/-/g,'/') +
      '&sendEtime='+ this.search.sendEtime.replace(/-/g,'/');
    confirmFunc.init({
      'title': '提示',
      'mes': '是否导出数据',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        window.open(url);
      }
    });
  }
  /*全选*/
  checkedAll(){
    let list = document.getElementsByName("orderCheck");
    for(let i = 0;i<list.length;i++){
      list[i]['checked'] = this.all;
    }
  }
  /*判断是否全选*/
  checkIsAll(){
    let list = document.getElementsByName("orderCheck");
    for(let i = 0;i<list.length;i++){
      if(!list[i]['checked']){
        this.all = false;
      }
    }
  }
  /*获取服务中心列表*/
  getServiceCenter(){
    this.workspaceMydeskService.getServiceCenter()
      .subscribe((data)=>{
        if(this.errorVoid.errorMsg(data)){
          this.serviceCenters = data.data;
        }
      });
  }
}

