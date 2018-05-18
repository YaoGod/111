import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
declare var $: any;
declare var confirmFunc: any;
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {IpSettingService} from "app/service/ip-setting/ip-setting.service";
import {Http} from "@angular/http";
import {SaleProductEmployeeService} from "../../../../service/sale-product-employee/sale-product-employee.service";
@Component({
  selector: 'app-plan-laundry-report',
  templateUrl: './plan-laundry-report.component.html',
  styleUrls: ['./plan-laundry-report.component.css'],
  providers: [ErrorResponseService,SaleProductEmployeeService]
})
export class PlanLaundryReportComponent implements OnInit {
  public orders:Array<LaundryOrder>;
  public serverCenters:Array<ServerCenter>;
  public myOrder:LaundryOrder;
  public search: OrderExcel;
  public serverCenter='';
  public orderNo='';
  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public all :boolean;
  public checks : Array<any>;
  public repairDept :any;
  public applierList:Array<Facilitator>;
  constructor(private http: Http,
              public ipSetting: IpSettingService,
              private errorVoid: ErrorResponseService,
              private saleProductEmployeeService:SaleProductEmployeeService,) { }


  ngOnInit() {
    this.search = new OrderExcel();
    this.myOrder = new LaundryOrder();
    this.search.serviceCenter = '';
    this.pages = [];
    this.initFac();
    this.getOrderAllList(1);
    this.getRepairDept();
    this.getFacList();
  }
  /*获取订单*/
  getOrderAllList(num){
    this.pageNo = num;
    this.checkIsAll();
    let url = '/mmall/laundryOrder/getOrderAllList/'+this.pageNo+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  /*获取所有部门列表*/
  getRepairDept(){
    this.saleProductEmployeeService.getDeptList()
      .subscribe(data =>{
        if(this.errorVoid.errorMsg(data)){
          this.repairDept = data.data;
        }
      });
  }
  getFacList(){
    let url = '/mmall/laundry/getFacList/1/999';
    let postData = {};
    this.ipSetting.sendPost(url,postData)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.applierList = data.data.applierList;
          // console.log(this.applierList);
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
  public goPage(page:number){
    this.getOrderAllList(page);
  }
  /*导出*/
  public export(){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否导出数据?',
      'popType': 1,
      'imgType': 3,
      'callback': ()=>{
        let list = document.getElementsByName("orderCheck");
        this.checks = [];
        for(let i = 0;i<list.length;i++){
          if(list[i]['checked']){
            this.checks.push(list[i]['value']);
          }
        }
       if(this.checks.length<1){
          confirmFunc.init({
            'title': '提示',
            'mes': '请选择要导出的数据！',
            'popType': 0,
            'imgType': 2,
          });
          return false;
        }
        let abc = this.checks.join(",");
        let url = this.ipSetting.ip+'/mmall/laundryOrder/getOrderExcel?ids='+abc;
        this.http.get(url)
        // .map(res => res.json())
          .subscribe(data => {
            window.location.href = url;

          });
      }
    });
  }
  /*全选*/
  public checkedAll(){
    let list = document.getElementsByName("orderCheck");
    for(let i = 0;i<list.length;i++){
      list[i]['checked'] = this.all;
    }
  }
  /*判断是否全选*/
  public checkIsAll(){
    let list = document.getElementsByName("orderCheck");
    for(let i = 0;i<list.length;i++){
      if(!list[i]['checked']){
        this.all = false;
      }
    }
  }
}
export class LaundryOrder {
  id:number;
  createTime:string;
  orderNo:string;
  payment:string;
  facilitator:string;
  username:string;
  deptName:string;
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
  facilitator:string;
  orderNo:string;
  serviceCenter:string;
  status: string;
  userId: string;
  deptName:string;
  startTime:string;
  finshTime:string;
  bTime:string;
  eTime:string;
  username:string;
}
export class Facilitator {
  applyId:          string;/*经销商id*/
  applyName:        string;/*经销商名称*/
  copStarttime:     string;/*合作开始时间*/
  copEndtime:       string;/*合作结束时间*/
  applyDesc:        string;/*描述*/
}
