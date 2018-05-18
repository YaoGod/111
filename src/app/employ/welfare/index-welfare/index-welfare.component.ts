import { Component, OnInit } from '@angular/core';
import { Discount } from '../../../mode/discount/discount.service';
import { Welfare } from '../../../mode/welfare/welfare.service';
import { GlobalCatalogService } from '../../../service/global-catalog/global-catalog.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { DiscountEmployeeService } from '../../../service/discount-employee/discount-employee.service';
import { WelfareEmployeeService } from '../../../service/welfare-employee/welfare-employee.service';
import {SaleProduct} from "../../../mode/saleProduct/sale-product.service";
import {SaleProductEmployeeService} from "../../../service/sale-product-employee/sale-product-employee.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
declare var confirmFunc:any;
declare var $: any;
@Component({
  selector: 'app-index-welfare',
  templateUrl: './index-welfare.component.html',
  styleUrls: ['./index-welfare.component.css'],
  providers: [DiscountEmployeeService,WelfareEmployeeService,SaleProductEmployeeService]
})
export class IndexWelfareComponent implements OnInit {
  public catas;
  public rule;
  public rule1;
  public rule2;
  public rule3;
  public discounts: Array<Discount>;
  public welfares: Array<Welfare>;
  public saleProducts:Array<SaleProduct>;
  public pageSize:number;
  public pageNoD: number;
  public maxPageNoD: number;
  public pageNoW: number;
  public maxPageNoW: number;
  public pageNoS: number;
  public maxPageNoS: number;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private discountEmployeeService:DiscountEmployeeService,
    private welfareEmployeeService:WelfareEmployeeService,
    private saleProductEmployee:SaleProductEmployeeService,
    public ipSetting:IpSettingService
  ) {
    this.rule = this.globalCatalogService.getRole("employ/welfare");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("员工服务/惊喜专区");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("employ/welfare");
      }
    );
    this.getRule();
    this.pageNoD = 1;
    this.pageNoW = 1;
    this.pageNoS = 1;
    this.pageSize = 4;
    this.discounts = [];
    this.welfares = [];
    this.saleProducts = [];
    this.getSaleProductList({},this.pageNoS,this.pageSize);
    this.getDiscount("",this.pageNoD,this.pageSize);
    this.getWelfare("",this.pageNoW,this.pageSize);
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'group','employ/welfare')
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.catas = data.data;
          for(let i = 0;i<this.catas.length;i++){
            if(this.catas[i].routeUrl === "employ/welfare/discount/manage"){
              this.rule1 = this.catas[i];
            }
            if(this.catas[i].routeUrl === "employ/welfare/staffWelfare/manage"){
              this.rule2 = this.catas[i];
            }
            if(this.catas[i].routeUrl === "employ/welfare/sale/manage"){
              this.rule3 = this.catas[i];
            }
          }
        }
      })
  }
  getDiscount(search,pageNo,pageSize) {
    this.discountEmployeeService.getDiscountList('execute',search,pageNo,pageSize)
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          this.discounts = data.data.infos;
          this.maxPageNoD = data.data.total;
        }
      });
  }
  getWelfare(search,pageNo,pageSize) {
    this.welfareEmployeeService.getWelfareList(search,pageNo,pageSize)
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          this.welfares = data.data.infos;
          this.maxPageNoW = data.data.total;
        }
      });
  }
  /*获取抢购商品列表*/
  getSaleProductList(search,pageNo,pageSize) {
    this.saleProductEmployee.getSaleProductList(search,pageNo,pageSize)
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          this.saleProducts = data.data.infos;
          this.maxPageNoS = data.data.total;
        }
      });
  }
  rand(pageNo,total):number{
    if(total === 0) {
      return 1;
    }
    let pages = Math.ceil(total/this.pageSize);
    if(pages === 1){
      return 1;
    }
    let tempNo =  Math.ceil(Math.random()*pages);
    while(tempNo === pageNo){
      tempNo =  Math.ceil(Math.random()*pages);
    }
    return tempNo;
  }
  randGetDiscount(){
    this.pageNoD = this.rand(this.pageNoD,this.maxPageNoD);
    // console.log(this.pageNoD);
    this.getDiscount("",this.pageNoD,this.pageSize);
  }
  randGetWelfare(){
    this.pageNoW = this.rand(this.pageNoW,this.maxPageNoW);
    this.getWelfare("",this.pageNoW,this.pageSize);
  }
  randGetSale(){
    this.pageNoS = this.rand(this.pageNoS,this.maxPageNoS);
    this.getWelfare("",this.pageNoS,this.pageSize);
  }
}
