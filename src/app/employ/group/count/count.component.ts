import { Component, OnInit } from '@angular/core';
import {Http,RequestOptions,Headers} from '@angular/http';
import { GroupOrderService } from '../../../service/group-order/group-order.service';
import {GroupOrderItem} from '../../../mode/groupOrderItem/group-orderItem.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.css'],
  providers:[GroupOrderService,ErrorResponseService]
})
export class CountComponent implements OnInit {
  public catas;
  public rule;
  public search: SearchOrder;
  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public countType = '3';
  public countValue = '';
  public countValue1='1';
  public countValue2='2018';
  public pages: Array<number>;
  public productName='';
  public orders:Array<SearchOrder>;
  public orderItems:Array<GroupOrderItem>;

  constructor(private errorVoid: ErrorResponseService,
              private globalCatalogService: GlobalCatalogService,
              private http: Http, private ipSetting:IpSettingService) { }

  ngOnInit() {
    this.getRule();
    this.getCountList();
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'group','employ/group')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;
          for(let i = 0;i<this.catas.length;i++){
            if(this.catas[i].routeUrl === "employ/group"){
              this.catas.splice(i,1);
              i = 0;
            }
            if(this.catas[i].routeUrl === "employ/group/count"){
              this.rule = this.catas[i];
            }
          }
        }
      })
  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    if(this.search==null){
      this.search = new SearchOrder();
    }
    this.getCountList();
  }

  changeDate(){
    if(this.countType ==='1'){
      $("#date1").show();
      $("#date2").hide();
      $("#date3").hide();
    }
    if(this.countType ==='2'){
      $("#date2").show();
      $("#date1").hide();
      $("#date3").hide();
    }
    if(this.countType ==='3'){
      $("#date3").show();
      $("#date1").hide();
      $("#date2").hide();
    }
    this.pageNo = 1;
  }
  getCountList(){
    let url = '';
    if(this.countType ==='1'){
      if(this.countValue==null || this.countValue===''){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '请选择月份！',
          'popType': 0 ,
          'imgType': 2 ,
        });
        return false;
      }
      if((this.productName!==null &&this.productName.trim()==="")||this.productName==='undefined'){
        this.productName = '';
      }
      url = '/mmall/order/getCountList/'+this.pageNo+'/'+this.pageSize+'?countType='+this.countType+'&countValue='
        +this.countValue+'&productName='+this.productName;
    }
    if(this.countType ==='2'){
      url = '/mmall/order/getCountList/'+this.pageNo+'/'+this.pageSize+'?countType='+this.countType+'&countValue='
        +this.countValue1+'&productName='+this.productName;
    }
    if(this.countType ==='3'){
      url = '/mmall/order/getCountList/'+this.pageNo+'/'+this.pageSize+'?countType='+this.countType+'&countValue='
        +this.countValue2+'&productName='+this.productName;
    }
    this.ipSetting.sendPost(url,this.search)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.orders = data.data.infos;
          this.total = data.data.total;
        }
      });
  }
}

export class SearchOrder {
  PERSONS:number;
  TOTAL:number;
  COUNTS:number;
  DEPT_NAME:string;
  PRODUCT_NAME:number;
}
