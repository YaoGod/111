import { Component, OnInit } from '@angular/core';
import {Vegetable} from '../../../../mode/vegetableInfo/vegetableInfo.service';
import {VegetableCart} from '../../../../mode/vegetableCart/vegetable-cart.service';
import { VegetableInfoService } from '../../../../service/vegetable-info/vegetable-info.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-vegbuy',
  templateUrl: './vegbuy.component.html',
  styleUrls: ['./vegbuy.component.css'],
  providers: [VegetableInfoService,ErrorResponseService]
})
export class VegbuyComponent implements OnInit {
  public vegetables:Array<Vegetable>;
  public search: Vegetable;
  public cart: VegetableCart;
  private pageNo: number = 1;
  private pageSize: number = 5;
  public cartsize:number;
  public pages: Array<number>;
  constructor(private vegetableInfoService: VegetableInfoService,
              private errorVoid: ErrorResponseService,) { }

  ngOnInit() {
    this.search = new Vegetable();
    this.pages = [];
    this.getVegetableShowList();

    var offset = $("#end").offset();
    $(".addcar").click(function(event){
      var addcar = $(this);
      var img = addcar.parent().find('img').attr('src');
      var flyer = $('<img class="u-flyer" src="'+img+'">');
      flyer.fly({
        start: {
          left: event.pageX, //开始位置（必填）#fly元素会被设置成position: fixed
          top: event.pageY //开始位置（必填）
        },
        end: {
          left: offset.left+10, //结束位置（必填）
          top: offset.top+10, //结束位置（必填）
          width: 0, //结束时宽度
          height: 0 //结束时高度
        },
        onEnd: function(){ //结束回调
          $("#msg").show().animate({width: '250px'}, 200).fadeOut(1000); //提示信息
          addcar.css("cursor","default").removeClass('orange').unbind('click');
          this.destory(); //移除dom
        }
      });
    });
  }

  getVegetableShowList(){
    this.vegetableInfoService.getVegetableShowList(this.pageNo,this.pageSize,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.vegetables = data.data.infos;
        console.log(this.vegetables);
        this.cartsize = data.data.cartsize;
        let total = Math.ceil(data.data.total / this.pageSize);
        this.initPage(total);
      }
    });
  }

  addToCart(id: number){
    this.cart = new VegetableCart();
    this.cart.productId = id;
    this.vegetableInfoService.addToCart(this.cart)
      .subscribe(data => {
        if(data['status']==0){
          this.cartsize = data.data.cartsize;
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
      this.search = new Vegetable();
    }
    this.getVegetableShowList();
  }
}
