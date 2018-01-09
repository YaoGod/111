import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
declare var $: any;
declare var confirmFunc: any;
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {IpSettingService} from "app/service/ip-setting/ip-setting.service";

@Component({
  selector: 'app-laundry-order',
  templateUrl: './laundry-order.component.html',
  styleUrls: ['./laundry-order.component.css'],
  providers: [ErrorResponseService]
})
export class LaundryOrderComponent implements OnInit {
  public products:Array<FacPrice>;
  public search: LaundryOrder;
  public applierList:Array<Facilitator>;
  public serverCenters:Array<ServerCenter>;
  public days:string;
  private code: any;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public myOrder:LaundryOrder;
  public orders:Array<LaundryOrder>;
  constructor(private ipSetting: IpSettingService,private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.search = new LaundryOrder();
    this.search.serviceCenter = '';
    this.myOrder = new LaundryOrder();
    this.pages = [];
    this.getOrderList();
    this.initFac();
  }
  getOrderList(){
    let url = '/mmall/laundryOrder/getOrderList/0';
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;
        // this.myOrder.id = data.data.orderId;
        this.total = data.data.total;
      }
    });
  }
  /*查询*/
  getOrderAllList(){
    let url = '/mmall/laundryOrder/getOrderAllList/'+this.pageNo+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;
        console.log(data.data);
        this.total = data.data.total;
      }
    });

  }
  /*获取服务中心*/
  initFac(){
    let url = '/mmall/laundry/provider/initFac';
    this.ipSetting.sendPost(url,this.myOrder).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.applierList = data.data.providers;
        this.serverCenters = data.data.centers;
        // console.log(data.data);
      }
    });
  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    this.getOrderAllList();
  }
}
export class FacPrice {
  priceId;    number;
  applyid:          string;
  appcotent:        string;
  unit:              string;
  price:             number;
  appliar:           string;
}
export class Facilitator {
  applyId:          string;/*经销商id*/
  applyName:        string;/*经销商名称*/
  copStarttime:     string;/*合作开始时间*/
  copEndtime:       string;/*合作结束时间*/
  applyDesc:        string;/*描述*/
}
export class LaundryOrder {
  id:number;
  orderNo:string;
  serviceCenter:           string;
  orderItems: Array<LaundryOrderItem>;
}
export class  LaundryOrderItem{
  id:number;
  orderId:  number;
  appcontent:   string;
  unitPrice:  number;
  quantity:   number;
  totalPrice:  number;
  applyid: string;
  unit: number;
}
export class ServerCenter{
  name: string;
  id:number;
}
