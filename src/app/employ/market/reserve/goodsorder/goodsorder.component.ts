import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";

declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-goodsorder',
  templateUrl: './goodsorder.component.html',
  styleUrls: ['./goodsorder.component.css'],
  providers: [ErrorResponseService]
})
export class GoodsorderComponent implements OnInit {
  public ipServer: String;
  public search: GoodsOrder;
  public pageSize = 6;
  public pageNo = 1;
  public total = 0;
  public pages: Array<number>;
  public orderId = '';
  public orders:Array<GoodsOrder>;
  public goodsOrderItems:Array<GoodsOrderItem>;
  public myOrder:GoodsOrder;
  constructor(private ipSetting: IpSettingService,
              private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.ipServer = this.ipSetting.ip;
    this.getOrderList(1);
  }

  /**我的订单列表*/
  getOrderList(i){
    this.pageNo = i;
    if(this.orderId!=null){
      this.orderId = this.orderId.trim();
    }
    let dataSearch = {
      orderNo:this.orderId
    };
    let url = '/goodsOrder/list?userId=' + localStorage.getItem("username")
      + '&pageNum='+ this.pageNo + '&pageSize=' +this.pageSize;
    this.ipSetting.sendPost(url,dataSearch).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.list;
        this.total = data.data.total;
      }
   });
  }

  /**获取订单详情 **/
  getOrderDetail(orderId){
    let url = '/goodsOrder/detail?' + 'userId=' + localStorage.getItem("username")
      + '&orderNo=' + orderId;
    this.ipSetting.sendGet(url).subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data.msg,
            'popType': 0,
            'imgType': 1,
          });
          this.getOrderList(1);
        }
      });
  }



  /**
   * 更新订单
   * @param orderId,status
   * @returns
   */
  updateOrders(orderId,status){
    let url = '/goodsOrder/updateOrderStatus?' + 'userId=' + localStorage.getItem("username")
      + '&orderNo=' + orderId + '&status=' +status;
    this.ipSetting.sendGet(url).subscribe(data => {
       if (this.errorVoid.errorMsg(data)) {
         confirmFunc.init({
           'title': '提示',
           'mes': data.msg,
           'popType': 0,
           'imgType': 1,
         });
        this.getOrderList(1);
      }
    });
  }
}

export class GoodsOrder {
  id:string;
  orderNo:string;/*订单号*/
  userId:string;/*用户id*/
  payment:number;/*订单金额*/
  status:number;/*订单状态*/
  createTime:string;/*付款时间*/
  closeTime:string;/*订单关闭时间*/
  sendTime: string;/*发货时间*/
  note:string;
  orderItemVoList:Array<GoodsOrderItem>;
  serviceCenter:string;
  paymentTypeDesc:string; /*付款方式*/
  statusDesc:string;/*订单中文状态*/
  userName:string;
  telPhone:string;
  payTime:string;
}

export class GoodsOrderItem {
  productId:               string;/*订单详情编号*/
  userId:           string;/*用户ID*/
  productCode:     string;/*商品id*/
  orderNo:         number;/*订单id*/
  productName:      string;/*商品名称*/
  productImage:         string;/*商品图片*/
  imgPath:         string;/*商品图片*/
  detail:            string;/*商品详情*/
  currentUnitPrice:         number;/*商品单价*/
  quantity:          number;/*该商品购买数量*/
  totalPrice:        string;/*总价*/

}
