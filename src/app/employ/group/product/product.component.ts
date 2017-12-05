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
  public groupProduct: GroupProduct;
  public search: GroupProduct;
  private code: any;
  private pageNo: number = 1;
  /*当前页码*/
  private pageSize: number = 6;
  public upGroupProduct={
    code: '',
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
  producttype: ''

}
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
    producttype: ''

  }
  constructor(private groupProductService: GroupProductService,
              private errorVoid: ErrorResponseService,) {
  }
  ngOnInit() {
    this.search = new GroupProduct();
    this.getProductList();
  }
  getProductList(){
    this.groupProductService.getProductList(this.pageNo,this.pageSize,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.groupProducts = data.data.infos;
      }
    });
  }
  fadeBom() {
    $('.mask').show();
  }
  closeMask() {
    $('.mask').hide();
    $('#prese').val('');
    this.newGroupProduct = {
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
      producttype: ''

    }
  }
  /*维修记录校验规则*/
  private verifyImage() {
    if (!this.isEmpty('image', '商品图片不能为空')) {
      return false;
    }
    return true;
  }
  private verifyName() {
    if (!this.isEmpty('name', '商品名称不能为空')) {
      return false;
    }
    return true;
  }
  private verifyProductPrice() {
    if (!this.isEmpty('price', '费用不能为空')) {
      return false;
    }
    if (!this.verifyIsNumber('price', '请输入正确的费用')) {
      return false;
    }
    return true;
  }
  private verifyStatus() {
    if (!this.isEmpty('status', '商品标签不能为空')) {
      return false;
    }
    return true;
  }
  private verifyBtime() {
    if (!this.isEmpty('startTime', '时间不能为空')) {
      return false;
    }
    return true;
  }
  private verifyEtime() {
    if (!this.isEmpty('endTime', '时间不能为空')) {
      return false;
    }
    return true;
  }
  private verifyContact() {
    if (!this.isEmpty('contact', '团购联系人不能为空')) {
      return false;
    }
    return true;
  }
  private verifyPhone()  {
    if (!this.isEmpty('phone', '联系电话不能为空')) {
      return false;
    }
    if (!this.verifyIsTel('phone', '请输入正确的手机号')) {
      return false;
    }
    return true;
  }
  private verifyPayaccount() {
    if (!this.isEmpty('payaccount', '收款账号不能为空')) {
      return false;
    }
    return true;
  }
  private verifyDetail() {
    if (!this.isEmpty('detail', '商品详情不能为空')) {
      return false;
    }
    return true;
  }
  /**非空校验*/
  private isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (data.toString().trim() === '')  {
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
      this.addErrorClass(id, '请填写正确手机号');
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
    if (!String(data).match(/^[0-9]*$/))  {
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
  }

  subGroupProduct() {
    if (this.newGroupProduct.image==''||this.newGroupProduct.name==''||this.newGroupProduct.price=='' || this.newGroupProduct.status=='' || this.newGroupProduct.startTime=='' ||
     this.newGroupProduct.endTime=='' || this.newGroupProduct.contact=='' || this.newGroupProduct.phone=='' || this.newGroupProduct.payaccount || this.newGroupProduct.detail=='') {
      alert("请把信息填写完整");
      return false;
    }
    this.groupProductService.addGroupBuyProduct(this.newGroupProduct)
      .subscribe(data => {
        if(data['status'] === 0){
          alert("新增成功")
          /* confirmFunc.init({
           'title': '提示' ,
           'mes': '新增成功',
           });*/
          this.closeMask();
          this.getProductList();
        }else{
          alert("新增失败")
          this.closeMask();
          /* confirmFunc.init({
           'title': '提示' ,
           'mes': data['msg'],
           });*/
        }
      })
  }

  /*删除*/
  okFunc() {
    $('.confirm').hide();
    this.groupProductService.deleteGroupbuyProduct(this.code)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data.status)) {
          alert("删除成功");
        }
        this.getProductList();
      });
  }

  noFunc() {
    $('.confirm').fadeOut();
  }

  delete(code: number) {
    /*let d = confirm("是否删除该大楼");
     if(d){

     }*/
    this.code = code;
    $('.confirm').fadeIn();
  }

  update(code: string) {
    this.groupProductService.getGroupProduct(code)
      .subscribe(data => {
        if(data['status']==0){
          //this.updateNotice = data.data;
          console.log(data.data);
          this.upGroupProduct.image=data.data.image;
          this.upGroupProduct.code  = data.data.code;
          this.upGroupProduct.name = data.data.name;
          this.upGroupProduct.price = data.data.price;
          this.upGroupProduct.detail = data.data.detail;
          this.upGroupProduct.startTime=data.data.startTime;
          this.upGroupProduct.endTime=data.data.endTime;
          this.upGroupProduct.contact=data.data.contact;
          this.upGroupProduct.phone=data.data.phone;
        }
        $('.mask2').show();
      })
  }
  updateGroupProduct() {
    if (!this.verifyImage()||!this.verifyName() ||!this.verifyProductPrice() || !this.verifyStatus() || !this.verifyBtime() ||
      !this.verifyEtime() || !this.verifyContact() || !this.verifyPhone() || !this.verifyPayaccount() ||
      !this.verifyDetail()) {
      alert("请把信息填完整")
      return false;
    }
    this.groupProductService.updateGroupbuyProduct(this.upGroupProduct)
      .subscribe(data => {
        console.log(data);
        if(data['status'] === 0){
          alert("修改成功")
          /* confirmFunc.init({
           'title': '提示' ,
           'mes': '新增成功',
           });*/
          this.closeMask2();
          this.getProductList();
        }else{
          alert("修改失败")
          this.closeMask2();
          /* confirmFunc.init({
           'title': '提示' ,
           'mes': data['msg'],
           });*/
        }
      })
  }
  view(code:string){
    this.groupProductService.getGroupProduct(code)
      .subscribe(data => {
        if (data['status']==0) {
          this.upGroupProduct = data.data;
        }
        $('.mask3').show();
      })
  }
  closeMask2() {
    $('.mask2').hide();
    $('#prese').val('');
    this.upGroupProduct = {
      code: '',
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
      producttype: ''
    }
  }

  closeMask3() {
    $('.mask3').hide();
  }
  /*文件图片上传*/
  prese_upload(files,index){
    var xhr = this.groupProductService.uploadImg(files[0],'group',-2);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){
          this.newGroupProduct.image = data.msg;
          alert("上传成功");
        }
      }
    };
  }
  /*修改文件图片上传*/
  prese_upload2(files,index){
    var xhr = this.groupProductService.uploadImg(files[0],'group',-2);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){
          this.upGroupProduct.image = data.msg;
          alert("上传成功");
        }
      }
    };
  }


}
