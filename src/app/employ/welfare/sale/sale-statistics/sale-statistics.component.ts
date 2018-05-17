import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SaleProduct, UserSale} from "../../../../mode/saleProduct/sale-product.service";
import {SaleProductEmployeeService} from "../../../../service/sale-product-employee/sale-product-employee.service";

@Component({
  selector: 'app-sale-statistics',
  templateUrl: './sale-statistics.component.html',
  styleUrls: ['./sale-statistics.component.css']
})
export class SaleStatisticsComponent implements OnInit {

  public pageNo    = 1;             /*当前页码*/
  public pageSize  = 10;             /*显示页数*/
  public total    = 0;               /*页码*/
  public search   :UserSale;
  public saleProduct:SaleProduct;
  public userSales: Array<UserSale>;
  constructor(
    private router   : Router,
    private route    : ActivatedRoute,
    private globalCatalogService   : GlobalCatalogService,
    private errorResponseService   : ErrorResponseService,
    private saleProductEmployeeService:SaleProductEmployeeService,
    public ipSetting: IpSettingService,
  ) { }

  ngOnInit() {
    this.search = new UserSale();
    this.saleProduct = new SaleProduct();
    this.userSales = [];
    this.search.userId = "";
    this.globalCatalogService.setTitle("员工服务/惊喜专区/限时抢信息报表");
    this.route.params.subscribe(data => {
      this.saleProduct.id = data.id;
      this.getSaleProduct(data.id);
      this.getSaleProductCount(1);
    });
  }
  /*获取商品详情*/
  getSaleProduct(id){
    this.saleProductEmployeeService.getSaleProduct(id)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.saleProduct = data.data;
          this.saleProduct.imgPath = this.saleProduct.imgPathList[0];
        }
      })
  }
  /*获取订单报表数据*/
  getSaleProductCount(pageNo){
    this.pageNo = pageNo;
    this.saleProductEmployeeService.getSaleProductCount(
      pageNo,this.pageSize,'list', this.saleProduct.id, this.search)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.userSales=data.data.infos;
          this.total = data.data.total;
        }
      })
  }
  /*导出订单报表*/
  exportExcel(){
    this.saleProductEmployeeService.getSaleProductCount(
      this.pageNo,this.pageSize, 'excel', this.saleProduct.id,this.search);
  }
}
