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
  public search: LaundryOrder;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public orders:Array<LaundryOrder>;
  constructor(public ipSetting: IpSettingService,private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.search = new LaundryOrder();
    this.search.status = '';
    this.pages = [];
    this.getOrderList(1);
  }
  /*查询|获取我的订单*/
  public getOrderList(i){
    this.pageNo = i;
    let url = '/mmall/laundryOrder/getOrderList/'+this.pageNo+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;
        this.total = data.data.total;
      }
    });
  }

}
export class LaundryOrder {
  id:number;
  serviceCenter:string;
  createTime:string;
  payTime:string;
  payment:string;
  orderNo:string;
  status:string;
  orderItems:any;
}
