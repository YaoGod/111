import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Discount, Other } from '../../../../mode/discount/discount.service';
import { GlobalCatalogService } from '../../../../service/global-catalog/global-catalog.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import { DiscountEmployeeService } from '../../../../service/discount-employee/discount-employee.service';
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
declare var confirmFunc:any;
declare var $: any;
@Component({
  selector: 'app-discount-info-mang',
  templateUrl: './discount-info-mang.component.html',
  styleUrls: ['./discount-info-mang.component.css']
})
export class DiscountInfoMangComponent implements OnInit {

  public pageNo = 1;           /*当前页码*/
  public pageSize = 5;         /*显示页数*/
  public total = 0;
  public length = 5;
  public pages: Array<number>; /*页码*/
  public discounts: Array<Discount>;
  public copyDiscount: Discount;
  public tempOther: Array<any>;
  public search: string;      /*搜索字段*/
  public navtitle:string;
  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private discountEmployeeService:DiscountEmployeeService,
    public ipSetting  : IpSettingService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("员工服务/惊喜专区/优惠信息管理");
    this.discounts = new Array<Discount>();
    this.copyDiscount = new Discount();
    this.pages = new Array<number>();
    this.search = "";
    this.navtitle = "新增";
    this.getDiscount(1);
  }
  getDiscount(pageNo) {
    this.pageNo = pageNo;
    this.discountEmployeeService.getDiscountList('end',this.search,pageNo,this.pageSize)
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          this.discounts = data.data.infos;
          this.total = data.data.total;
        }
      });
  }
  fadeBom(){
    this.copyDiscount.others = new Array<Other>();
    this.tempOther = [];
    this.navtitle = "新增";
    $('.mask').show();
  }
  closeMask(){
    $('.mask').hide();
    $('#prese').val('');
    $('.form-control').removeClass('red');
    $('.dropify-wrapper').removeClass('red');
    $('.error').fadeOut();
    this.copyDiscount = new Discount();
    this.tempOther = [];
  }
  /*文件图片上传*/
  prese_upload(files){
    var xhr = this.discountEmployeeService.uploadImg(files[0],"discount",-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorResponseService.errorMsg(data)){
          this.copyDiscount.imgPath = data.msg;
        }
      }else if(xhr.readyState === 4 && xhr.status === 413 ){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '图片大小超出限制',
          'popType': 1 ,
          'imgType': 2 ,
        });
      }
    };
  }
  /*文件上传*/
  prese_uploadFile(files){
    console.log(files[0]);
    let xhr = this.discountEmployeeService.uploadFile(files[0],-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorResponseService.errorMsg(data)){
          if(!this.copyDiscount.filePath||!this.copyDiscount.fileName){
            this.copyDiscount.filePath = [];
            this.copyDiscount.fileName = [];
          }
          this.copyDiscount.filePath.push(data.msg);
          this.copyDiscount.fileName.push(files[0].name);
          $('#presefile').val("");
        }
      }else if(xhr.readyState === 4 && xhr.status === 413 ){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件大小超出限制',
          'popType': 1 ,
          'imgType': 2 ,
        });
      }
    };
  }
  addLine(){
    let length = 0;
    for(let i = 0;i<this.tempOther.length;i++){
      if(this.tempOther[i].isShow){
        length++;
      }
    }
    if(length<5){
      let object = {isShow: true,key:"",value:""};
      this.tempOther.push(object);
    }
  }
  delLine(index){
    this.tempOther[index].isShow = false;
  }
  delfile(index){
    this.copyDiscount.fileName.splice(index,1);
    this.copyDiscount.filePath.splice(index,1);
  }
  submit(){
    this.verifyImgPath();
    this.verifyEmpty(this.copyDiscount.title,'title');
    this.verifyEmpty(this.copyDiscount.summary,'summary');
    this.verifyEmpty(this.copyDiscount.effectBtime,'effectBtime');
    this.verifyEmpty(this.copyDiscount.effectEtime,'effectEtime');
    if($('.red').length === 0) {
      let j = 0;
      this.copyDiscount.others = [];
      for (let i = 0; i < this.tempOther.length; i++) {
        if (this.tempOther[i].isShow &&this.tempOther[i].key!==""&&this.tempOther[i].value!==""){
          this.copyDiscount.others[j] = new Other();
          this.copyDiscount.others[j].key = this.tempOther[i].key;
          this.copyDiscount.others[j].value = this.tempOther[i].value;
          j++;
        }
      }
      let postdata = JSON.parse(JSON.stringify(this.copyDiscount));
      postdata.effectBtime = postdata.effectBtime.replace(/-/g, '/');
      postdata.effectEtime = postdata.effectEtime.replace(/-/g, '/');
      if(typeof (postdata.id) === "undefined" || postdata.id === null) {
        // console.log(postdata);
        this.discountEmployeeService.addDiscount(postdata)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                "callback": () => {
                  this.closeMask();
                  this.getDiscount(1);
                },
                "cancel": () => {
                  this.closeMask();
                  this.getDiscount(1);
                }
              });
            }
          });
      }else{
        if(postdata.imgPath.length>150){
          delete postdata.imgPath;
        }
        this.discountEmployeeService.updateDiscount(postdata)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                "callback": () => {
                  this.closeMask();
                  this.getDiscount(1);
                },
                "cancel": () => {
                  this.closeMask();
                  this.getDiscount(1);
                }
              });
            }
          });
      }
    }
  }
  /*编辑*/
  edit(data){
    this.copyDiscount = JSON.parse(JSON.stringify(data));
    this.copyDiscount.effectBtime = this.copyDiscount.effectBtime.replace(/\//g,'-');
    this.copyDiscount.effectEtime = this.copyDiscount.effectEtime.replace(/\//g,'-');
    this.fadeBom();
    this.navtitle = "编辑";
    this.tempOther = JSON.parse(JSON.stringify(data.others));
    for(let i = 0;i< this.tempOther.length;i++){
      this.tempOther[i].isShow = true;
    }
  }
  /*删除*/
  delete(id:number){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除该条数据？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        this.discountEmployeeService.deleteDiscount(id)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                "callback": () => {
                  this.getDiscount(1);
                },
                "cancel": () => {
                  this.getDiscount(1);
                }
              });
            }
          });
      }
    });
  }
  linkDetail(id){
    this.router.navigate(['../detail',id],{relativeTo:this.route});
  }
  verifyImgPath(){
    if(typeof (this.copyDiscount.imgPath) === "undefined" ||
      this.copyDiscount.imgPath === null ||
      this.copyDiscount.imgPath === ''){
      this.addErrorClass('newImgPath','请上传图片');
      return false;
    }else{
      this.removeErrorClass('newImgPath');
      return true;
    }
  }
  /*非空验证*/
  verifyEmpty( value, id){
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id,'该值不能为空');
      return false;
    }else{
      this.removeErrorClass(id);
      return true;
    }
  }
  /* 添加错误信息*/
  private addErrorClass(id: string, error: string)  {
    $('#' + id).addClass('red');
    $('#' + id).parent().next('.error').fadeIn().html(error);
  }
  /*去除错误信息*/
  private  removeErrorClass(id: string) {
    $('#' + id).removeClass('red');
    $('#' + id).parent().next('.error').fadeOut();
  }
  back(){
    history.go(-1);
  }
}
