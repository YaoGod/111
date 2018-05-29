import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import { Vegetable } from '../../../../mode/vegetableInfo/vegetableInfo.service';
import { VegetableInfoService } from '../../../../service/vegetable-info/vegetable-info.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';

import * as $ from 'jquery';
import {UtilBuildingService} from "../../../../service/util-building/util-building.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
declare var $:any;
declare var confirmFunc: any;
declare var tinymce: any;
@Component({
  selector: 'app-vegetable',
  templateUrl: './vegetable.component.html',
  styleUrls: ['./vegetable.component.css'],
  providers: [VegetableInfoService,UtilBuildingService,ErrorResponseService]
})
export class VegetableComponent implements OnInit {

  public vegetables:Array<Vegetable>;
  public search: Vegetable;
  public days:string;
  private code: any;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public  vegetableView={
    code:'',
    vname: '',
    imgPath: '',
    detail:'',
    price: '',
    status: '',
    saletime: '',
    limitnum:'',
    stock:'',
    downDay:'',
    downTime:''
  };
  public  vegetableAdd={
    code:'',
    vname: '',
    imgPath: '',
    detail:'',
    price: '',
    status: '',
    saletime: '',
    limitnum:'',
    stock:'',
    downDay:'',
    downTime:''
  };
  public  vegetableUp={
    code:'',
    vname: '',
    imgPath: '',
    detail:'',
    price: '',
    status: '',
    saletime: '',
    limitnum:'',
    stock:'',
    downDay:'',
    downTime:''
  };
  constructor(private vegetableInfoService: VegetableInfoService,
              private errorVoid: ErrorResponseService,
              public ipSetting:IpSettingService) { }

  ngOnInit() {
    this.search = new Vegetable();
    this.pages = [];
    this.getVegetableList(1);
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

  getVegetableList(num){
    this.pageNo = num;
    this.vegetableInfoService.getVegetableList(this.pageNo,this.pageSize,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.vegetables = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  /*查看*/
  view(code:string){
    this.vegetableInfoService.getVegetable(code)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.vegetableView = data.data;
          $('.maskView').show();
        }
      })
  }
/*新增净菜*/
  public verifyvnewnane(id) {
    if (!this.isEmpty(id, '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyvprice(id) {
    let reg =/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
    if (!this.isEmpty(id, '不能为空')) {
      return false;
    }
    if(!reg.test($('#' + id).val())){
      this.addErrorClass(id, "请输入正确的价格");
      return false;
    }
    return true;
  }
  public verifystock(id) {
    if (!this.isEmpty(id, '不能为空')) {
      return false;
    }
    if(!this.verifyIsNumber(id, "请输入正确的库存数")){
      return false;
    }
    return true;
  }
  public verifyvnewLimitnum(id) {
    if (!this.isEmpty(id, '不能为空')) {
      return false;
    }
    if(!this.verifyIsNumber(id, "请输入整数份")){
      return false;
    }
    return true;
  }
  public verifyadddetail(id) {
    if (!this.isEmpty(id, '不能为空')) {
      return false;
    }
    return true;
  }
  addVegetable() {
    if (!this.verifyvnewnane('vnewnane')||!this.verifyvprice('vprice')||!this.verifystock('stock')||
      !this.verifyvnewLimitnum('vnewLimitnum')||!this.verifyadddetail('adddetail')) {
      return false;
    }
    this.getSaleTime(1);
    if(this.days==""){
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请选择预定时间！',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }
    this.vegetableAdd.saletime = this.days;
    this.vegetableInfoService.addVegetable(this.vegetableAdd)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': data['msg'],
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.closeMaskAdd();
          this.getVegetableList(1);
        }
      })
  }

  getSaleTime(type){
    this.days = "";
    if(type==1){
      for(var i=1;i<8;i++){
        if( $('#newsale'+i).hasClass("btn-danger2")){
              if(this.days==""){
                this.days = this.days + i;
              }else{
                this.days = this.days+ "、"+ i;
              }
        }
      }
    }
    if(type==2){
      for(var i=1;i<8;i++){
        if( $('#upsale'+i).hasClass("btn-danger2")){
          if(this.days==""){
            this.days = this.days + i;
          }else{
            this.days = this.days+ "、"+ i;
          }
        }
      }
    }
    if(this.days!=null && this.days !=""){
      this.days = this.days.replace("7","星期日");
      this.days = this.days.replace("6","星期六");
      this.days = this.days.replace("5","星期五");
      this.days = this.days.replace("4","星期四");
      this.days = this.days.replace("3","星期三");
      this.days = this.days.replace("2","星期二");
      this.days = this.days.replace("1","星期一");
    }
  }

  closeMaskView() {
    $('.maskView').hide();
  }
  /*查看end*/
  add() {
    $('.maskAdd').show();
    this.vegetableAdd.status = "1";
    this.vegetableAdd.limitnum = "1";
  }
  closeMaskAdd() {
    $('#prese1').val('');
    $('.errorMessage').html('');
    this.vegetableAdd={
      code:'',
      vname: '',
      imgPath: '',
      detail:'',
      price: '',
      status: '',
      saletime: '',
      limitnum:'',
      stock:'',
      downDay:'',
      downTime:''
    };
    for(let i=1;i<8;i++){
      $('#upsale'+i).removeClass("btn-danger2");
    }
    $('.maskAdd').hide();
  }
/*新增结束*/
/*修改*/
  update(code: string) {
    this.vegetableInfoService.getVegetable(code)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.vegetableUp = data.data;
          $('.maskUpdate').show();
          for(var i=1;i<8;i++){
            $('#upsale'+i).addClass("btn-danger1");
            $('#upsale'+i).removeClass("btn-danger2");
          }
          if(this.vegetableUp.saletime.indexOf("星期一")!=-1 ){
            $('#upsale1').addClass("btn-danger2");
            $('#upsale1').removeClass("btn-danger1");
          }
          if(this.vegetableUp.saletime.indexOf("星期二")!=-1 ){
            $('#upsale2').addClass("btn-danger2");
            $('#upsale2').removeClass("btn-danger1");
          }
          if(this.vegetableUp.saletime.indexOf("星期三")!=-1 ){
            $('#upsale3').addClass("btn-danger2");
            $('#upsale3').removeClass("btn-danger1");
          }
          if(this.vegetableUp.saletime.indexOf("星期四")!=-1 ){
            $('#upsale4').addClass("btn-danger2");
            $('#upsale4').removeClass("btn-danger1");
          }
          if(this.vegetableUp.saletime.indexOf("星期五")!=-1 ){
            $('#upsale5').addClass("btn-danger2");
            $('#upsale5').removeClass("btn-danger1");
          }
          if(this.vegetableUp.saletime.indexOf("星期六")!=-1 ){
            $('#upsale6').addClass("btn-danger2");
            $('#upsale6').removeClass("btn-danger1");
          }
          if(this.vegetableUp.saletime.indexOf("星期日")!=-1 ){
            $('#upsale7').addClass("btn-danger2");
            $('#upsale7').removeClass("btn-danger1");
          }
        }
      })
  }
  closeMaskUp() {
    $('.maskUpdate').hide();
    $('#prese2').val('');
    $('.errorMessage').html('');
  }
  /*编辑商品信息校验并提交*/
  public verifyupnewname(id) {
    if (!this.isEmpty(id, '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyvupprice(id) {
    let reg =/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
    if (!this.isEmpty(id, '不能为空')) {
      return false;
    }
    if(!reg.test($('#' + id).val())){
      this.addErrorClass(id, "请输入正确的价格");
      return false;
    }
    return true;
  }
  public verifystock1(id) {
    if (!this.isEmpty(id, '不能为空')) {
      return false;
    }
    if(!this.verifyIsNumber(id, "请输入正确的库存数")){
      return false;
    }
    return true;
  }
  public verifyvupLimitnum(id) {
    if (!this.isEmpty(id, '不能为空')) {
      return false;
    }
    if(!this.verifyIsNumber(id, "请输入整数份")){

      return false;
    }
    return true;
  }
  public verifyupdetail(id) {
    if (!this.isEmpty(id, '不能为空')) {
      return false;
    }
    return true;
  }
  updateVegetable() {
    if (!this.verifyupnewname('upnewname')||!this.verifyvupprice('vupprice')||!this.verifystock1('stock1') ||
      !this.verifyvupLimitnum('vupLimitnum')||!this.verifyupdetail('updetail')) {
      return false;
    }
      this.getSaleTime(2);
      if(this.days==""){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '请选择预定时间！',
          'popType': 0 ,
          'imgType': 2 ,
        });
        return false;
      }
      this.vegetableUp.saletime = this.days;
      if(this.vegetableUp.imgPath&&this.vegetableUp.imgPath.length>200){
        delete this.vegetableUp.imgPath;
      }
      this.vegetableInfoService.updateVegetable(this.vegetableUp)
        .subscribe(data => {
          if (this.errorVoid.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示' ,
              'mes': "修改成功",
              'popType': 0 ,
              'imgType': 1 ,
            });
            this.closeMaskUp();
            this.getVegetableList(1);
          }
        })
  }
/*修改结束*/

  /*删除*/
  delete(code: number) {
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除？',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        this.vegetableInfoService.deleteVegetable(code + '')
          .subscribe(data => {
            if (this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data['msg'],
                'popType': 0,
                'imgType': 1,
              });
            }
            this.getVegetableList(1);
          });
      }
    });
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
  /** 匹配数字 */
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
  /** 添加错误信息class */
  private  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /** 去除错误信息class */
  private  removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').removeClass('form-error');
    $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
    $('#' + id).next('span').html('');
  }
  /*新增页面文件图片上传*/
  prese_upload(files){
    var xhr = this.vegetableInfoService.uploadImg(files[0],'vegetableInfo',-3);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.vegetableAdd.imgPath = data.msg;
          confirmFunc.init({
            'title': '提示',
            'mes': '上传成功',
            'popType': 0,
            'imgType': 1,
          });
        }
      }else if(xhr.readyState === 4 && xhr.status === 413 ){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件大小超出限制',
          'popType': 0 ,
          'imgType': 2 ,
        });
      }
    };
  }
  /*修改文件图片上传*/
  prese_upload2(files){
    var xhr = this.vegetableInfoService.uploadImg(files[0],'vegetableInfo',-3);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.vegetableUp.imgPath = data.msg;
          confirmFunc.init({
            'title': '提示',
            'mes': '上传成功',
            'popType': 0,
            'imgType': 1,
          });
        }
      }else if(xhr.readyState === 4 && xhr.status === 413 ){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件大小超出限制',
          'popType': 0 ,
          'imgType': 2 ,
        });
      }
    };
  }

  /*跳页加载数据*/
  goPage(page:number){
    if(this.search==null){
      this.search = new Vegetable();
    }
    this.getVegetableList(page);
  }
}
