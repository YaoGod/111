import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ShareProduct} from "../../../mode/shareProduct/share-product.service";
import {ShareProductPublicService} from "../../../service/share-product-public/share-product-public.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {SaleProductEmployeeService} from "../../../service/sale-product-employee/sale-product-employee.service";
import {GlobalUserService} from "../../../service/global-user/global-user.service";
import {User} from "../../../mode/user/user.service";
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-share-new-product',
  templateUrl: './share-new-product.component.html',
  styleUrls: ['./share-new-product.component.css'],
  providers: [SaleProductEmployeeService, GlobalUserService]
})
export class ShareNewProductComponent implements OnInit {

  public user:User;
  public shareProduct: ShareProduct;
  public deptList: Array<Department>;
  public isAllDept:boolean;
  public showImg: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private shareProductPublicService: ShareProductPublicService,
    private saleProductEmployeeService:SaleProductEmployeeService,
    private globalUserService: GlobalUserService
  ) { }

  ngOnInit() {
    this.user =this.globalUserService.getVal();
    this.shareProduct = new ShareProduct();
    this.shareProduct.imgPath = [];
    this.shareProduct.imgPathList = [];
    this.shareProduct.targetId = [this.user.deptId];
    this.getDeptList();
    if(typeof (this.route.params['_value']['id']) !== "undefined"){
      let tempid = 0;
      this.route.params
        .switchMap((params: Params) => this.shareProduct.id  = params['id'])
        .subscribe(() => {
          if (tempid === 0) {
            this.getShareProductDetail(this.shareProduct.id);
            tempid++;
          }
        });
    }
  }
  /*获取物品详情*/
  getShareProductDetail(id){
    this.shareProductPublicService.getShareProductDetail(id)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.shareProduct = data.data;
          if(this.shareProduct.imgPath!==null){
            this.shareProduct.imgPath = this.shareProduct.imgPath.split(',');
          }
          if (this.shareProduct.imgPathList.length>0){
            this.showImg = this.shareProduct.imgPathList[0];
          }
          this.shareProduct.targetName = this.shareProduct.targetName.split('|').slice(1,-1);
          this.shareProduct.targetId = this.shareProduct.targetId.split('|').slice(1,-1);
        }
      })
  }
  /*获取所有部门列表*/
  getDeptList(){
    this.saleProductEmployeeService.getDeptList()
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          this.deptList = data.data;
          for(let i = 0;i<this.deptList.length;i++){
            this.deptList[i].choose = false;
            if(this.deptList[i].DEPT_ID === this.shareProduct.targetId[0]){
              this.deptList[i].choose = true;
              this.shareProduct.targetName = [this.deptList[i].DEPT_NAME];
              this.user.deptName = this.deptList[i].DEPT_NAME;
              this.globalUserService.setVal(this.user);
            }
          }
        }
      });
  }
  /*打开部门选择框*/
  openChooseWin(){
    $('#deptSltWin').show();
    for(let i = 0;i<this.deptList.length;i++){
      this.deptList[i].choose = false;
    }
    for(let i = 0;i<this.deptList.length;i++){
      for(let j = 0 ;j<this.shareProduct.targetId.length;j++){
        if(this.deptList[i].DEPT_ID === this.shareProduct.targetId[j]){
          this.deptList[i].choose = true;
        }
        if(this.shareProduct.targetId[j] === 'all'){
          this.isAllDept = true;
        }
      }
    }
  }
  /*选取部门*/
  chooseDept(){
    this.isAllDept = false;
    this.shareProduct.targetId = [];
    this.shareProduct.targetName = [];
    for(let i = 0;i<this.deptList.length;i++){
      if(this.deptList[i].choose){
        this.shareProduct.targetId.push(this.deptList[i].DEPT_ID);
        this.shareProduct.targetName.push(this.deptList[i].DEPT_NAME);
      }
    }
    if(this.shareProduct.targetId.length === 0){
      this.shareProduct.targetId = [this.user.deptId];
      this.shareProduct.targetName = [this.user.deptName];
      this.isAllDept = false;
    }
  }
  /*全选*/
  chooseAll() {
    this.isAllDept = true;
    this.shareProduct.targetId = ['all'];
    this.shareProduct.targetName = ['所有人员'];
    for (let i = 0; i < this.deptList.length; i++) {
      this.deptList[i].choose = false;
    }
  }
  /*文件图片上传*/
  prese_upload(files){
    let xhr = this.shareProductPublicService.uploadImg(files[0],"share",-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorResponseService.errorMsg(data)){
          this.shareProduct.imgPath.push(data.msg);
          this.shareProduct.imgPathList.push(window.URL.createObjectURL(files[0]));
          this.showImg = this.shareProduct.imgPathList[this.shareProduct.imgPathList.length-1];
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
    this.shareProduct.imgPathList.splice(index,1);
    this.shareProduct.imgPath.splice(index,1);
    if(index === this.shareProduct.imgPath.length&&index!==0){
      this.showImg = this.shareProduct.imgPathList[this.shareProduct.imgPathList.length-1];
    }
    if(this.shareProduct.imgPathList.length === 0){
      delete this.showImg;
    }
  }
  /*提交商品*/
  submit(){
    let error = 0;
    if($('.red').length === 0 && error === 0) {
      let postdata = JSON.parse(JSON.stringify(this.shareProduct));
      postdata.imgPathList = postdata.imgPath;
      delete postdata.imgPath;
      if(typeof (postdata.id) === "undefined" || postdata.id === null) {
        this.shareProductPublicService.addShareProduct(postdata)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': '您的物品已提交，将在管理员审核后才能正式发布，请耐心等待。',
                'popType': 2,
                'imgType': 1,
                "callback": () => {
                  history.go(-1);
                },
                "cancel": () => {
                  history.go(-1);
                }
              });
            }
          });
      }else{
        confirmFunc.init({
          'title': '提示',
          'mes': '更改后的商品内容将在管理员审核后上架，是否确认提交?',
          'popType': 1,
          'imgType': 1,
          "callback": () => {
            this.shareProductPublicService.updateShareProduct(postdata)
              .subscribe(data => {
                if (this.errorResponseService.errorMsg(data)) {
                  confirmFunc.init({
                    'title': '提示',
                    'mes': data.msg,
                    'popType': 2,
                    'imgType': 1,
                    "callback": () => {
                      history.go(-1);
                    },
                    "cancel": () => {
                      history.go(-1);
                    }
                  });
                }
              });
          }
        });
      }
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
}

export class Department {
  DEPT_ID   : string;
  DEPT_NAME : string;
  choose    : boolean;
}
