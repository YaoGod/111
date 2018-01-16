import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
declare var $: any;
declare var confirmFunc: any;
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {IpSettingService} from "app/service/ip-setting/ip-setting.service";
@Component({
  selector: 'app-plan-laundry-report',
  templateUrl: './plan-laundry-report.component.html',
  styleUrls: ['./plan-laundry-report.component.css'],
  providers: [ErrorResponseService]
})
export class PlanLaundryReportComponent implements OnInit {
  public orders:Array<LaundryOrder>;
  public serverCenters:Array<ServerCenter>;
  public myOrder:LaundryOrder;
  public search: OrderExcel;
  public serverCenter='';
  public orderNo='';
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  constructor(private ipSetting: IpSettingService,private errorVoid: ErrorResponseService) { }


  ngOnInit() {
    this.search = new OrderExcel();
    this.myOrder = new LaundryOrder();
    this.search.serviceCenter = '';
    this.pages = [];
    this.initFac();
    this.getOrderAllList();
  }
  /*获取订单*/
  getOrderAllList(){
    let url = '/mmall/laundryOrder/getOrderAllList/'+this.pageNo+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;
        this.total = data.data.total;
      }
    });

  }
  /*获取服务中心*/
  initFac(){
    let url = '/mmall/laundry/provider/initFac';
    this.ipSetting.sendPost(url,this.myOrder).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.serverCenters = data.data.centers;
      }
    });
  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    this.getOrderAllList();
  }

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
export class OrderExcel {
  id:number;
  orderNo:string;
  serviceCenter:string;
  status: string;
  userId: string;
  deptName:string;
  startTime:string;
  finshTime:string;
}
