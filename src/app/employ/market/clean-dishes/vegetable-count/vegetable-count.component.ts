import { Component, OnInit } from '@angular/core';
declare var confirmFunc:any;
import * as $ from 'jquery';
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {Http} from "@angular/http";


@Component({
  selector: 'app-vegetable-count',
  templateUrl: './vegetable-count.component.html',
  styleUrls: ['./vegetable-count.component.css'],
  providers: [ErrorResponseService]
})
export class VegetableCountComponent implements OnInit {
  public search: LaundryOrder;
  public serverCenters:Array<ServerCenter>;
  public vegetables:any;
  public orders:any;
  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  constructor(private http: Http,private ipSetting: IpSettingService,private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.search = new LaundryOrder();
    this.vegetables = [];
    this.getOrderAllList();
    this.initFac();
  }
  /*查询*/
  getOrderAllList(){
    if(this.search.productName===undefined){
      this.search.productName = '';
    }
    if(this.search.serviceCenter===undefined){
      this.search.serviceCenter = '';
    }
    let url = '/mmall/vegetabelOrder/getOrderReport/'+this.pageNo+'/'+this.pageSize+'?productName='+this.search.productName;
    this.ipSetting.sendPost(url,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;
        // console.log(data.data);
        this.total = data.data.total;
      }
    });
  }
  /*查询净菜名称*/ // GET /mmall/vegetableInfo/getVegetableByName/{name}
  getVegetables(){
    let nnt = $('#productName').val().trim();
      // $('#productName').val().trim()===''?'小':$('#productName').val().trim();
    let url = '/mmall/vegetableInfo/getVegetableByName?name='+nnt;
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.vegetables = data.data;
      }
    });
  }
  /*同步名称*/
  synchro(name){
    this.search.productName = name;
    this.vegetables = [];
  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    this.getOrderAllList();
  }
  /*获取服务中心*/
  initFac(){
    let url = '/mmall/laundry/provider/initFac';
    this.ipSetting.sendPost(url,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.serverCenters = data.data.centers;
      }
    });
  }
  export(){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否导出数据?',
      'popType': 1,
      'imgType': 3,
      'callback': ()=>{
        let url = this.ipSetting.ip + '/mmall/vegetabelOrder/getOrderExcel?serviceCenter='+this.search.serviceCenter+
          '&productName=' +this.search.productName;
        this.http.get(url)
        // .map(res => res.json())
          .subscribe(data => {
            window.location.href = url;
            this.search = new LaundryOrder();

          });
      }
    });
  }

}
export class LaundryOrder {
  id:number;
  productName:string;
  num:number;
  price:string;
  totalPrice:string;
  orderNo:string;
  status:string;
  serviceCenter:           string;
}
export class ServerCenter{
  name: string;
  id:number;
}
