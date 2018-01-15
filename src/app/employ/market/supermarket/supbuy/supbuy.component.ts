import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SupermarketCart} from "../../../../mode/supermarketCart/supermarket-cart.service";
import {SupermarketProduct} from "../../../../mode/supermarketProduct/supermarket-product.service";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
declare var confirmFunc:any;
@Component({
  selector: 'app-supbuy',
  templateUrl: './supbuy.component.html',
  styleUrls: ['./supbuy.component.css'],
  providers: [SupermarketManagerService,ErrorResponseService]
})
export class SupbuyComponent implements OnInit {
  public rule;
  public products:Array<SupermarketProduct>;
  public search: SupermarketProduct;
  public cart: SupermarketCart;
  public pageNo: number = 1;
  public pageSize: number = 10;
  public total = 0;
  public cartsize:number = 0;
  public pages: Array<number>;
  public username = localStorage.getItem("username");
  constructor(
    private marketManagerService: SupermarketManagerService,
    private errorVoid: ErrorResponseService,
    private globalCatalogService: GlobalCatalogService,) {
    this.rule = this.globalCatalogService.getRole("employ/market");
  }

  ngOnInit() {
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("employ/market");
      }
    );
    this.search = new SupermarketProduct();
    this.pages = [];
    this.getMarketShowList(1);
  }

  checkcolor(){
    $(".product").hover(function(){
      $(this).addClass("product-hover").siblings().removeClass("product-hover");
    })
  }

 getMarketShowList(pageNo){
    this.pageNo = pageNo;
    this.marketManagerService.getMarketShowList(this.pageNo,this.pageSize,this.search)
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.products = data.data.infos;
        this.cartsize = data.data.cartsize;
        this.total = data.data.total;
      }
    });
    this.checkcolor();
  }
  /*加入购物车*/
  addToCart(id: number,leftstatus: number){
   if(leftstatus>1){
     this.cart = new SupermarketCart();
     this.cart.productId = id;
     this.cart.quantity = 1;
     this.marketManagerService.addToCart(this.username,this.cart)
       .subscribe(data => {
         if(this.errorVoid.errorMsg(data)){
           this.cartsize = data.data.cartsize;
           confirmFunc.init({
             'title': '提示',
             'mes': "已加入购物车！",
             'popType': 0,
             'imgType': 1,
           });
         }
       })
   }else{
     confirmFunc.init({
       'title': '提示',
       'mes': "该商品正在补货中，暂时无法加购！",
       'popType': 0,
       'imgType': 2,
     });
   }
  }

}
