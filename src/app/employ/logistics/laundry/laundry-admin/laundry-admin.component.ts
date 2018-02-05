import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
declare var $: any;
declare var confirmFunc: any;
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {IpSettingService} from "app/service/ip-setting/ip-setting.service";

@Component({
  selector: 'app-laundry-admin',
  templateUrl: './laundry-admin.component.html',
  styleUrls: ['./laundry-admin.component.css'],
  providers: [ErrorResponseService]
})
export class LaundryAdminComponent implements OnInit {
  public search: LaundryOrder;
  public applierList:Array<Facilitator>;
  public serverCenters:Array<ServerCenter>;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public myOrder:LaundryOrder;
  public inner:OrderInfo;
  public orders:Array<LaundryOrder>;
  public orderItem:LaundryOrderItem;
  public project: Project;
  public sum: Project;
  private offline:Offline;
  public abc:any;
  private orderId:string;
  public list: Array<any>;
  public formData: Array<any>;
  public title: String = "洗衣服务订单";
  constructor(public ipSetting: IpSettingService,private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.search = new LaundryOrder();
    this.search.serviceCenter = '';
    this.myOrder = new LaundryOrder();
    this.inner = new OrderInfo();
    this.project = new Project();
    this.sum = new Project();
    this.offline = new Offline();
    this.pages = [];
    this.list=[];
    this.list[0]={
      key:'',
      value:''
    };
    this.list[1]={
      key:'',
      value:''
    };
    this.getOrderAllList(1);
    this.initFac();
  }
  /*查询*/
  getOrderAllList(i){
    this.pageNo = i;
    let url = '/mmall/laundryOrder/getOrderAllList/'+this.pageNo+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;
        // console.log(this.orders);
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
      }
    });
  }
  /*编辑*/
  addOrderItems(index){
    this.orderId = index;
    let linshi = {
      orderNo:index
    };
    // this.search.orderNo = linshi;
    let url = '/mmall/laundryOrder/getOrderAllList/'+this.pageNo+'/'+this.pageSize;
    this.ipSetting.sendPost(url,linshi).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        if(data.data.infos[0] === undefined){
          this.abc = {
            balance:'',
          }
        }else{
          this.abc = data.data.infos[0];
        }
      }
    });
    $('.mask0').fadeIn();
  }
  /*增加扣款项目*/
  updateNew(){
    let url = '/mmall/laundryOrder/updateOrder';
    this.abc.balance = Number(this.list[0].value)+Number(this.list[1].value);
    this.abc.balanceReason = this.list;

    this.ipSetting.sendPost(url,this.abc).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': data['msg'],
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.search.orderNo = '';
        this.getOrderAllList(1);
        this.closeMask0();
      }
    });
  }
  /*确认扣款*/
  maskFadeIn(orderStatus,orderNo){
    this.inner.id = orderNo;
    this.inner.status = '4';
    // console.log(orderStatus+'///'+orderNo);
    for(let i=0;i<this.orders.length;i++){
      if(orderNo===this.orders[i].id) {
          this.inner.note = this.orders[i].note;
      }
    }
    $('.mask').fadeIn();
  }
  /*退单*/
  chargeBack(orderStatus,orderNo){
    this.inner.id = orderNo;
    this.inner.status = orderStatus;
    // console.log(orderStatus+'///'+orderNo);
    for(let i=0;i<this.orders.length;i++){
      if(orderNo===this.orders[i].id) {
        this.inner.note = this.orders[i].note;
      }
    }
    $('.mask').fadeIn();
  }
  /*线下确认收货*/
  mask0FadeIn(id){
    confirmFunc.init({
      'title': '提示' ,
      'mes': '确认完成线下付款并收货？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        this.offline.id = id;
        this.offline.status = '4';
        let url = '/mmall/laundryOrder/updateOrder';
        this.ipSetting.sendPost(url,this.offline).subscribe(data => {
          if(this.errorVoid.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示' ,
              'mes': data['msg'],
              'popType': 0 ,
              'imgType': 1 ,
            });
            this.pages =[];
            this.getOrderAllList(1);
          }
        });
      }
    });

  }
  public verifyorderstatus(){
    if (!this.isEmpty('orderstatus', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifynote(){
    if (!this.isEmpty('note', '不能为空')) {
      return false;
    }
    return true;
  }
  /*确认收货保存*/
  updateOrders(){
    let SOFTWARES_URL = '/mmall/laundryOrder/updateOrder';
    if (!this.verifyorderstatus()) {
      return false;
    }
    if(this.inner.status==='2' && !this.verifynote()){
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请填写退单描述',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }
    this.ipSetting.sendPost(SOFTWARES_URL,this.inner).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': data['msg'],
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.search.orderNo = '';
        this.getOrderAllList(1);
        this.closeMask();
      }
    });
  }
  /*关闭编辑*/
  closeMask(){
    this.inner = new OrderInfo();
    $('.mask').fadeOut();
  }
  /*关闭编辑扣款项目*/
  closeMask0(){
    this.list= [];
    this.list[0]={
      key:'',
      value:''
    };
    this.list[1]={
      key:'',
      value:''
    };
    $('.mask0').fadeOut();
  }
  /*x虚拟收货*/
  ting(status,index){
    confirmFunc.init({
      'title': '提示' ,
      'mes': '确认完成订单？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        this.inner.status = status;
        this.inner.id = index;
        let SOFTWARES_URL = "/mmall/laundryOrder/updateOrder";
        this.ipSetting.sendPost(SOFTWARES_URL,this.inner).subscribe(data => {
          if(this.errorVoid.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示' ,
              'mes': data['msg'],
              'popType': 0 ,
              'imgType': 1 ,
            });
            this.pages =[];
            this.getOrderAllList(1);
            this.inner = new OrderInfo();
          }
        });
      }
    });
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
      case '0':this.formData[1].data[0] = "订购中"; break;
      case '1':this.formData[1].data[0] = "已完成"; break;
      case '2':this.formData[1].data[0] = "退单"; break;
      case '4':this.formData[1].data[0] = "已收货"; break;
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

  /**非空校验*/
  public isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if(data === null){
      this.addErrorClass(id, error);
      return false;
    }else{
      if (data.toString().trim() === '')  {
        this.addErrorClass(id, error);
        return false;
      }else {
        this.removeErrorClass(id);
        return true;
      }
    }
  }
  /**添加错误信息class*/
  public  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /**去除错误信息class*/
  public  removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').children('.errorMessage').html('');
  }
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
  status:string;
  note:string;
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
export class OrderInfo {
  id:number;
  orderNo:string;
  status:string;
  note:string;
  list:any;
}
export class Project {
  project:string;
  sum:string;
}
export class Offline{
  id:string;
  status:string;
}
