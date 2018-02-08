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
  public goods:Array<Goods>;
  public search: Goods;
  public cart: GoodsCart;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public pages: Array<number>;
  public cartsize: number;
  public providers: Array<any>;
  public imgUrl:string;
  constructor(private errorVoid: ErrorResponseService,
              public ipSetting  : IpSettingService,
              private globalCatalogService: GlobalCatalogService,
              private router:Router,
              private route:ActivatedRoute) {}

  ngOnInit() {
    this.getRule();
    this.search = new Goods();
    this.search.name = "";
    this.search.code = "";
    this.getGoodsShowList(1);
    this.getproviders();
    this.imgUrl = 'ftp://hzmh:1qaz2wsx@20.26.28.4/home/img/666.jpg';
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'market','employ/market/reserve')
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
  getproviders(){
    let url = "/goodsProduct/provider/type";
    this.ipSetting.sendGet(url)
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.providers = data.data;
      }
    });
  }
  gotoMange(){
    this.router.navigate(["../../../../"+this.catas[0].routeUrl],{relativeTo: this.route});
  }
  getGoodsShowList(pageNo){
    this.pageNo = pageNo;
    let url = '/goodsProduct/search?name='+ this.search.name +'&code='+this.search.code+
      '&pageNum='+ this.pageNo +'&pageSize='+ this.pageSize;
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
}

