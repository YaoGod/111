import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SupermarketCart} from "../../../../mode/supermarketCart/supermarket-cart.service";
import {SupermarketProduct} from "../../../../mode/supermarketProduct/supermarket-product.service";
@Component({
  selector: 'app-supbuy',
  templateUrl: './supbuy.component.html',
  styleUrls: ['./supbuy.component.css'],
  providers: [SupermarketManagerService,ErrorResponseService]
})
export class SupbuyComponent implements OnInit {
  public products:Array<SupermarketProduct>;
  public search: SupermarketProduct;
  public cart: SupermarketCart;
  private pageNo: number = 1;
  private pageSize: number = 10;
  public cartsize:number;
  public pages: Array<number>;
  public username = sessionStorage.getItem("username");
  constructor(
    private marketManagerService: SupermarketManagerService,
    private errorVoid: ErrorResponseService,) { }

  ngOnInit() {
    this.search = new SupermarketProduct();
    this.pages = [];
    this.getMarketShowList();
  }

  checkcolor(){
    $(".product").hover(function(){
      $(this).addClass("product-hover").siblings().removeClass("product-hover");
    })
  }

 getMarketShowList(){
    this.marketManagerService.getMarketShowList(this.pageNo,this.pageSize,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.products = data.data.infos;
        console.log(this.products);
        this.cartsize = data.data.cartsize;
        let total = Math.ceil(data.data.total / this.pageSize);
        this.initPage(total);
      }
    });
      this.checkcolor();
  }


  addToCart(id: number){

    this.cart = new SupermarketCart();
    this.cart.productId = id;
    this.cart.quantity = 1;
    this.marketManagerService.addToCart(this.username,this.cart)
      .subscribe(data => {
        if(data['status']==0){
          this.cartsize = data.data.cartsize;
          alert("购买成功:已加入购物车！");
        }else{
          alert(data['msg']);
        }
      })
  }



  /*页码初始化*/
  initPage(total){
    this.pages = new Array(total);
    console.log(this.pages);
    for(let i = 0;i< total ;i++){
      this.pages[i] = i+1;
    }
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
      this.search = new SupermarketProduct();
    }
    this.getMarketShowList();
  }
}
