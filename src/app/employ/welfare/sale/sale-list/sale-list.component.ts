import { Component, OnInit } from '@angular/core';
import {SaleProduct} from "../../../../mode/saleProduct/sale-product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SaleProductEmployeeService} from "../../../../service/sale-product-employee/sale-product-employee.service";

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.css']
})
export class SaleListComponent implements OnInit {

  public pageNo = 1;
  public pageSize = 10;
  public total = 0;
  public maxPageNo;
  public search :SaleProduct;
  public saleProducts:Array<SaleProduct>;
  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private saleProductEmployeeService:SaleProductEmployeeService,
    private errorResponseService:ErrorResponseService,
  ) { }
  ngOnInit() {
    this.search = new SaleProduct();
    this.getSaleProductList(this.search,this.pageNo);
  }
  /*获取抢购商品列表*/
  getSaleProductList(search,pageNo) {
    this.saleProductEmployeeService.getSaleProductList(search,pageNo,this.pageSize)
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          this.saleProducts = data.data.infos;
          this.total = data.data.total;
          this.maxPageNo = Math.ceil(data.data.total / this.pageSize);
        }
      });
  }
  linkSale(id){
    this.router.navigate(['../detail',id],{relativeTo:this.route});
  }
  scrollMore(){
    this.pageNo++;
    this.getSaleProductList(this.search,this.pageNo);
  }
}
