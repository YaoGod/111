import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SupermarketCart} from "../../../../mode/supermarketCart/supermarket-cart.service";
import {SupermarketProduct} from "../../../../mode/supermarketProduct/supermarket-product.service";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
declare var confirmFunc:any;
@Component({
  selector: 'app-supbuy',
  templateUrl: './supbuy.component.html',
  styleUrls: ['./supbuy.component.css'],
  providers: [SupermarketManagerService,ErrorResponseService]
})
export class SupbuyComponent implements OnInit {
  public rule;
  public catas;
  public products:Array<SupermarketProduct>;
  public search: SupermarketProduct;
  public cart: SupermarketCart;
  public pageNo: number = 1;
  public pageSize: number = 10;
  public total = 0;
  public cartsize:number = 0;
  public username = sessionStorage.getItem("username");
  public applierList: Array<any>;
  public categories: Array<any>;
  constructor(
    private marketManagerService: SupermarketManagerService,
    private errorVoid: ErrorResponseService,
    private globalCatalogService: GlobalCatalogService,
    private router:Router,
    private route:ActivatedRoute,
    public ipSetting:IpSettingService) {}

  ngOnInit() {
    this.getRule();
    this.search = new SupermarketProduct();
    this.search.applier = "";
    this.search.stype = "";
    this.getMarketShowList(1);
    this.getSupermarketList(1);

  }
  getRule(){
    this.globalCatalogService.getCata(-1,'market','employ/market/supermarket')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;
          this.rule = {};
          for(let i = 0;i<this.catas.length;i++){
            if(this.catas[i].isInstall){
              this.rule.isInstall = true;
            }
            if(this.catas[i].isUpdate){
              this.rule.isUpdate = true;
            }
            if(this.catas[i].isDelete){
              this.rule.isDelete = true;
            }
            if(this.catas[i].isSelect){
              this.rule.isSelect = true;
            }
          }
        }
      })
  }
  gotoMange(){
    this.router.navigate(["../../../../"+this.catas[0].routeUrl],{relativeTo: this.route});
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
   if(leftstatus<3){
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
  getSupermarketList(pageNo){
    this.marketManagerService.getSupermarketList(pageNo,this.pageSize,this.search)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.applierList = data.data.applierList;
          this.categories = data.data.categories;
        }
      });
  }
}
