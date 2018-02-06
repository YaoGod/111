import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {VegetableOrder} from '../../../../mode/vegetableOrder/vegetable-order.service';
import {VegetableOrderItem} from '../../../../mode/vegetableOrderItem/vegetable-order-item.service'
import { VegetableInfoService } from '../../../../service/vegetable-info/vegetable-info.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import {forEach} from "@angular/router/src/utils/collection";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
declare var confirmFunc: any;

@Component({
  selector: 'app-vegorder',
  templateUrl: './vegorder.component.html',
  styleUrls: ['./vegorder.component.css'],
  providers: [VegetableInfoService,ErrorResponseService]

})
export class VegorderComponent implements OnInit {
  public serverCenters:Array<ServerCenter>;
  public search: VegetableOrder;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public orders:Array<VegetableOrder>;
  public productName:string = '';
  public orderId:string = '';
  public serviceCenter = '';
  public orderBTime = '';
  public orderETime = '';
  public orderStatus = "";
  public deptId:string;
  private delId: any;
  public updateOrder={
    id:'',
    status:'',
    note:''
  };
  public formData: Array<any>;
  public title: string = "净菜订购区订单";

  public orderItems:Array<VegetableOrderItem>;
  constructor(private vegetableInfoService: VegetableInfoService,
              private errorVoid: ErrorResponseService,
              public ipSetting:IpSettingService) { }

  ngOnInit() {
    this.pages = [];
    this.initFac();
    this.getOrderAllList();

  }
  getOrderAllList(){
    if(this.productName!=null){
      this.productName = this.productName.trim();
    }
    if(this.orderId!=null){
      this.orderId = this.orderId.trim();
    }
    if(this.orderStatus!=null){
      this.orderStatus = this.orderStatus.trim();
    }
    if(this.serviceCenter!=null){
      this.serviceCenter = this.serviceCenter.trim();
    }
    if(this.orderETime!=null){
      this.orderETime = this.orderETime.trim();
    }
    if(this.orderBTime!=null){
      this.orderBTime = this.orderBTime.trim();
    }
    this.vegetableInfoService.getOrderAllList(this.productName,this.orderId,this.orderStatus,
      this.serviceCenter,this.orderBTime,this.orderETime,this.pageNo,this.pageSize).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;
        this.total = data.data.total;
      }
    });
  }

  public batchCook(){
    if (this.orderETime === ''){
      confirmFunc.init({
        'title': '提示' ,
        'mes': '订单截止时间不能为空！',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return;
    }
    $('.batch').show();
  }

  public confirmBatch(){
    let url = '/mmall/vegetabelOrder/batch?serviceCenter='+this.serviceCenter+'&orderBTime='+this.orderBTime+'&orderETime='+this.orderETime;
    let cont = {
      serviceCenter :this.serviceCenter,
      orderBTime :this.orderBTime,
      orderETime :this.orderETime
    };
    this.ipSetting.sendPost(url,cont).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': data['msg'],
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.closeBatch();
        this.serviceCenter = '';
        this.orderBTime = '';
        this.orderETime = '';
        this.getOrderAllList();
      }
    });


  }
  update(orderId,status){
    this.updateOrder.id = orderId;
    this.updateOrder.status = status;
    if(this.updateOrder.status=="4"){
       this.updateOrders();
    }else{
      $('.mask').show();
    }
  }

  updateOrders(){
    if(this.updateOrder.status=="2"){
      if(!this.isEmpty('notice','说明不能为空')){
        return false;
      }
    }

    this.vegetableInfoService.updateOrder(this.updateOrder) .subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': data['msg'],
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.closeMask();
        this.getOrderAllList();
      }
    });
  }
  /*删除*/
  delete(orderid:number){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除？',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        this.vegetableInfoService.deleteOrder(orderid)
          .subscribe(data => {
            if (this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data['msg'],
                'popType': 0,
                'imgType': 1,
              });
            }
            this.getOrderAllList();
          });
      }
    });
  }
  /*订单数据导出*/
  exportOrderAllList(){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否导出数据？',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        let url = this.ipSetting.ip + '/mmall/vegetabelOrder/getOrderAllList/'+this.pageNo+'/'+this.pageSize
          +"?productName="+this.productName+"&orderId="+this.orderId+"&serviceCenter="+this.serviceCenter
          +"&orderBTime="+this.orderBTime+"&orderStatus="+this.orderStatus+"&orderETime="+this.orderETime+"&type=excel";
        window.open(url);
      }
    });
  }
  /*获取服务中心*/
  initFac(){
    let url = '/mmall/laundry/provider/initFac';
    this.ipSetting.sendPost(url,null).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.serverCenters = data.data.centers;
      }
    });
  }

  closeMask() {
    $('.mask').hide();
  }

  public closeBatch(){
    $('.batch').hide();
  }

  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    this.getOrderAllList();
  }
  /*装载要打印的内容*/
  loadFormData(data:any){
    this.formData =[
      {
        title:'',
        type: 'bold',
        hd:['系统订单号',"订单创建时间"],
        data: [data.id,data.createTime]
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
    for(let i = 0;i<data.vegetableOrderItems.length;i++){
      this.formData[3].data[i]=[
        data.vegetableOrderItems[i].productName,
        '￥'+data.vegetableOrderItems[i].unitPrice.toFixed(2),
        data.vegetableOrderItems[i].quantity,
        '￥'+data.vegetableOrderItems[i].totalPrice.toFixed(2)
      ];
    }
  }


  /**非空校验*/
  public isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (data==null||data==''||data.trim() === '')  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }

  /**
   * 匹配数字
   * @param id
   * @param error
   * @returns {boolean}
   */
  private verifyIsNumber(id: string, error: string): boolean  {
    const data =  $('#' + id).val();// /^[0-9]*$/
    if (!String(data).match(/^[1-9]\d(\.\d+){0,2}$/))  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /**
   * 添加错误信息class
   * @param id
   * @param error
   */
  private  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /**
   * 去除错误信息class
   * @param id
   */
  private  removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').removeClass('form-error');
    $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
    $('#' + id).next('span').html('');
  }

}
export class ServerCenter{
  name: string;
  id:number;
}
