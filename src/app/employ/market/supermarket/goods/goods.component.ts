import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {SupermarketProduct} from "../../../../mode/supermarketProduct/supermarket-product.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {SupermarketApplier} from "../../../../mode/supermarketApplier/supermarket-applier.service";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
declare var confirmFunc:any;
@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.css'],
  providers: [SupermarketManagerService,SupermarketManagerService,ErrorResponseService]
})
export class GoodsComponent implements OnInit {
  public rule;
  public catas;
  public products     : Array<SupermarketProduct>;
  public applierList  : Array<SupermarketApplier>;
  public categories   : Array<SupermarketCategory>;
  public search       : SupermarketProduct;
  private code        : any;
  public pageNo       : number = 1;
  public pageSize     : number = 5;
  public total        : number = 0;
  public  productView : SupermarketProduct;
  public  productAdd  : SupermarketProduct;
  public  productUp   : SupermarketProduct;
  constructor(private marketManagerService: SupermarketManagerService,
              private errorVoid: ErrorResponseService,
              private globalCatalogService: GlobalCatalogService,
              public ipSetting  : IpSettingService) { }

  ngOnInit() {
    this.getRule();
    this.search = new SupermarketProduct();
    this.search.applier = "";
    this.search.stype = "";
    this.productView = new SupermarketProduct();
    this.productAdd = new SupermarketProduct();
    this.productUp = new SupermarketProduct();
    this.getSupermarketList(1);
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'market','employ/market/supermarket')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;
          for(let i = 0;i<this.catas.length;i++){
            if(this.catas[i].routeUrl === "employ/market/supermarket/supermarketProduct"){
              this.rule = this.catas[i];
            }
          }
        }
      })
  }

  getSupermarketList(pageNo){
    this.pageNo = pageNo;
    this.marketManagerService.getSupermarketList(this.pageNo,this.pageSize,this.search)
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.products = data.data.infos;
        this.applierList = data.data.applierList;
        this.categories = data.data.categories;
        this.total = data.data.total;
      }
    });
  }
  /*新增商品*/
  addProduct() {
     if(!this.verifyEmpty("sname_add","商品名称不能为空")){
       return false;
     }
    if(!this.verifyEmpty("price_add","价格不能为空")){
      return false;
    }
    if(!this.verifyEmpty("detail_add","商品详情不能为空")){
      return false;
    }
    if(!this.verifyEmpty("supplierId_add","供应商不能为空")){
      return false;
    }
    if(!this.verifyEmpty("stype_add","商品类型不能为空")){
      return false;
    }
    if(!this.verifyEmpty("code_add","商品编码不能为空")){
      return false;
    }
    /*if(this.productAdd.simage==null||this.productAdd.simage===""){
      confirmFunc.init({
        'title': '提示',
        'mes': "请上传图片！",
        'popType': 0,
        'imgType': 2,
      });
       return false;
    }*/
    this.marketManagerService.addMarketProduct(this.productAdd)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          confirmFunc.init({
            'title': '提示',
            'mes': data.data,
            'popType': 0,
            'imgType': 1,
          });
          this.closeMaskAdd();
          this.getSupermarketList(1);
        }
      })
  }
  /*修改*/
  updateProduct() {
    if(!this.verifyEmpty("sname_edit","商品名称不能为空")){
      return false;
    }
    if(!this.verifyEmpty("price_edit","价格不能为空")){
      return false;
    }
    if(!this.verifyEmpty("detail_edit","商品详情不能为空")){
      return false;
    }
    if(!this.verifyEmpty("supplierId_edit","供应商不能为空")){
      return false;
    }
    if(!this.verifyEmpty("stype_edit","商品类型不能为空")){
      return false;
    }
    if(!this.verifyEmpty("code_edit","商品编码不能为空")){
      return false;
    }
    if(this.productUp.simage==null||this.productUp.simage===""){
      confirmFunc.init({
        'title': '提示',
        'mes': "请上传图片！",
        'popType': 0,
        'imgType': 2,
      });
      return false;
    }
    this.marketManagerService.updateProduct(this.productUp)
      .subscribe(data => {

        if(this.errorVoid.errorMsg(data)){
          confirmFunc.init({
            'title': '提示',
            'mes': data.data,
            'popType': 0,
            'imgType': 1,
          });
          this.closeMaskUp();
          this.getSupermarketList(1);
        }
      })
  }
  /*查看*/
  view(code){
    this.marketManagerService.getMarketProduct(code)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.productView = data.data;
          $('.maskView').show();
        }

      })
  }
  /*修改*/
  update(code: string) {
    this.marketManagerService.getMarketProduct(code)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          this.productUp = data.data;
        }
        $('.maskUpdate').show();
      });
  }

  closeMaskUp() {
    $('.maskUpdate').hide();
    $('#prese').val('');
    $('.errorMessage').html('');
    this.productUp =  new SupermarketProduct();
  }
  closeMaskView(){
    $('.maskView').hide();
  }
  /*删除*/
  deleteGoods(id) {
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除此条数据？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        this.marketManagerService.deletetProduct(id)
          .subscribe(data => {
            if (this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': "删除成功！",
                'popType': 0,
                'imgType': 1,
              });
              this.getSupermarketList(1);
            }
          });
      }
    });
  }
  add() {
    $('.maskAdd').show();
    this.productAdd.pstatus = "1";
    this.productAdd.leftstatus="1";
  }
  closeMaskAdd() {
    $('.maskAdd').hide();
    $('#prese1').val('');
    $('.errorMessage').html('');
    this.productAdd = new SupermarketProduct();
  }
  /*新增页面文件图片上传*/
  prese_upload(files){
    var xhr = this.marketManagerService.uploadImg(files[0],'supermarket',-4);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){

          this.productAdd.simage = data.msg;
          confirmFunc.init({
            'title': '提示',
            'mes': "上传成功",
            'popType': 0,
            'imgType': 1,
          });
        }
      }
    };
  }
  /*修改文件图片上传*/
  prese_upload2(files){
    var xhr = this.marketManagerService.uploadImg(files[0],'supermarket',-4);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){

          this.productUp.simage = data.msg;
          confirmFunc.init({
            'title': '提示',
            'mes': "上传成功",
            'popType': 0,
            'imgType': 1,
          });
        }
      }
    };
  }
  public checkPrice(id){
      var reg =/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      if(!reg.test($('#' + id).val())){
        this.addErrorClass(id, "请输入正确的价格");
        return true;
      }
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
  if (data==null||data===''||data.trim() === '')  {
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
}

export class SupermarketCategory {
  cid:number;
  cname:string;
}
