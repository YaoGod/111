import { Component, OnInit } from '@angular/core';
declare var confirmFunc:any;
import * as $ from 'jquery';
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {Http} from "@angular/http";


@Component({
  selector: 'app-vegetable-count',
  templateUrl: './vegetable-count.component.html',
  styleUrls: ['./vegetable-count.component.css'],
  providers: [ErrorResponseService]
})
export class VegetableCountComponent implements OnInit {
  public search: LaundryOrder;
  public serverCenters:Array<ServerCenter>;
  public vegetables:any;
  public orders:any;
  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  constructor(private http: Http,
              private ipSetting: IpSettingService,
              private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.search = new LaundryOrder();
    this.search.productName = '';
    this.search.serviceCenter = '';
    this.search.BTime = "";
    this.search.ETime = "";
    this.search.status = "";
    this.vegetables = [];
    this.getOrderAllList(1);
    this.initFac();
  }
  /*查询*/
  getOrderAllList(pageNo){
    this.pageNo = pageNo;
    let url = '/mmall/vegetabelOrder/getOrderReport/'+this.pageNo+'/'+this.pageSize+
      '?serviceCenter='+this.search.serviceCenter+
      '&productName=' +this.search.productName +
      "&BTime=" + this.search.BTime+
      "&ETime=" + this.search.ETime+
      "&orderStatus=" + this.search.status;
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  /*查询净菜名称*/
  getVegetables(){
    let nnt = $('#productName').val().trim();
    let url = '/mmall/vegetableInfo/getVegetableByName?name='+nnt;
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.vegetables = data.data;
      }
    });
  }
  /*同步名称*/
  synchro(name){
    this.search.productName = name;
    this.vegetables = [];
  }
  /*获取服务中心*/
  initFac(){
    let url = '/mmall/laundry/provider/initFac';
    this.ipSetting.sendPost(url,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.serverCenters = data.data.centers;
      }
    });
  }
  export(){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否导出数据?',
      'popType': 1,
      'imgType': 3,
      'callback': ()=>{
        let url = this.ipSetting.ip + "/mmall/vegetabelOrder/getOrderExcel"+
          "?serviceCenter=" +this.search.serviceCenter+
          "&productName=" +this.search.productName +
          "&BTime=" + this.search.BTime+
          "&ETime=" + this.search.ETime+
          "&orderStatus=" + this.search.status;
        window.location.href = url;
      }
    });
  }

}
export class LaundryOrder {
  id:number;
  productName:string;
  num:number;
  price:string;
  totalPrice:string;
  orderNo:string;
  status:string;
  serviceCenter:string;
  BTime:string;
  ETime:string;
}
export class ServerCenter{
  name: string;
  id:number;
}
