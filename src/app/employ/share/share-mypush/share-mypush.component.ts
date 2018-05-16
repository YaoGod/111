import { Component, OnInit } from '@angular/core';
import {ShareProduct} from "../../../mode/shareProduct/share-product.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {ShareProductPublicService} from "../../../service/share-product-public/share-product-public.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
declare var confirmFunc:any;
@Component({
  selector: 'app-share-mypush',
  templateUrl: './share-mypush.component.html',
  styleUrls: ['./share-mypush.component.css']
})
export class ShareMypushComponent implements OnInit {

  public pageNo : number;
  public pageSize = 10;
  public total = 0;
  public search :ShareProduct;
  public shareProducts: Array<ShareProduct>;
  constructor(
    private errorResponseService:ErrorResponseService,
    private shareProductPublicService: ShareProductPublicService,
    public ipSetting:IpSettingService
  ) { }

  ngOnInit() {
    this.shareProducts = [];
    this.search = new ShareProduct();
    this.getShareProductsPersonl(1);
  }

  getShareProductsPersonl(pageNo){
    this.pageNo = pageNo;
    this.shareProductPublicService.getProductList(this.search,this.pageNo,this.pageSize)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.shareProducts = data.data.infos;
          this.total = data.data.total;
        }
      })
  }
  /*删除商品*/
  delete(id){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除该商品?',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        this.shareProductPublicService.deleteShareProduct(id)
          .subscribe(data=>{
            if(this.errorResponseService.errorMsg(data)){
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
              });
              this.getShareProductsPersonl(1);
            }
          })
      }
    })
  }
  /*重新审核*/
  reCheck(id){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否确认提交管理员重新审核?',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        let postdata = new ShareProduct();
        postdata.id = id;
        postdata.status = 'pending_check';
        this.shareProductPublicService.updateShareProduct(postdata)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1
              });
              this.getShareProductsPersonl(1);
            }
          });
      }
    });
  }
  changeProductStatus(id,status){
    let postdata = new ShareProduct();
    postdata.id = id;
    postdata.status = status;
    this.shareProductPublicService.updateShareProduct(postdata)
      .subscribe(data => {
        if (this.errorResponseService.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data.msg,
            'popType': 2,
            'imgType': 1
          });
          this.getShareProductsPersonl(1);
        }
      });
  }
}
