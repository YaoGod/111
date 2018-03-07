import { Component, OnInit } from '@angular/core';
import { GroupProduct } from '../../../mode/groupProduct/group-product.service';
import { GroupProductService } from '../../../service/group-product/group-product.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import * as $ from 'jquery';
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
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
  public catas;
  public rule;
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
              private globalCatalogService: GlobalCatalogService,
              private errorVoid: ErrorResponseService,
              public ipSetting  : IpSettingService) {
  }
  ngOnInit() {
    this.getRule();
    this.search = new GroupProduct();
    this.pages = [];
    this.getProductList(1);
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'group','employ/group')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;
          for(let i = 0;i<this.catas.length;i++){
            if(this.catas[i].routeUrl === "employ/group"){
              this.catas.splice(i,1);
              i = 0;
            }
            if(this.catas[i].routeUrl === "employ/group/check"){
              this.rule = this.catas[i];
            }
          }
        }
      })
  }
  getProductList(num){
    this.pageNo = num;
    this.search.status = '0';
    this.search.checkStatus='0';
    this.groupProductService.getProductList(this.pageNo,this.pageSize,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
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
  public verifyEmpty(id,label) {
    if (!this.isEmpty(id, label)) {
      return false;
    }else{
      return true;
    }
  }


  /**非空校验*/
  public isEmpty(id: string, error: string): boolean  {
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
  public  addErrorClass(id: string, error?: string)  {
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
  public  removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').removeClass('form-error');
    $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
    $('#' + id).next('span').html('');
  }

  check(code: string){
    this.groupProductService.getGroupProduct(code)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.productCheck = data.data;
          this.productCheck.checkStatus = '1';
          $('.mask0').show();
        }
      })
  }


  checkGroupProduct() {
    if (!this.verifyEmpty('checknewesetail','审核意见不能为空')){
      return false;
    }
    if(this.productCheck.checkStatus ==='1' ){
      this.productCheck.status = '1';
    }
    this.groupProductService.checkGroupbuyProduct(this.productCheck)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': data['msg'],
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.closeMask0();
          this.getProductList(1);
        }
      })
  }

  closeMask0() {
    $('.mask0').hide();
  }

  /*跳页加载数据*/
  goPage(page:number){
    if(this.search==null){
      this.search = new GroupProduct();
    }
    this.getProductList(page);
  }
}
