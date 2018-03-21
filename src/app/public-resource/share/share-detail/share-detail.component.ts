import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {ShareProductPublicService} from "../../../service/share-product-public/share-product-public.service";
import {ShareProduct} from "../../../mode/shareProduct/share-product.service";
import {ActivatedRoute, Router} from "@angular/router";
declare var $:any;
@Component({
  selector: 'app-share-detail',
  templateUrl: './share-detail.component.html',
  styleUrls: ['./share-detail.component.css']
})
export class ShareDetailComponent implements OnInit {

  public shareProduct: ShareProduct;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private errorResponseService:ErrorResponseService,
    private shareProductPublicService: ShareProductPublicService,
  ) { }

  ngOnInit() {
    this.shareProduct = new ShareProduct();
    let tempid = 0;
    this.route.params.subscribe(data => {
      if(tempid === 0){
        this.shareProduct.id = data.id;
        this.getShareProductDetail(this.shareProduct.id);
        tempid ++;
      }
    });
  }
  /*获取物品详情*/
  getShareProductDetail(id){
    this.shareProductPublicService.getShareProductDetail(id)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.shareProduct = data.data;
          if(this.shareProduct.imgPathList.length>0){
            this.shareProduct.imgPath = this.shareProduct.imgPathList[0];
          }
        }
      })
  }
  /*判断textarea的行数自适应*/
  definedRows(){
    let length = $("#summary").val().split(/\r?\n/).length;
    return length+1;
  }
  /*查看图片*/
  chooseImg(i){
    this.shareProduct.imgPath = this.shareProduct.imgPathList[i];
  }
  OrderProduct(id){

  }
}
