import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import * as $ from 'jquery';
import {GoodsOrder, GoodsOrderItem} from "../goodsorder/goodsorder.component";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-goodsordermanage',
  templateUrl: './goodsordermanage.component.html',
  styleUrls: ['./goodsordermanage.component.css'],
  providers: [ErrorResponseService]
})
export class GoodsordermanageComponent implements OnInit {
  public rule;
  public catas;
  public imgPrefix: string;
  public search: GoodsOrder;
  public pageNo = 1;
  public pageSize = 6;
  public total = 0;
  public orders:Array<GoodsOrder>;
  public productName = '';
  public orderId = '';
  public vegetableId = '';
  public deptId:string;
  private delId: any;
  public pages: Array<number>;
  public updateOrder={
    orderNo:'',
    status:0,
    note:''
  }
  public orderItems:Array<GoodsOrderItem>;
  public formData: Array<any>;
  public title: string = "商品预定区订单";
  constructor(private ipSetting: IpSettingService,
              private errorVoid: ErrorResponseService,
              private globalCatalogService: GlobalCatalogService) { }

  ngOnInit() {
    this.getRule();
    this.imgPrefix = this.ipSetting.ip;
    this.pages = [];
    this.getOrderAllList();
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'market','employ/market/reserve')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;
          for(let i = 0;i<this.catas.length;i++){
            if(this.catas[i].routeUrl === "employ/market/reserve/goodsordermanage"){
              this.rule = this.catas[i];
            }
          }
        }
      })
  }
  /*获取订单列表*/
  getOrderAllList(){
    if(this.productName!=null){
      this.productName = this.productName.trim();
    }
    if(this.orderId!=null){
      this.orderId = this.orderId.trim();
    }
    if(this.vegetableId!=null){
      this.vegetableId = this.vegetableId.trim();
    }

    let url = '/goodsOrder/list?'
      + 'pageNum='+ this.pageNo + '&pageSize=' +this.pageSize;
    this.ipSetting.sendGet(url)
      .subscribe(data =>
      {
        if (this.errorVoid.errorMsg(data.status)) {
          this.orders = data.data.list;
          this.total =data.data.total;

        }
      });
  }

  update(orderId,status){
    this.updateOrder.orderNo = orderId;
    this.updateOrder.status = status;
    if(this.updateOrder.status === 40){
      this.updateOrders();
    }else{
      $('.mask').show();
    }
  }

  /*更新订单*/
  updateOrders(){
    let url = '/goodsOrder/updateOrderStatus?userId=' + localStorage.getItem("username")
    +'&orderNo=' + this.updateOrder.orderNo +'&status=' + this.updateOrder.status;
    this.ipSetting.sendGet(url)
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        alert(data['msg']);
        this.closeMask();
        this.getOrderAllList();
      }else{
        alert(data['msg']);
        this.closeMask();
      }
    });
  }

  delete(orderid:number){
    this.delId = orderid;
    $('.confirm').fadeIn();
  }

  /*删除*/
  okFunc() {
    $('.confirm').hide();
    let url = '/mmall/vegetabelOrder/deleteVegetableOrder/'+this.delId;
    this.ipSetting.sendPost(url,null)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data.status)) {
          alert("删除成功");
        }
        this.getOrderAllList();
      });
  }

  closeMask() {
    $('.mask').hide();
  }
  noFunc() {
    $('.confirm').fadeOut();
  }
  /*装载要打印的内容*/
  loadFormData(data:any){
    console.log(data);
    this.formData =[
      {
        title:'',
        type: 'bold',
        hd:['系统订单号',"服务中心","订单创建时间"],
        data: [data.orderNo,data.serviceCenter,data.createTime]
      },
      {
        title:"",
        type:"text",
        hd:["订单状态","付款方式","付款时间","发货时间"],
        data:[data.statusDesc,data.paymentTypeDesc,data.payTime,data.sendTime]
      },
      {
        title:"收货人信息",
        type:"text",
        hd:["收货人姓名","收货人电话"],
        data:[data.userName,data.telPhone]
      },
      {
        title:"商品明细",
        type:"form",
        hd:["商品名称","单价(元)","数量","合计（元）"],
        data:[],
        total:"总计：￥"+data.payment.toFixed(2)
      }
    ];
    /*switch(data.status){
      case '0':this.formData[1].data[0] = "已付款"; break;
      case '1':this.formData[1].data[0] = "已到货"; break;
      case '2':this.formData[1].data[0] = "退单"; break;
      case '40':this.formData[1].data[0] = "已配货"; break;
      default:
        this.formData[1].data[0] = "暂无订单状态信息";
    }*/
    for(let i = 0;i<data.orderItemVoList.length;i++){
      this.formData[3].data[i]=[
        data.orderItemVoList[i].productName,
        '￥'+data.orderItemVoList[i].currentUnitPrice.toFixed(2),
        data.orderItemVoList[i].quantity,
        '￥'+data.orderItemVoList[i].totalPrice.toFixed(2)
      ];
    }
  }
}
