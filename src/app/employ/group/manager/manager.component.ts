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
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css'],
  providers: [GroupProductService,UtilBuildingService,ErrorResponseService]
})
export class ManagerComponent implements OnInit {
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
  public imgUrl: Array<string>;
  public open = false;
  public upGroupProduct={
    code:'',
    name: '',
    imgPath: '',
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
    shipping:'',
    imgPathList:[]
  };

  public upStatusProduct={
      code:'',
      status:''
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
    this.getProductList();
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
            if(this.catas[i].routeUrl === "employ/group/manager"){
              this.rule = this.catas[i];
            }
          }
        }
      })
  }
  getProductList(){
    this.search.checkStatus = '1';
    this.groupProductService.getProductList(this.pageNo,this.pageSize,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.groupProducts = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  updateStatus(code,status){
    this.upStatusProduct.status = status;
    this.upStatusProduct.code = code;
    this.groupProductService.updateStatus(this.upStatusProduct)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data['msg'],
            'popType': 0,
            'imgType': 1,
          });
          this.getProductList();
        }
      })
  }

  fadeBom() {
    $('.mask').show();
  }
  closeMask() {
    $('.errorMessage').html('');
    $('.mask').hide();
    $('#prese1').val('');
  }
  public verifyEmpty(id,label) {

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
  public verifyProductPrice(id) {
    if (!this.verifyIsNumber(id, '请输入正确的费用格式')) {
      return false;
    }
    return true;
  }

  public verifyPhone(id)  {
    if (!this.verifyIsTel(id, '请输入正确的手机号')) {
      return false;
    }
    return true;
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
   * 验证手机号码
   * @return
   */
  public verifyIsTel(id: string, error?: string): boolean {
    const data =  $('#' + id).val();/*/^1(3[4-9]|5[0-2]|8[0-3,78])\d{8}$/ 移动号段*/
    if (!String(data).match( /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/ ))  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /** 匹配数字 */
  public verifyIsNumber(id: string, error: string): boolean  {
    const data =  $('#' + id).val();// /^[0-9]*$/
    if (!String(data).match(/^[1-9]\d(\.\d+){0,2}$/))  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /** 添加错误信息class */
  public  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).siblings('span').html('输入错误');
    }else {
      $('#' + id).siblings('span').html(error);
    }
  }
  /** 去除错误信息class */
  public  removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').removeClass('form-error');
    $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
    $('#' + id).siblings('span').html('');
  }
  /** 点击修改*/
  update(code: string) {
    this.groupProductService.getGroupProduct(code)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.open = true;
          this.upGroupProduct = data.data;
          this.imgUrl = this.upGroupProduct.imgPath.split(';');
          $('.mask2').show();
        }
      })
  }

  updateGroupProduct() {
    if (!this.verifyEmpty('upnewname','名称不能为空')||!this.verifyEmpty('upnewprice','不能为空')||!this.verifyEmpty('upnewstartTime'
        ,'不能为空')|| !this.verifyEmpty('upnewendTime','不能为空')||!this.verifyEmpty('upnewpconcant','联系人不能为空')||
      !this.verifyEmpty('upnewphone','不能为空')|| !this.verifyEmpty('upnewpayaccount','收款账户不能为空')||!this.verifyEmpty(
        'upnewesetail','商品详情不能为空')) {
      return false;
    }
    let postdata = JSON.parse(JSON.stringify(this.upGroupProduct));
    if(postdata.startTime > postdata.endTime){
      this.addErrorClass('upnewendTime', '结束时间不能早于开始时间');
      return false;
    }
    postdata.imgPath = '';
    for(let i=0;i<this.imgUrl.length;i++){
      postdata.imgPath += this.imgUrl[i] + ';'
    }
    this.groupProductService.updateGroupbuyProduct(postdata)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data['msg'],
            'popType': 0,
            'imgType': 1,
          });
          this.closeMask2();
          this.getProductList();
        }
      })
  }
  closeMask2() {
    $('.errorMessage').html('');
    $('.mask2').hide();
    $('#prese1,#prese2,#prese3').val('');
  }

  /*修改文件图片上传*/
  prese_upload2(files,index){
    let xhr = this.groupProductService.uploadImg(files[0],'group',-2);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.imgUrl[index] = data.msg;
          confirmFunc.init({
            'title': '提示',
            'mes':'上传成功',
            'popType': 0,
            'imgType': 1,
          });
        }else {
          $("#prese1,#prese2,#prese3").val("");
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
