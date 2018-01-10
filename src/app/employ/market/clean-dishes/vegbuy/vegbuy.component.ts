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
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public cartsize:number;
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
        this.total = data.data.total;
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
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    if(this.search==null){
      this.search = new Vegetable();
    }
    this.getVegetableShowList();
  }
}
