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
    
  }

  getVegetableShowList(){
    this.vegetableInfoService.getVegetableShowList(this.pageNo,this.pageSize,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.vegetables = data.data.infos;

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
