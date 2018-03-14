import { Component, OnInit } from '@angular/core';
import {SaleProductEmployeeService} from "../../../../service/sale-product-employee/sale-product-employee.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SaleProduct} from "../../../../mode/saleProduct/sale-product.service";
import {ActivatedRoute, Router} from "@angular/router";
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-sale-mang',
  templateUrl: './sale-mang.component.html',
  styleUrls: ['./sale-mang.component.css']
})
export class SaleMangComponent implements OnInit {

  public pageNo = 1;
  public pageSize = 10;
  public total = 0;
  public search :SaleProduct;
  public saleList : Array<SaleProduct>;
  public deptList: Array<Department>;
  public copySale:SaleProduct;
  public winTitle:string;
  public isAllDept:boolean;
  public typeList: Array<string>;
  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private saleProductEmployeeService:SaleProductEmployeeService,
    private errorResponseService:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.search = new SaleProduct();
    this.copySale= new SaleProduct();
    this.copySale.imgPath = [];
    this.copySale.imgPathList = [];
    this.copySale.targetName = [];
    this.deptList = [];
    this.typeList = [];
    this.getDeptList();
    this.getSale(1);
  }
  /*获取商品列表*/
  getSale(pageNo){
    this.saleProductEmployeeService.getSaleList(this.search,pageNo,this.pageSize)
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          this.saleList = data.data.infos;
          this.total =data.data.total;
        }
      });
  }
  /*获取所有部门列表*/
  getDeptList(){
    this.saleProductEmployeeService.getDeptList()
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          this.deptList = data.data;
          for(let i = 0;i<this.deptList.length;i++){
            this.deptList[i].choose = false;
          }
        }
      });
  }
  /*选取部门*/
  chooseDept(){
    this.isAllDept = false;
    this.copySale.targetId = [];
    this.copySale.targetName = [];
    for(let i = 0;i<this.deptList.length;i++){
      if(this.deptList[i].choose){
        this.copySale.targetId.push(this.deptList[i].DEPT_ID);
        this.copySale.targetName.push(this.deptList[i].DEPT_NAME);
      }
    }
    if(this.copySale.targetId.length === 0){
      this.copySale.targetId = ['all'];
      this.copySale.targetName = ['所有人员'];
      this.isAllDept = true;
    }
  }
  /*全选*/
  chooseAll(){
    this.isAllDept = true;
    this.copySale.targetId = ['all'];
    this.copySale.targetName = ['所有人员'];
    for(let i = 0;i<this.deptList.length;i++){
      this.deptList[i].choose = false;
    }
  }
  /*提交商品信息*/
  submit(){
    let error = 0;
    if($('.red').length === 0 && error === 0) {
      let postdata = JSON.parse(JSON.stringify(this.copySale));
      postdata.imgPathList = postdata.imgPath;
      delete postdata.imgPath;
      postdata.targetId = postdata.targetId.join(",");
      postdata.targetName = postdata.targetName.join(",");
      if(typeof (postdata.id) === "undefined" || postdata.id === null) {
        this.saleProductEmployeeService.addSaleProduct(postdata)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                "callback": () => {
                  this.closeMask();
                  this.getSale(1);
                },
                "cancel": () => {
                  this.closeMask();
                  this.getSale(1);
                }
              });
            }
          });
      }else{
        confirmFunc.init({
          'title': '提示',
          'mes': '更改后的商品内容将在管理员审核后上架，是否确认修改?',
          'popType': 1,
          'imgType': 1,
          "callback": () => {
            this.saleProductEmployeeService.updateSaleProduct(postdata)
              .subscribe(data => {
                if (this.errorResponseService.errorMsg(data)) {
                  confirmFunc.init({
                    'title': '提示',
                    'mes': data.msg,
                    'popType': 2,
                    'imgType': 1,
                    "callback": () => {
                      this.closeMask();
                      this.getSale(1);
                    },
                    "cancel": () => {
                      this.closeMask();
                      this.getSale(1);
                    }
                  });
                }
              });
          },
          "cancel": () => {
            this.closeMask();
          }
        });
      }
    }
  }
  /*打开新增窗口*/
  fadeBom(){
    this.copySale= new SaleProduct();
    this.copySale.imgPath = [];
    this.copySale.imgPathList = [];
    this.copySale.targetId = ['all'];
    this.copySale.targetName = ['所有人员'];
    this.winTitle = "新增";
    this.isAllDept = true;
    this.typeList[0] = "";
    $('#product').show();
  }
  /*编辑初始化*/
  edit(sale){
    this.fadeBom();
    this.copySale = JSON.parse(JSON.stringify(sale));
    /*图片存储地址处理，转数组*/
    if(this.verifyEmpty(this.copySale.imgPath)){
      this.copySale.imgPath = this.copySale.imgPath.split(",");
      if(this.copySale.imgPath[this.copySale.imgPath.length-1]===""){
        this.copySale.imgPath.pop();
      }
    }
    /*抢购对象部门处理*/
    if(this.verifyEmpty(this.copySale.targetName)) {
      this.copySale.targetName = this.copySale.targetName.split(",");
    }
    if(this.verifyEmpty(this.copySale.targetId)) {
      this.copySale.targetId = this.copySale.targetId.split(",");
      for (let i = 0; i < this.copySale.targetId.length; i++) {
        if (this.copySale.targetId[i] !== "all") {
          this.isAllDept = false;
        }
        for (let j = 0; j < this.deptList.length; j++) {
          if (this.deptList[j].DEPT_ID === this.copySale.targetId[i]) {
            this.deptList[j].choose = true;
          }
        }
      }
    }
    console.log(this.copySale);
  }
  /*关闭窗口*/
  closeMask(){
    $('#product').hide();
    $('#press').val('');
    $('.form-control').removeClass('red');
    $('.dropify-wrapper').removeClass('red');
    $('.error').fadeOut();
    $('#deptSltWin').fadeOut();
    $('#press').val('');
    this.copySale = new SaleProduct();
    this.copySale.targetName = [];
    for(let i = 0;i<this.deptList.length;i++){
      this.deptList[i].choose = false;
    }
  }
  /*文件图片上传*/
  prese_upload(files){
    let xhr = this.saleProductEmployeeService.uploadImg(files[0],"sale",-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorResponseService.errorMsg(data)){
          this.copySale.imgPath.push(data.msg);
          this.copySale.imgPathList.push(window.URL.createObjectURL(files[0]));
        }
        $('#press').val('');
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
  /*删除图片*/
  delImgPath(index){
    this.copySale.imgPathList.splice(index,1);
    this.copySale.imgPath.splice(index,1);
  }
  /*数组非空验证*/
  verifyEmptyArray(value, id?){
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id,'该值不能为空');
      return false;
    }if(value.length === 0){
      this.addErrorClass(id,'请选择');
      return false;
    }else{
      this.removeErrorClass(id);
      return true;
    }
  }
  /*非空验证*/
  verifyEmpty( value, id?){
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
  linkDetail(id){
    this.router.navigate(['../detail',id],{relativeTo:this.route});
  }
  linkStatistics(){
    this.router.navigate(['../statistics'],{relativeTo:this.route});
  }
  /*审核*/
  check(sale){
    this.copySale = JSON.parse(JSON.stringify(sale));
    $('#check').show();
  }
  /*提交审核意见*/
  submitCheck(){
    if(this.verifyEmpty(this.copySale.isCheck,'status2')){
      if(this.copySale.isCheck === "pending"){
        this.addErrorClass('status2','请填写审核意见');
      }else{
        this.saleProductEmployeeService.checkProduct(this.copySale)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
              });
              this.getSale(1);
              this.closeCheck();
            }
          });
      }
    }
  }
  closeCheck(){
    this.copySale = new SaleProduct();
    $('#check').hide();
  }
  /*删除商品信息*/
  delete(id){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除该条数据？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        this.saleProductEmployeeService.deleteSafeProduct(id)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                "callback": () => {
                  this.getSale(1);
                },
                "cancel": () => {
                  this.getSale(1);
                }
              });
            }
          });
      }
    });
  }
}

export class Department {
  DEPT_ID   : string;
  DEPT_NAME : string;
  choose    : boolean;
}
