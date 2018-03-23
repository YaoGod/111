import { Component, OnInit } from '@angular/core';
import {ShareProduct} from "../../../mode/shareProduct/share-product.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {ShareProductPublicService} from "../../../service/share-product-public/share-product-public.service";
declare var confirmFunc:any;
@Component({
  selector: 'app-share-reserve',
  templateUrl: './share-reserve.component.html',
  styleUrls: ['./share-reserve.component.css']
})
export class ShareReserveComponent implements OnInit {

  public pageNo : number;
  public pageSize = 10;
  public total = 0;
  public search :ShareProduct;
  public shareProducts: Array<ShareProduct>;
  constructor(
    private errorResponseService:ErrorResponseService,
    private shareProductPublicService: ShareProductPublicService,
  ) { }

  ngOnInit() {
    this.shareProducts = [];
    this.search = new ShareProduct();
    this.search.status = "";
    this.getReserveProductList(1);
  }
  /*获取当前用户已预定的商品*/
  getReserveProductList(pageNo){
    this.pageNo = pageNo;
    this.shareProductPublicService.getReserveProductList(this.search,this.pageNo,this.pageSize)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.shareProducts = data.data.infos;
          this.total = data.data.total;
        }
      })
  }
  /*取消预订*/
  cancelOrderProduct(id){
    this.shareProductPublicService.cancelOrderProduct(id)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          confirmFunc.init({
            'title': '提示',
            'mes': data.msg,
            'popType': 2,
            'imgType': 1,
          });
          this.getReserveProductList(1);
        }
      })
  }

}
