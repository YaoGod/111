import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "app/service/error-response/error-response.service";
import {IpSettingService} from "app/service/ip-setting/ip-setting.service";
import * as $ from 'jquery';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.css'],
  providers: [ErrorResponseService]
})
export class GoodsComponent implements OnInit {
  public ipServer: String;
  public goods:Array<Goods>;
  public search: Goods;
  public days:string;
  private code: any;
  private pageNo = 1;
  /*当前页码*/
  private pageSize = 5;
  public pages: Array<number>;
  public  goodsView = {
    code:'',
    name: '',
    image: '',
    detail:'',
    price: '',
    status: ''
  };
  public  goodsAdd = {
    code:'',
    name: '',
    image: '',
    detail:'',
    price: '',
    status: ''
  };
  public  goodsUp={
    code:'',
    name: '',
    image: '',
    detail:'',
    price: '',
    status: ''
  };
  constructor(private ipSetting: IpSettingService,private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.ipServer = this.ipSetting.ip;
    this.search = new Goods();
    this.pages = [];
    this.getGoodsList();
    $('.list-table dl').click(function () {
      $(this).addClass('blueself').siblings().removeClass('blueself').find('.ope-list').addClass('hid');
      $(this).find('.ope-list').removeClass('hid');
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

  /*
  * 获取商品列表
  * param: ,
  * return:
   */
  getGoodsList(){
    let url = '/goodsProduct/search?';
    if(typeof(this.search.name) == 'undefined'){
      url += 'pageNum=' + this.pageNo + '&pageSize=' + this.pageSize;
    }else {
      url += 'name=' + this.search.name + '&pageNum='
        + this.pageNo + '&pageSize=' + this.pageSize;
    }

    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.goods = data.data.list;
          this.initPage(data.data.pages);
        }
      });
  }

  /*
   查询该code的商品详情
   param: code:number,     #
   return:
   */
  view(code:string){
    let url = '/goodsProduct/detail?code=' + code;
    this.ipSetting.sendGet(url)
      .subscribe(data =>{
        if (data['status'] === 0) {
          this.goodsView = data.data;
          $('.maskView').show();
        }
      })
  }

  /*新增商品*/
  addGoods() {
    if (!this.verifyEmpty('newname','商品名称不能为空')||!this.verifyEmpty('price','价格不能为空')||!this.verifyEmpty('adddetail','商品详情不能为空')) {

    }
    let url = '/goodsProduct/save';
    this.ipSetting.sendPost(url,this.goodsAdd)
      .subscribe(data => {
        if(data['status'] === 0){
          alert(data['msg']);
          this.closeMaskAdd();
          this.getGoodsList();
        }else{
          alert(data['msg']);
          // this.closeMaskAdd();
        }
      })
  }

  closeMaskView() {
    $('.maskView').hide();
  }
  /*查看end*/
  add() {
    $('.maskAdd').show();
    this.goodsAdd.status = "1";
  }
  closeMaskAdd() {
    $('.maskAdd').hide();
    $('#prese1').val('');
  }
  /*新增结束*/


  /*修改*/
  update(code: string) {
    let url ='/goodsProduct/detail?code=' + code;
    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if(data['status']=== 0){
          this.goodsUp = data.data;
        }
        $('.maskUpdate').show();
      })
  }
  closeMaskUp() {
    $('.maskUpdate').hide();
    $('#prese').val('');
  }

  /*
   修改商品信息
   param: id:number,     #商品id
   return:
   */
  updateGoods() {
    if (!this.verifyEmpty('upnewname','净菜名称不能为空')||!this.verifyEmpty('upprice','价格不能为空')||!this.verifyEmpty('updetail','净菜详情不能为空')) {
    }
    let url = '/goodsProduct/save';
    this.ipSetting.sendPost(url,this.goodsUp)
      .subscribe(data => {
        if(data['status'] === 0){
          alert(data['msg']);
          this.closeMaskUp();
          this.getGoodsList();
        }else{
          alert(data['msg']);
          this.closeMaskUp();
        }
      })
  }
  /*修改结束*/


  /*删除*/

  delete(code: number) {
    this.code = code;
    $('.confirm').fadeIn();
  }

  /*删除*/
  /*
   删除商品信息
   param: id:number,
   return:
   */
  okFunc() {
    $('.confirm').hide();
    let url = '/goodsProduct/del?code=' + this.code;
    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data.status)) {
          alert(data.msg);
        }
        this.getGoodsList();
      });
  }
  noFunc() {
    $('.confirm').fadeOut();
  }
  private verifyEmpty(id,label) {

    if (!this.isEmpty(id, label)) {
      return false;
    }
    if(id=="newLimitnum"){
      var reg = /^[1-9]\d*$/;
      if(!reg.test($('#' + id).val())){
        this.addErrorClass(id, "请输入正确的数字");
        return true;
      }
    }
    if(id=="upLimitnum"){
      var reg = /^[1-9]\d*$/;
      if(!reg.test($('#' + id).val())){
        this.addErrorClass(id, "请输入正确的数字");
        return true;
      }
    }

    if(id=="price"){
      var reg =/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      if(!reg.test($('#' + id).val())){
        this.addErrorClass(id, "请输入正确的价格");
        return true;
      }
    }
    if(id=="upprice"){
      var reg =/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      if(!reg.test($('#' + id).val())){
        this.addErrorClass(id, "请输入正确的价格");
        return true;
      }
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
  private verifyProductPrice(id) {
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
  /*新增页面文件图片上传*/
  prese_upload(files){
    let url = '/goodsProduct/uploadImg/'+'goodsProduct';
    let xhr = this.ipSetting.uploadImg(url,files[0]);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){

          this.goodsAdd.image = data.msg;
          alert("上传成功");
        }
      }
    };
  }
  /*修改文件图片上传*/
  prese_upload2(files){
    let url = '/goodsProduct/uploadImg/'+'goodsProduct';
    let xhr = this.ipSetting.uploadImg(url,files[0]);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){

          this.goodsUp.image = data.msg;
          alert("上传成功");
        }
      }
    };
  }
  /*页码初始化*/
  initPage(total){
    this.pages = new Array(total);
    for(let i = 0;i< total ;i++){
      this.pages[i] = i+1;
    }
  }
  /*页面显示区间5页*/
  pageLimit(page:number){
    if(this.pages.length < 5){
      return false;
    } else if(page<=5 && this.pageNo <= 3){
      return false;
    } else if(page>=this.pages.length -4 && this.pageNo>=this.pages.length-2){
      return false;
    } else if (page<=this.pageNo+2 && page>=this.pageNo-2){
      return false;
    }
    return true;
  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    if(this.search==null){
      this.search = new Goods();
    }
    this.getGoodsList();
  }

}


export class Goods{
  id:                number;
  code:              string;/*商品编号*/
  name:             string;/*商品名称*/
  image:            string;/*商品图片*/
  detail:            string;/*商品详情*/
  price:             number;/*商品价格*/
  status:            string;/*商品状态*/
}
