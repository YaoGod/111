import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "app/service/error-response/error-response.service";
import {IpSettingService} from "app/service/ip-setting/ip-setting.service";
import * as $ from 'jquery';
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
declare var confirmFunc:any;

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.css'],
  providers: [ErrorResponseService]
})
export class GoodsComponent implements OnInit {
  public rule;
  public catas;
  public ipServer: String;
  public goods:Array<Goods>;
  public search: Goods;
  private code: any;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public  goodsView = {
    code:'',
    name: '',
    imgPath: '',
    detail:'',
    price: '',
    status: ''
  };
  public  goodsAdd = {
    code:'',
    name: '',
    imgPath: '',
    detail:'',
    price: '',
    status: ''
  };
  public  goodsUp={
    code:'',
    name: '',
    imgPath: '',
    detail:'',
    price: '',
    status: ''
  };
  constructor(
    public ipSetting: IpSettingService,
    private errorVoid: ErrorResponseService,
    private globalCatalogService: GlobalCatalogService) { }

  ngOnInit() {
    this.getRule();
    this.ipServer = this.ipSetting.ip;
    this.search = new Goods();
    this.pages = [];
    this.getGoodsList(1);
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'market','employ/market/reserve')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;
          for(let i = 0;i<this.catas.length;i++){
            if(this.catas[i].routeUrl === "employ/market/reserve/goods"){
              this.rule = this.catas[i];
            }
          }
        }
      })
  }

  chang(value) {
    if( $("#"+value).hasClass("btn-danger1")){
      $("#"+value).removeClass("btn-danger1");
      $("#"+value).addClass("btn-danger2");
    }else{
      $("#"+value).removeClass("btn-danger2");
      $("#"+value).addClass("btn-danger1");
    }
  }

  /** 获取商品列表*/
  getGoodsList(num){
    this.pageNo = num;
    let url = '/goodsProduct/search?';
    if(typeof(this.search.name) == 'undefined'){
      url += 'pageNum='+ this.pageNo +'&pageSize='+ this.pageSize;
    }else {
      url += 'name='+ this.search.name +'&pageNum='+ this.pageNo + '&pageSize=' + this.pageSize;
    }
    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.goods = data.data.list;
          this.total = data.data.total;
        }
      });
  }
  /**点击新增*/
  add() {
    $('.maskAdd').show();
    this.goodsAdd.status = "1";
  }
  /**新增提交*/
  addGoods() {
    if (!this.verifyEmpty('newcode','商品编码不能为空')|| !this.verifyEmpty('newname','商品名称不能为空') ||
      !this.verifyEmpty('price','价格不能为空') || !this.verifyEmpty('adddetail','商品详情不能为空')) {
      return false;
    }
    let url = '/goodsProduct/save';
    this.ipSetting.sendPost(url,this.goodsAdd)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': data['msg'],
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.closeMaskAdd();
          this.getGoodsList(1);
        }
      })
  }
  /**关闭新增*/
  closeMaskAdd() {
    $('.maskAdd').hide();
    $('.errorMessage').html('');
    $('#prese1').val('');
    this.goodsAdd = {
      code:'',
      name: '',
      imgPath: '',
      detail:'',
      price: '',
      status: ''
    };
  }
  /**查询该code的商品详情*/
  view(code:string){
    let url = '/goodsProduct/detail?code=' + code;
    this.ipSetting.sendGet(url)
      .subscribe(data =>{
        if (this.errorVoid.errorMsg(data)) {
          this.goodsView = data.data;
          $('.maskView').show();
        }
      })
  }
  /**关闭查看*/
  closeMaskView() {
    $('.maskView').hide();
  }
  /**点击修改*/
  update(code: string) {
    $('.maskUpdate').show();
    let url ='/goodsProduct/detail?code=' + code;
    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.goodsUp = data.data;
        }
      })
  }
  /**关闭修改*/
  closeMaskUp() {
    $('.maskUpdate').hide();
    $('#prese2').val('');
  }
  /**修改商品信息提交*/
  updateGoods() {
    if (!this.verifyEmpty('upnewcode','商品编码不能为空') || !this.verifyEmpty('upnewname','商品名称不能为空') ||
      !this.verifyEmpty('upprice','价格不能为空')||!this.verifyEmpty('updetail','商品详情不能为空')) {
    }
    let url = '/goodsProduct/save';
    if(this.goodsUp&&this.goodsUp.imgPath.length>240){
      delete this.goodsUp.imgPath;
    }
    this.ipSetting.sendPost(url,this.goodsUp)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': data['msg'],
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.closeMaskUp();
          this.getGoodsList(1);
        }
      })
  }
  /**修改结束*/


  /**删除商品*/
  delete(code: number) {
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除？',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        let url = '/goodsProduct/del?code=' + code;
        this.ipSetting.sendGet(url).subscribe(data => {
            if (this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data['msg'],
                'popType': 0,
                'imgType': 1,
              });
              this.pages = [];
              this.getGoodsList(1);
            }
          });
      }
    });
  }

  public verifyEmpty(id,label) {

    if (!this.isEmpty(id, label)) {
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
  public verifyProductPrice(id) {
    if (!this.verifyIsNumber(id, '请输入正确的费用格式')) {
      return false;
    }
    return true;
  }
  /**
   * 匹配数字
   * @param id
   * @param error
   * @returns {boolean}
   */
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
  public removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').removeClass('form-error');
    $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
    $('#' + id).next('span').html('');
  }
  /*新增页面文件图片上传*/
  prese_upload(files){
    let url = '/employee/util/uploadImg/goodsProduct/-1';
    let xhr = this.ipSetting.uploadImg(url,files[0])
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.goodsAdd.imgPath = data.msg;
          confirmFunc.init({
            'title': '提示',
            'mes': '上传成功',
            'popType': 0,
            'imgType': 1,
          });
        }
      }else if (xhr.readyState === 4 && xhr.status === 413){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件太大',
          'popType': 0 ,
          'imgType': 2,
        });
        $('#prese1').val('');
      }
    };
  }
  /*修改文件图片上传*/
  prese_upload2(files){
    let url = '/employee/util/uploadImg/goodsProduct/-1';
    let xhr = this.ipSetting.uploadImg(url,files[0]);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.goodsUp.imgPath = data.msg;
          confirmFunc.init({
            'title': '提示' ,
            'mes': '上传成功',
            'popType': 0 ,
            'imgType': 1,
          });
        }
      }else if (xhr.readyState === 4 && xhr.status === 413){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件太大',
          'popType': 0 ,
          'imgType': 2,
        });
        $('#prese2').val('');
      }
    };
  }
  /*跳页加载数据*/
  goPage(page:number){
    if(this.search==null){
      this.search = new Goods();
    }
    this.getGoodsList(page);
  }
}

export class Goods{
  id:                number;
  code:              string;/*商品编号*/
  name:             string;/*商品名称*/
  imgPath:            string;/*商品图片*/
  detail:            string;/*商品详情*/
  price:             number;/*商品价格*/
  status:            string;/*商品状态*/
}
