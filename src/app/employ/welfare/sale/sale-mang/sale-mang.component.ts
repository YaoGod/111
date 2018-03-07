import { Component, OnInit } from '@angular/core';
import {SaleProductEmployeeService} from "../../../../service/sale-product-employee/sale-product-employee.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SaleProduct} from "../../../../mode/saleProduct/sale-product.service";
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
  public search = "";
  public saleList : Array<SaleProduct>;
  public deptList:any;
  public copySale:SaleProduct;
  public winTitle:string;
  public isAllDept:boolean;
  constructor(
    private saleProductEmployeeService:SaleProductEmployeeService,
    private errorResponseService:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.copySale= new SaleProduct();
    this.copySale.imgPath = [];
    this.copySale.imgPathList = [];
    this.copySale.deptName = [];
    this.getDeptList();
  }
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
        }
      });
  }
  /*选取部门*/
  chooseDept(){
    this.isAllDept = false;
    this.copySale.deptId = [];
    this.copySale.deptName = [];
    for(let i = 0;i<this.deptList.length;i++){
      if(this.deptList[i].choose){
        this.copySale.deptId.push(this.deptList[i].DEPT_ID);
        this.copySale.deptName.push(this.deptList[i].DEPT_NAME);
      }
    }
    if(this.copySale.deptId.length === 0){
      this.copySale.deptId = ['0'];
      this.copySale.deptName = ['所有人员'];
      this.isAllDept = true;
    }
  }
  /*全选*/
  chooseAll(){
    this.isAllDept = true;
    this.copySale.deptId = ['0'];
    this.copySale.deptName = ['所有人员'];
    for(let i = 0;i<this.deptList.length;i++){
      this.deptList[i].choose = false;
    }
  }
  /*提交商品信息*/
  submit(){
    console.log(this.copySale);
  }

  /*打开新增窗口*/
  fadeBom(){
    this.copySale= new SaleProduct();
    this.copySale.imgPath = [];
    this.copySale.imgPathList = [];
    this.copySale.deptId = ['0'];
    this.copySale.deptName = ['所有人员'];
    this.winTitle = "新增";
    this.isAllDept = true;
    $('.mask').show();
  }
  /*关闭窗口*/
  closeMask(){
    $('.mask').hide();
    $('#press').val('');
    $('.form-control').removeClass('red');
    $('.dropify-wrapper').removeClass('red');
    $('.error').fadeOut();
    $('#press').val('');
    this.copySale = new SaleProduct();
    this.copySale.deptName = [];
    for(let i = 0;i<this.deptList.length;i++){
      this.deptList[i].choose = false;
    }
  }
  /*文件图片上传*/
  prese_upload(files){
    let xhr = this.saleProductEmployeeService.uploadImg(files[0],"welfare",-1);
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
  verifyEmptyArray(value, id){
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
}
