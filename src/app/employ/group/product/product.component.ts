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
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [GroupProductService,UtilBuildingService,ErrorResponseService]
})
export class ProductComponent implements OnInit {
  public groupProducts: Array<GroupProduct>;
  public search: GroupProduct;
  private code: any;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public  productview={
    code:'',
    name: '',
    image: '',
    detail:'',
    price: '',
    status: '',
    startTime: '',
    endTime:'',
    contact:'',
    phone: '',
    payaccount:'',
    label:'',
    producttype: ''
  };
  public upGroupProduct={
    code:'',
    name: '',
    image: '',
    detail:'',
    price: '',
    status: '',
    startTime: '',
    endTime:'',
    contact:'',
    phone:    '',
    payaccount:'',
    label:  '',
    producttype: '',
    checkStatus:''
  };
  public newGroupProduct={
    name: '',
    image: '',
    detail:'',
    price: '',
    status: '',
    startTime: '',
    endTime:'',
    contact:'',
    phone:    '',
    payaccount:'',
    label:  '',
    producttype: '',
    checkStatus:''
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
    this.groupProductService.getProductList(this.pageNo,this.pageSize,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        // console.log(data);
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
      if(id=="upprice"){
        return  this.verifyProductPrice(id);
      }
      if(id=="upphone"){
        return this.verifyPhone(id);
      }
      return true;
    }
  }
  private verifyProductPrice(id) {
    if (!this.verifyIsNumber(id, '请输入正确的费用格式')) {
      return false;
    }
    return true;
  }

  private verifyPhone(id)  {
    if (!this.verifyIsTel(id, '请输入正确的手机号')) {
      return false;
    }
    return true;
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
   * 验证手机号码
   * @return
   */
  private verifyIsTel(id: string, error?: string): boolean {
    const data =  $('#' + id).val();/*/^1(3[4-9]|5[0-2]|8[0-3,78])\d{8}$/ 移动号段*/
    if (!String(data).match( /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/ ))  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /**
   * 匹配数字
   * @param id
   * @param error
   * @returns {boolean}
   */
  private verifyIsNumber(id: string, error: string): boolean  {
    const data =  $('#' + id).val();// /^[0-9]*$/
    if (!String(data).match(/^[1-9]\d(\.\d+){0,2}$/))  {
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

  subGroupProduct() {


    if (!this.verifyEmpty('newname','名称不能为空')||!this.verifyEmpty('newprice','不能为空')||!this.verifyEmpty('newstartTime'
        ,'不能为空')|| !this.verifyEmpty('newendTime','不能为空')||!this.verifyEmpty('newpconcant','不能为空')||
      !this.verifyEmpty('newphone','不能为空')|| !this.verifyEmpty('newpayaccount','收款账户不能为空')||!this.verifyEmpty(
        'newesetail','商品详情不能为空')) {
      return false;
    }
    if(this.newGroupProduct.startTime > this.newGroupProduct.endTime){
      this.addErrorClass('newendTime', '结束时间不能早于开始时间');
      return false;
    }
    this.newGroupProduct.checkStatus = '0';
    this.groupProductService.addGroupBuyProduct(this.newGroupProduct)
      .subscribe(data => {
        if(data['status'] === 0){
          confirmFunc.init({
            'title': '提示',
            'mes': data['msg'],
            'popType': 0,
            'imgType': 1,
          });
          this.closeMask();
          this.getProductList();
        }else{
          confirmFunc.init({
            'title': '提示',
            'mes': data['msg'],
            'popType': 0,
            'imgType': 2,
          });
          this.closeMask();
        }
      })
  }

  update(code: string) {
    this.groupProductService.getGroupProduct(code)
      .subscribe(data => {
        if(data['status']===0){
          this.upGroupProduct = data.data;
        }
        $('.mask2').show();
      })
  }

  updateGroupProduct() {

    if (!this.verifyEmpty('upnewname','名称不能为空')||!this.verifyEmpty('upnewprice','不能为空')||!this.verifyEmpty('upnewstartTime'
        ,'不能为空')|| !this.verifyEmpty('upnewendTime','不能为空')||!this.verifyEmpty('upnewpconcant','联系人不能为空')||
      !this.verifyEmpty('upnewphone','不能为空')|| !this.verifyEmpty('upnewpayaccount','收款账户不能为空')||!this.verifyEmpty(
        'upnewesetail','商品详情不能为空')) {
      return false;
    }
    if(this.upGroupProduct.startTime > this.upGroupProduct.endTime){
      this.addErrorClass('upnewendTime', '结束时间不能早于开始时间');
      return false;
    }
    this.groupProductService.updateGroupbuyProduct(this.upGroupProduct)
      .subscribe(data => {
        console.log(data);
        if(data['status'] === 0){
          confirmFunc.init({
            'title': '提示',
            'mes': data['msg'],
            'popType': 0,
            'imgType': 1,
          });
          this.closeMask2();
          this.getProductList();
        }else{
          confirmFunc.init({
            'title': '提示',
            'mes': data['msg'],
            'popType': 0,
            'imgType': 2,
          });
          this.closeMask2();
        }
      })
  }

  view(code:string){
    this.groupProductService.getGroupProduct(code)
      .subscribe(data => {
        if (data['status']==0) {
          this.productview = data.data;
          console.log(this.productview);
          $('.mask3').show();
        }

      })
  }
  closeMask2() {
    $('.mask2').hide();
    $('#prese').val('');
  }
  closeMask0() {
    $('.mask0').hide();
    $('#prese0').val('');
  }
  closeMask3() {
    $('.mask3').hide();
  }
  /*文件图片上传*/
  prese_upload(files,index){
    let  xhr = this.groupProductService.uploadImg(files[0],'group',-2);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){
          this.newGroupProduct.image = data.msg;
          alert("上传成功");
        }
      }
    };
  }
  /*修改文件图片上传*/
  prese_upload2(files,index){
    let xhr = this.groupProductService.uploadImg(files[0],'group',-2);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){
          this.upGroupProduct.image = data.msg;
          alert("上传成功");
        }
      }
    };
  }

  /*删除商品*/
  delete(index) {
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        this.groupProductService.deleteGroupbuyProduct(index)
          .subscribe(data => {
            if (this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data['msg'],
                'popType': 0,
                'imgType': 1,
              });
              this.pages = [];
              this.pageNo = 1;
            }
            this.getProductList();
          });
      }
    });
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
