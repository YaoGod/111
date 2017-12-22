import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import { Vegetable } from '../../../../mode/vegetableInfo/vegetableInfo.service';
import { VegetableInfoService } from '../../../../service/vegetable-info/vegetable-info.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';

import * as $ from 'jquery';
import {UtilBuildingService} from "../../../../service/util-building/util-building.service";
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
  private pageNo: number = 1;
  /*当前页码*/
  private pageSize: number = 5;
  public pages: Array<number>;
  public  vegetableView={
    code:'',
    vname: '',
    vimage: '',
    detail:'',
    price: '',
    status: '',
    saletime: '',
    limitnum:''
  };
  public  vegetableAdd={
    code:'',
    vname: '',
    vimage: '',
    detail:'',
    price: '',
    status: '',
    saletime: '',
    limitnum:''
  };
  public  vegetableUp={
    code:'',
    vname: '',
    vimage: '',
    detail:'',
    price: '',
    status: '',
    saletime: '',
    limitnum:''
  };
  constructor(private vegetableInfoService: VegetableInfoService,
              private errorVoid: ErrorResponseService,) { }

  ngOnInit() {
    this.search = new Vegetable();
    this.pages = [];
    this.getVegetableList();
    $('.list-table dl').click(function () {
      $(this).addClass('blueself').siblings().removeClass('blueself').find('.ope-list').addClass('hid');
      $(this).find('.ope-list').removeClass('hid');
    })
  }

chang(value) {
   console.log(value)
  if( $("#"+value).hasClass("btn-danger1")){
    $("#"+value).removeClass("btn-danger1");
    $("#"+value).addClass("btn-danger2");
  }else{
    $("#"+value).removeClass("btn-danger2");
    $("#"+value).addClass("btn-danger1");
  }
}

  getVegetableList(){
    this.vegetableInfoService.getVegetableList(this.pageNo,this.pageSize,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.vegetables = data.data.infos;
        let total = Math.ceil(data.data.total / this.pageSize);
        this.initPage(total);
      }
    });
  }
  /*查看*/
  view(code:string){
    this.vegetableInfoService.getVegetable(code)
      .subscribe(data => {
        if (data['status']==0) {
          this.vegetableView = data.data;
          $('.maskView').show();
        }

      })
  }
/*新增净菜*/
  addVegetable() {
    if (!this.verifyEmpty('vnewnane','净菜名称不能为空')||!this.verifyEmpty('vprice','价格不能为空')||!this.verifyEmpty('vnewLimitnum','限购数量')||!this.verifyEmpty('adddetail','净菜详情不能为空')) {
    }
    this.getSaleTime(1);
    if(this.days==""){
      alert("请选择预定时间！");
      return false;
    }
    this.vegetableAdd.saletime = this.days;
    this.vegetableInfoService.addVegetable(this.vegetableAdd)
      .subscribe(data => {
        if(data['status'] === 0){
          alert(data['msg']);
          this.closeMaskAdd();
          this.getVegetableList();
        }else{
          alert(data['msg']);
         // this.closeMaskAdd();
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
    $('.maskAdd').hide();
    $('#prese1').val('');
  }
/*新增结束*/
/*修改*/
  update(code: string) {
    this.vegetableInfoService.getVegetable(code)
      .subscribe(data => {
        if(data['status']==0){
          this.vegetableUp = data.data;
        }
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

      })
  }
  closeMaskUp() {
    $('.maskUpdate').hide();
    $('#prese').val('');
  }
  updateVegetable() {
    if (!this.verifyEmpty('upnewname','净菜名称不能为空')||!this.verifyEmpty('vupprice','价格不能为空')||!this.verifyEmpty('vupLimitnum','限购数量')||!this.verifyEmpty('updetail','净菜详情不能为空')) {
    }
    this.getSaleTime(2);
    if(this.days==""){
      alert("请选择预定时间！");
      return false;
    }
    this.vegetableUp.saletime = this.days;
    this.vegetableInfoService.updateVegetable(this.vegetableUp)
      .subscribe(data => {
        console.log(data);
        if(data['status'] === 0){
          alert("修改成功")
          this.closeMaskUp();
          this.getVegetableList();
        }else{
          alert("修改失败")
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
  okFunc() {
    $('.confirm').hide();
    this.vegetableInfoService.deleteVegetable(this.code)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data.status)) {
          alert("删除成功");
        }
        this.getVegetableList();
      });
  }
  noFunc() {
    $('.confirm').fadeOut();
  }
  private verifyEmpty(id,label) {

    if (!this.isEmpty(id, label)) {
      return false;
    }
    if(id=="vnewLimitnum"){
      var reg = /^[1-9]\d*$/;
      if(!reg.test($('#' + id).val())){
        this.addErrorClass(id, "请输入正确的数字");
        return true;
      }
    }
    if(id=="vupLimitnum"){
      var reg = /^[1-9]\d*$/;
      if(!reg.test($('#' + id).val())){
        this.addErrorClass(id, "请输入正确的数字");
        return true;
      }
    }

    if(id=="vprice"){
      var reg =/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      if(!reg.test($('#' + id).val())){
        this.addErrorClass(id, "请输入正确的价格");
        return true;
      }
    }
    if(id=="vupprice"){
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
  prese_upload(files,index){
    var xhr = this.vegetableInfoService.uploadImg(files[0],'vegetableInfo',-3);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){
          console.log(data.msg);
          this.vegetableAdd.vimage = data.msg;
          alert("上传成功");
        }
      }
    };
  }
  /*修改文件图片上传*/
  prese_upload2(files,index){
    var xhr = this.vegetableInfoService.uploadImg(files[0],'vegetableInfo',-3);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){
          console.log(data.msg);
          this.vegetableUp.vimage = data.msg;
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
      this.search = new Vegetable();
    }
    this.getVegetableList();
  }
}
