import { Component, OnInit } from '@angular/core';
import {Vegetable} from '../../../../mode/vegetableInfo/vegetableInfo.service';
import {VegetableCart} from '../../../../mode/vegetableCart/vegetable-cart.service';
import { VegetableInfoService } from '../../../../service/vegetable-info/vegetable-info.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import * as $ from 'jquery';
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
declare var confirmFunc:any;
@Component({
  selector: 'app-vegbuy',
  templateUrl: './vegbuy.component.html',
  styleUrls: ['./vegbuy.component.css'],
  providers: [VegetableInfoService,ErrorResponseService]
})
export class VegbuyComponent implements OnInit {
  public rule;
  public catas;
  public vegetables:Array<Vegetable>;
  public search: Vegetable;
  public cart: VegetableCart;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public cartsize:number;
  constructor(private vegetableInfoService: VegetableInfoService,
              private errorVoid: ErrorResponseService,
              private globalCatalogService: GlobalCatalogService,
              public ipSetting:IpSettingService) {}

  ngOnInit() {
    this.search = new Vegetable();
    this.pages = [];
    this.getRule();
    this.getVegetableShowList(1);
    this.typewriter();

  }
  getRule(){
    this.globalCatalogService.getCata(-1,'market','employ/market/cleanDishes')
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
  getVegetableShowList(num){
    this.pageNo = num;
    this.vegetableInfoService.getVegetableShowList(this.pageNo,this.pageSize,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.vegetables = data.data.infos;
        this.cartsize = data.data.cartsize;
        this.total = data.data.total;
      }
    });
  }
  typewriter(){
    let typewriter = document.querySelector(".typewriter");
    let code = typewriter.innerHTML;
    let pos = 0;
    let len = code.length;
    typewriter.innerHTML="";
    // typewriter.style.display="block";
    function typewriting(){
      pos++;
      if(pos<=len) {
        switch(code.charAt(pos)) {
          case "<":
            pos=code.indexOf(">",pos);
            break;
          case "&":
            pos=code.indexOf(";",pos);
            break;
        }
        typewriter.innerHTML=code.substring(0,pos);
        setTimeout(typewriting,100);
      } else {
        typewriter.classList.add("gameover");
      }
    }
    typewriting();
  }

  addToCart(id: number){
    this.cart = new VegetableCart();
    this.cart.productId = id;
    this.vegetableInfoService.addToCart(this.cart)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.cartsize = data.data.cartsize;
          confirmFunc.init({
            'title': '提示' ,
            'mes': '预定成功:已加入购物车！',
            'popType': 0 ,
            'imgType': 1 ,
          });
        }
      })
  }
  /*跳页加载数据*/
  goPage(page:number){
    if(this.search==null){
      this.search = new Vegetable();
    }
    this.getVegetableShowList(page);
  }
}
