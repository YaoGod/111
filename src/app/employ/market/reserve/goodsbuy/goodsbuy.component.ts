import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import * as $ from 'jquery';
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {Goods,GoodsCart} from "../../../../service/goods-entity/goods-entity.service";

@Component({
  selector: 'app-goodsbuy',
  templateUrl: './goodsbuy.component.html',
  styleUrls: ['./goodsbuy.component.css'],
  providers: [ErrorResponseService]
})
export class GoodsbuyComponent implements OnInit {
  public imgPrefix: string;
  public goods:Array<Goods>;
  public search: Goods;
  public cart: GoodsCart;
  private pageNo = 1;
  private pageSize = 5;
  public cartsize: number;
  public pages: Array<number>;
  constructor(private errorVoid: ErrorResponseService,
              private ipSetting  : IpSettingService) { }

  ngOnInit() {
    this.imgPrefix = this.ipSetting.ip;
    this.search = new Goods();
    this.pages = [];
    this.getGoodsShowList();

    var offset = $("#end").offset();
    $(".addcar").click(function(event){
      var addcar = $(this);
      var img = addcar.parent().find('img').attr('src');
      var flyer = $('<img class="u-flyer" src="'+img+'">');
      flyer.fly({
        start: {
          left: event.pageX, // 开始位置（必填）#fly元素会被设置成position: fixed
          top: event.pageY // 开始位置（必填）
        },
        end: {
          left: offset.left+10, // 结束位置（必填）
          top: offset.top+10, // 结束位置（必填）
          width: 0, // 结束时宽度
          height: 0 // 结束时高度
        },
        onEnd: function(){ // 结束回调
          $("#msg").show().animate({width: '250px'}, 200).fadeOut(1000); // 提示信息
          addcar.css("cursor","default").removeClass('orange').unbind('click');
          this.destory(); // 移除dom
        }
      });
    });
  }

  getGoodsShowList(){
    let url = '/goodsProduct/search?';
    if(typeof(this.search.name) == 'undefined'){
      url += 'pageNum=' + this.pageNo + '&pageSize=' + this.pageSize;
    }else {
      url += 'name=' + this.search.name + '&pageNum='
        + this.pageNo + '&pageSize=' + this.pageSize;
    }

    this.ipSetting.sendGet(url)
        .subscribe(data => {
          if (this.errorVoid.errorMsg(data)) {

            this.goods = data.data.list;
            console.log(this.goods);
           // this.cartsize = data.data.cartsize;
            let total = Math.ceil(data.data.total / this.pageSize);
            this.initPage(total);
          }
    });
    this.getCartProductsCount();
  }
  // 获取购物车的数量
  getCartProductsCount() {
    let url = '/goodsCart/getCartProductsCount?userId='
      + localStorage.getItem("username");
    return this.ipSetting.sendGet(url)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          this.cartsize = data.data;
        }else{
        }
      })
  }

  addToCart(id: number){
    const url = '/goodsCart/add?userId='+ localStorage.getItem("username")
        +'&productId='+ id + '&count=1';
    return this.ipSetting.sendGet(url)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          this.cartsize = data.data.cartTotalQuantity;
          alert("预定成功:已加入购物车！");
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
      this.search = new Goods();
    }
    this.getGoodsShowList();
  }


}

/*
export class Goods{
  id:                number;
  code:              string;/!*商品编号*!/
  name:             string;/!*商品名称*!/
  image:            string;/!*商品图片*!/
  detail:            string;/!*商品详情*!/
  price:             number;/!*商品价格*!/
  status:            string;/!*商品状态*!/
}
*/
