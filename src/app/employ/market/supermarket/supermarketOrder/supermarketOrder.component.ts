import { Component, OnInit } from '@angular/core';
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SupermarketOrder} from "../../../../mode/supermarketOrder/supermarket-order.service";
import * as $ from 'jquery';
import {WorkspaceMydeskService} from "../../../../service/workspace-mydesk/workspace-mydesk.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
declare var confirmFunc:any;
@Component({
  selector: 'app-suporder',
  templateUrl: './supermarketOrder.component.html',
  styleUrls: ['./supermarketOrder.component.css'],
  providers: [
    SupermarketManagerService,
    SupermarketManagerService,
    WorkspaceMydeskService,
    ErrorResponseService]

})
export class SupermarketOrderComponent implements OnInit {

  public pageNo   : number = 1;
  public pageSize : number = 5;
  public total    : number = 0;
  public serviceCenters: Array<any>;
  public orders:Array<SupermarketOrder>;
  private delId: any;
  public pages: Array<number>;
  public updateOrder={
    id:'',
    status:'',
    note:''
  };
  public search : any = {};
  public formData: Array<any>;
  public title: string = "超市零售区订单";

  constructor(
    private supermarketManagerService: SupermarketManagerService,
    private workspaceMydeskService: WorkspaceMydeskService,
    private errorVoid: ErrorResponseService,
    public ipSetting: IpSettingService) { }

  ngOnInit() {
    this.search.serverCenter = "";
    this.getOrderAllList(1);
    this.getServiceCenter();
  }
  /*获取订单列表*/
  getOrderAllList(pageNo){
    this.pageNo = pageNo;
    this.supermarketManagerService.getOrderAllList('list',[],this.search,this.pageNo,this.pageSize)
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;
        this.total = data.data.total;
      }
    });
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

  update(orderId,status){
    this.updateOrder.id = orderId;
    this.updateOrder.status = status;
    if(this.updateOrder.status==="4"){
      this.updateOrders();
    }else{
      confirmFunc.init({
        'title': '提示',
        'mes': '是否确定退单',
        'popType': 1,
        'imgType': 3,
        'callback': ()=>{
          $('.mask').show();
        }
      });

    }
  }

  updateOrders(){
    this.supermarketManagerService.updateOrder(this.updateOrder) .subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        confirmFunc.init({
          'title': '提示',
          'mes': data.msg,
          'popType': 0,
          'imgType': 1,
        });
        this.closeMask();
        this.getOrderAllList(1);
      }
    });

  }
  /*删除*/
  delete(id) {
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除此条数据？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        this.supermarketManagerService.deleteOrder(id)
          .subscribe(data => {
            if (this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': '删除成功',
                'popType': 0,
                'imgType': 1
              });
              this.getOrderAllList(1);
            }
          });
      }
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
    this.formData =[
      {
        title:'',
        type: 'bold',
        hd:['系统订单号',"订单创建时间"],
        data: [data.orderNo,data.createTime]
      },
      {
        title:"",
        type:"text",
        hd:["订单状态","服务中心"],
        data:["",data.serviceCenter]
      },
      {
        title:"收货人信息",
        type:"text",
        hd:["收货人姓名","收货人电话","付款时间"],
        data:[data.userName,data.telPhone,data.payTime]
      },
      {
        title:"商品明细",
        type:"form",
        hd:["商品名称","单价(元)","数量","合计（元）"],
        data:[],
        total:"总计：￥"+data.payment.toFixed(2)
      }
    ];
    switch(data.status){
      case '0':this.formData[1].data[0] = "已付款"; break;
      case '1':this.formData[1].data[0] = "已到货"; break;
      case '2':this.formData[1].data[0] = "退单"; break;
      case '4':this.formData[1].data[0] = "已配货"; break;
      default:
        this.formData[1].data[0] = "暂无订单状态信息";
    }
    for(let i = 0;i<data.orderItems.length;i++){
      this.formData[3].data[i]=[
        data.orderItems[i].productName,
        '￥'+data.orderItems[i].unitPrice.toFixed(2),
        data.orderItems[i].quantity,
        '￥'+data.orderItems[i].totalPrice.toFixed(2)
      ];
    }
  }
}
