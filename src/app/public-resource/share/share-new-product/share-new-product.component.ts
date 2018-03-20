import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ShareProduct} from "../../../mode/shareProduct/share-product.service";
import {ShareProductPublicService} from "../../../service/share-product-public/share-product-public.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {SaleProductEmployeeService} from "../../../service/sale-product-employee/sale-product-employee.service";
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-share-new-product',
  templateUrl: './share-new-product.component.html',
  styleUrls: ['./share-new-product.component.css'],
  providers: [SaleProductEmployeeService]
})
export class ShareNewProductComponent implements OnInit {

  public shareProduct: ShareProduct;
  public deptList: Array<Department>;
  public isAllDept:boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
     private shareProductPublicService: ShareProductPublicService,
    private saleProductEmployeeService:SaleProductEmployeeService
  ) { }

  ngOnInit() {
    this.shareProduct = new ShareProduct();
    this.getDeptList();
    this.route.params.subscribe(data => {
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
    this.shareProduct.targetId = [];
    this.shareProduct.targetName = [];
    for(let i = 0;i<this.deptList.length;i++){
      if(this.deptList[i].choose){
        this.shareProduct.targetId.push(this.deptList[i].DEPT_ID);
        this.shareProduct.targetName.push(this.deptList[i].DEPT_NAME);
      }
    }
    if(this.shareProduct.targetId.length === 0){
      this.shareProduct.targetId = ['all'];
      this.shareProduct.targetName = ['所有人员'];
      this.isAllDept = true;
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
  }
  /*提交商品*/
  submit(){
    let error = 0;
    if($('.red').length === 0 && error === 0) {
      let postdata = JSON.parse(JSON.stringify(this.shareProduct));
      postdata.imgPathList = postdata.imgPath;
      delete postdata.imgPath;
      /*postdata.targetId = postdata.targetId.join(",");*/
      postdata.targetName = postdata.targetName.join(",");
      if(typeof (postdata.id) === "undefined" || postdata.id === null) {
        this.shareProductPublicService.addShareProduct(postdata)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                "callback": () => {

                },
                "cancel": () => {

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

                    },
                    "cancel": () => {

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
