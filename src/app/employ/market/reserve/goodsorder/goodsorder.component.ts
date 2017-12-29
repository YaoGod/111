import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";

@Component({
  selector: 'app-goodsorder',
  templateUrl: './goodsorder.component.html',
  styleUrls: ['./goodsorder.component.css'],
  providers: [ErrorResponseService]
})
export class GoodsorderComponent implements OnInit {
  public ipServer: String;
  public search: GoodsOrder;
  private pageNo = 1;
  /*当前页码*/
  private pageSize = 10;
  public orders:Array<GoodsOrder>;
  public goodsOrderItems:Array<GoodsOrderItem>;
  public myOrder:GoodsOrder;
  constructor(private ipSetting: IpSettingService,
              private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.ipServer = this.ipSetting.ip;
    this.getOrderList();
  }

  /**
   * 我的订单列表
   */
  getOrderList(){
    let url = '/goodsOrder/list?userId=' + localStorage.getItem("username")
      + '&pageNum='+ this.pageNo + '&pageSize=' +this.pageSize;
    this.ipSetting.sendGet(url)
      .subscribe(data =>
      {
        if (this.errorVoid.errorMsg(data.status)) {
        this.orders = data.data.list;
        console.log(this.orders);

        }
     });
  }

  /**
   * 获取订单详情
   * @param order
   * @returns
   */
  getOrderDetail(orderId){
    let url = '/goodsOrder/detail?' + 'userId=' + localStorage.getItem("username")
      + '&orderNo=' + orderId;
    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if(data['status'] === 0){
          alert(data['msg']);
          this.getOrderList();
        }else{
          alert(data['msg']);
        }
      });
  }



  /**
   * 更新订单
   * @param orderId,status
   * @returns
   */
  updateOrders(orderId,status){
    let url = '/goodsOrder/setStatus?' + 'userId=' + localStorage.getItem("username")
      + '&orderNo=' + orderId + '&status=' +status;
    this.ipSetting.sendGet(url)
     .subscribe(data => {
      if(data['status'] === 0){
        alert(data['msg']);
        this.getOrderList();
      }else{
        alert(data['msg']);
      }
    });

  }
}

export class GoodsOrder {
  id:number;/*订单id*/
  userId:string;/*用户id*/
  payment:number;/*订单金额*/
  status:string;/*订单状态*/
  payTime:string;/*付款时间*/
  closeTime:string;/*订单关闭时间*/
  note:string;
  goodsOrderItems:Array<GoodsOrderItem>;
  serviceCenter:string;

}

export class GoodsOrderItem {
  id:               string;/*订单详情编号*/
  userId:           string;/*用户ID*/
  productCode:     string;/*商品id*/
  orderNo:         number;/*订单id*/
  productName:      string;/*商品名称*/
  imagePath:         string;/*商品图片*/
  detail:            string;/*商品详情*/
  unitPrice:         number;/*商品单价*/
  quantity:          number;/*该商品购买数量*/
  totalPrice:        string;/*总价*/

}
