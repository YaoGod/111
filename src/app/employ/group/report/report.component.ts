import { Component, OnInit } from '@angular/core';
import {Http,RequestOptions,Headers} from '@angular/http';
import { GroupOrderService } from '../../../service/group-order/group-order.service';
import {GroupOrderItem} from '../../../mode/groupOrderItem/group-orderItem.service'
import {GroupMessage, GroupOrder} from '../../../mode/groupOrder/group-order.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
declare var $: any;
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers:[GroupOrderService,ErrorResponseService]
})
export class ReportComponent implements OnInit {
  public search: SearchOrder;
  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public totalPrice = 0;
  public orderId = '';
  public pages: Array<number>;
  public orders:Array<SearchOrder>;
  public orderItems:Array<GroupOrderItem>;

  constructor(private groupOrderService: GroupOrderService,private errorVoid: ErrorResponseService,
              private http: Http, private ipSetting:IpSettingService) { }

  ngOnInit() {
    this.search = new SearchOrder();
    this.search.orderStatus="";
    this.getReportAllList();
  }

  getOrderItems(orderId){
    console.log(orderId);
    this.groupOrderService.getOrderItems(orderId).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orderItems = data.data.infos;
        this.orderId = orderId;
        this.totalPrice=data.data.totalPrice;
        console.log(this.orderItems);
        $('.mask0').show();
      }
    });
  }
  getReportAllList(){
    this.groupOrderService.getReportAllList(this.search,this.pageNo,this.pageSize).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;
        let total = Math.ceil(data.data.total / this.pageSize);
        this.initPage(total);
      }
    });
  }

  printMask0(){
    window.print();
  }


  /*页码初始化*/
  initPage(total){
    this.pages = new Array(total);
    for(let i = 0;i< total ;i++){
      this.pages[i] = i+1;
    }
  }
  /*点击导出*/
  leadOut(){
    $('#deriving').fadeIn();
  }
  closeMask0(){
    $('.mask0').hide();
  }

  /*关闭导出对话框*/
  private closeDeriving() {
    $('#deriving').hide();
  }
  downLoad(key){
    window.location.href = this.ipSetting.ip + '/mmall/order/downExcel/'+key;
  }
  /*导出数据下载*/
  private downDeriving(){
    let url = '/mmall/order/getOrderExcel';
    this.ipSetting.sendPost(url,this.search)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          console.log(data.data);
          this.downLoad(data.data);
          $('#deriving').hide();
        }
      });
  }
  printMask(){

  }

  /*页面显示区间5页*/
  pageLimit(page:number){
    if(this.pages.length < 5){
      return false;
    } else if(page<=5 && this.pageNo <= 3){
      return false;
    } else if(page>=this.pages.length -4 && this.pageNo>=this.pages.length-2){
      return false;
    } else if (page<=this.pageNo+2 && page>=this.pageNo-2){
      return false;
    }
    return true;
  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    if(this.search==null){
      this.search = new SearchOrder();
    }
    this.getReportAllList();
  }


}

export class SearchOrder {
  orderId:number;
  productId:string;
  payment:number;
  productName:string;
  orderStatus:string;
  orderStartTime:string;
  orderEndTime:string;
  userName:string;
  deptName:string;
  payTime:string;
}
