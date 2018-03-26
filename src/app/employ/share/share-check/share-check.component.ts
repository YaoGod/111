import { Component, OnInit } from '@angular/core';
import {ShareProduct} from "../../../mode/shareProduct/share-product.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {ShareProductPublicService} from "../../../service/share-product-public/share-product-public.service";
declare var $: any;
declare var confirmFunc:any;
@Component({
  selector: 'app-share-check',
  templateUrl: './share-check.component.html',
  styleUrls: ['./share-check.component.css']
})
export class ShareCheckComponent implements OnInit {

  public pageNo : number;
  public pageSize = 10;
  public total = 0;
  public search :ShareProduct;
  public shareProducts: Array<ShareProduct>;
  public copyProduct: ShareProduct;
  constructor(
    private errorResponseService:ErrorResponseService,
    private shareProductPublicService: ShareProductPublicService,
  ) { }

  ngOnInit() {
    this.shareProducts = [];
    this.search = new ShareProduct();
    this.search.status = "pending_check";
    this.copyProduct = new ShareProduct();
    this.getCheckProductList(1);
  }
  getCheckProductList(pageNo){
    this.pageNo = pageNo;
    this.shareProductPublicService.getCheckProductList(this.search,this.pageNo,this.pageSize)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.shareProducts = data.data.infos;
          this.total = data.data.total;
        }
      })
  }
  /*审核*/
  check(product){
    this.copyProduct = JSON.parse(JSON.stringify(product));
    $('#check').show();
  }
  /*提交审核意见*/
  submitCheck(){
    if(this.verifyEmpty(this.copyProduct.status,'status2')){
      if(this.copyProduct.status === "pending_check"){
        this.addErrorClass('status2','请填写审核意见');
      }else{
        this.shareProductPublicService.checkProduct(this.copyProduct)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
              });
              this.getCheckProductList(1);
              this.closeCheck();
            }
          });
      }
    }
  }
  closeCheck(){
    this.copyProduct = new ShareProduct();
    $('#check').hide();
  }
  /*非空验证*/
  verifyEmpty( value, id?){
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id,'该值不能为空');
      return false;
    }else{
      this.removeErrorClass(id);
      return true;
    }
  }
  /* 添加错误信息*/
  private addErrorClass(id: string, error: string)  {
    $('#' + id).addClass('red');
    $('#' + id).parent().next('.error').fadeIn().html(error);
  }
  /*去除错误信息*/
  private  removeErrorClass(id: string) {
    $('#' + id).removeClass('red');
    $('#' + id).parent().next('.error').fadeOut();
  }
}
