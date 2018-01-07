import { Component, OnInit } from '@angular/core';
import { GroupProduct } from '../../../mode/groupProduct/group-product.service';
import { GroupProductService } from '../../../service/group-product/group-product.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import * as $ from 'jquery';
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
declare var $:any;
declare var confirmFunc: any;
declare var tinymce: any;
@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css'],
  providers: [GroupProductService,UtilBuildingService,ErrorResponseService]
})
export class CheckComponent implements OnInit {
  public groupProducts: Array<GroupProduct>;
  public search: GroupProduct;
  private code: any;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public  productCheck={
    code:'',
    status:'',
    checkStatus: '',
    checkResult:''
  };

  constructor(private groupProductService: GroupProductService,
              private errorVoid: ErrorResponseService,) {
  }
  ngOnInit() {
    this.search = new GroupProduct();
    this.pages = [];
    this.getProductList();
  }
  getProductList(){
    this.search.status = '0';
    this.search.checkStatus='0';
    this.groupProductService.getProductList(this.pageNo,this.pageSize,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.groupProducts = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  fadeBom() {
    $('.mask').show();
  }
  closeMask() {
    $('.mask').hide();
    $('#prese1').val('');
  }
  private verifyEmpty(id,label) {
    if (!this.isEmpty(id, label)) {
      return false;
    }else{
      return true;
    }
  }


  /**非空校验*/
  private isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (data==null||data==''||data.trim() === '')  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /**
   * 添加错误信息class
   * @param id
   * @param error
   */
  private  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /**
   * 去除错误信息class
   * @param id
   */
  private  removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').removeClass('form-error');
    $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
    $('#' + id).next('span').html('');
  }

  check(code: string){
    this.groupProductService.getGroupProduct(code)
      .subscribe(data => {
        if(data['status']==0){
          this.productCheck = data.data;
          this.productCheck.checkStatus = '1';
          console.log(data.data);
        }
        $('.mask0').show();
      })
  }


  checkGroupProduct() {
    if (!this.verifyEmpty('checknewesetail','审核意见不能为空')){
      return false;
    }
    if(this.productCheck.checkStatus =='1' ){
      this.productCheck.status = '1';
    }
    this.groupProductService.checkGroupbuyProduct(this.productCheck)
      .subscribe(data => {
        if(data['status'] === 0){
          alert("保存成功");
          this.closeMask0();
          this.getProductList();
        }else{
          alert("保存失败")
          this.closeMask0();
        }
      })
  }

  closeMask0() {
    $('.mask0').hide();
  }

  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    if(this.search==null){
      this.search = new GroupProduct();
    }
    this.getProductList();
  }
}
