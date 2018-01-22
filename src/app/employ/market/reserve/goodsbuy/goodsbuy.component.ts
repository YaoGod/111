import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import * as $ from 'jquery';
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {Goods,GoodsCart} from "../../../../service/goods-entity/goods-entity.service";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {ActivatedRoute, Router} from "@angular/router";

declare var confirmFunc:any;

@Component({
  selector: 'app-goodsbuy',
  templateUrl: './goodsbuy.component.html',
  styleUrls: ['./goodsbuy.component.css'],
  providers: [ErrorResponseService]
})
export class GoodsbuyComponent implements OnInit {
  public rule;
  public catas;
  public imgPrefix: string;
  public goods:Array<Goods>;
  public search: Goods;
  public cart: GoodsCart;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public cartsize: number;
  constructor(private errorVoid: ErrorResponseService,
              private ipSetting  : IpSettingService,
              private globalCatalogService: GlobalCatalogService,
              private router:Router,
              private route:ActivatedRoute) {
    this.rule = this.globalCatalogService.getRole("employ/market");
  }

  ngOnInit() {
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("employ/market");
      }
    );
    this.getRule();
    this.imgPrefix = this.ipSetting.ip;
    this.search = new Goods();
    this.pages = [];
    this.getGoodsShowList();
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'market','employ/market/reserve')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;
        }
      })
  }
  gotoMange(){
    this.router.navigate(["../../../../"+this.catas[0].routeUrl],{relativeTo: this.route});
  }
  getGoodsShowList(){
    let url = '/goodsProduct/search?';
    if(typeof(this.search.name) === 'undefined'){
      url += 'pageNum='+ this.pageNo +'&pageSize='+ this.pageSize;
    }else {
      url += 'name='+ this.search.name +'&pageNum='+ this.pageNo +'&pageSize='+ this.pageSize;
    }
    this.ipSetting.sendGet(url).subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.goods = data.data.list;
          this.total = data.data.total;
        }
    });
    this.getCartProductsCount();
  }
  /** 获取购物车的数量*/
  getCartProductsCount() {
    let url = '/goodsCart/getCartProductsCount?userId=' + localStorage.getItem("username");
    return this.ipSetting.sendGet(url)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          this.cartsize = data.data;
        }
      })
  }
/**加入购物车*/
  addToCart(id: number){
    let url = '/goodsCart/add?userId='+ localStorage.getItem("username") +'&productId='+ id + '&count=1';
    return this.ipSetting.sendGet(url)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          this.cartsize = data.data.cartTotalQuantity;
          confirmFunc.init({
            'title': '提示' ,
            'mes': "预定成功:已加入购物车！",
            'popType': 0 ,
            'imgType': 1 ,
          });
        }
      })
  }

  /**跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    if(this.search==null){
      this.search = new Goods();
    }
    this.getGoodsShowList();
  }
}

