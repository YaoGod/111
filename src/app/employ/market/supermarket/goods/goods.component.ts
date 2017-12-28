import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {SupermarketProduct} from "../../../../mode/supermarketProduct/supermarket-product.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {SupermarketApplier} from "../../../../mode/supermarketApplier/supermarket-applier.service";
@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.css'],
  providers: [SupermarketManagerService,SupermarketManagerService,ErrorResponseService]
})
export class GoodsComponent implements OnInit {
  public products:Array<SupermarketProduct>;
  public applierList:Array<SupermarketApplier>;
  public categories:Array<SupermarketCategory>;
  public search: SupermarketProduct;
  public days:string;
  private code: any;
  private pageNo: number = 1;
  /*当前页码*/
  private pageSize: number = 5;
  public pages: Array<number>;
  public  productView={
    code:            '',
    supplierId:        '',
    sname:              '',
    simage:              '',
    detail:            '',
    price:            '',
    stype:                '',
    pstatus:              '',
    leftstatus:           '',
    id:  '',
    applier:'',
    category:'',
  };
  public  productAdd={
    code:            '',
    supplierId:        '',
    sname:              '',
    simage:              '',
    detail:            '',
    price:            '',
    stype:                '',
    pstatus:              '',
    leftstatus:           '',
    id:  '',
    applier:'',
   category:'',
  };
  public  productUp={
    code:            '',
    supplierId:        '',
    sname:              '',
    simage:              '',
    detail:            '',
    price:            '',
    stype:                '',
    pstatus:              '',
    leftstatus:           '',
    id:  '',
    applier:'',
    category:'',
  };
  constructor(private marketManagerService: SupermarketManagerService,
              private errorVoid: ErrorResponseService,) { }

  ngOnInit() {
    this.search = new SupermarketProduct();
    this.pages = [];
    this.getSupermarketList();
  }

  getSupermarketList(){
    this.marketManagerService.getSupermarketList(this.pageNo,this.pageSize,this.search).subscribe(data => {
      if (data.status=="0") {
        this.products = data.data.infos;
        this.applierList = data.data.applierList;
        this.categories = data.data.categories;
        let total = Math.ceil(data.data.total / this.pageSize);
        this.initPage(total);
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
    if(this.checkPrice("price_add")){
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
    if(this.productAdd.simage==null||this.productAdd.simage==""){
       alert("请上传图片！");
       return false;
    }

    this.marketManagerService.addMarketProduct(this.productAdd)
      .subscribe(data => {
        if(data['status'] === 0){
          alert(data['data']);
          this.closeMaskAdd();
          this.getSupermarketList();
        }else{
          alert(data['msg']);
          // this.closeMaskAdd();
        }
      })
  }
  /*修改*/
  updateProduct() {
    if(!this.verifyEmpty("sname_edit","商品名称不能为空")){
    alert();
      return false;
    }
    if(!this.verifyEmpty("price_edit","价格不能为空")){

      return false;
    }
    if(this.checkPrice("price_edit")){
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
    if(this.productUp.simage==null||this.productUp.simage==""){
      alert("请上传图片！");
      return false;
    }
    this.marketManagerService.updateProduct(this.productUp)
      .subscribe(data => {
        console.log(data);
        if(data['status'] === 0){
          alert(data['data']);
          this.closeMaskUp();
          this.getSupermarketList();
        }else{
          alert(data['msg']);
          this.closeMaskUp();
        }
      })
  }
  /*查看*/
  view(code){
    this.marketManagerService.getMarketProduct(code)
      .subscribe(data => {
        if (data['status']==0) {
          this.productView = data.data;
          $('.maskView').show();
        }

      })
  }
  /*修改*/
  update(code: string) {
    this.marketManagerService.getMarketProduct(code)
      .subscribe(data => {
        if(data['status']==0){
          this.productUp = data.data;
        }
        $('.maskUpdate').show();
      });
  }

  closeMaskUp() {
    $('.maskUpdate').hide();
    $('#prese').val('');
    this.productUp={
      code:            '',
      supplierId:        '',
      sname:              '',
      simage:              '',
      detail:            '',
      price:            '',
      stype:                '',
      pstatus:              '',
      leftstatus:           '',
      id:  '',
      applier:'',
      category:'',
    };
  }
  closeMaskView(){
    $('.maskView').hide();
  }
    delete(code: number) {
      this.code = code;
      $('.confirm').fadeIn();
    }
  /*删除*/
  okFunc() {
    $('.confirm').hide();
    this.marketManagerService.deletetProduct(this.code)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data.status)) {
          alert("删除成功");
        }
        this.getSupermarketList();
      });
  }
  noFunc() {
    $('.confirm').fadeOut();
  }
  add() {
    $('.maskAdd').show();
    this.productAdd.pstatus = "1";
    this.productAdd.leftstatus="1";
  }
  closeMaskAdd() {
    $('.maskAdd').hide();
    $('#prese1').val('');
    this.productAdd={
      code:            '',
      supplierId:        '',
      sname:              '',
      simage:              '',
      detail:            '',
      price:            '',
      stype:                '',
      pstatus:              '',
      leftstatus:           '',
      id:  '',
      applier:'',
      category:'',
    };
  }



  /*新增页面文件图片上传*/
  prese_upload(files,index){
    var xhr = this.marketManagerService.uploadImg(files[0],'supermarket',-4);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){
          console.log(data.msg);
          this.productAdd.simage = data.msg;
          alert("上传成功");
        }
      }
    };
  }
  /*修改文件图片上传*/
  prese_upload2(files,index){
    var xhr = this.marketManagerService.uploadImg(files[0],'supermarket',-4);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){
          console.log(data.msg);
          this.productUp.simage = data.msg;
          alert("上传成功");
        }
      }
    };
  }
  private checkPrice(id){

      var reg =/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      if(!reg.test($('#' + id).val())){
        this.addErrorClass(id, "请输入正确的价格");
        return true;
      }

  }

  private verifyEmpty(id,label) {
    if (!this.isEmpty(id, label)) {
      return false;
    }else{
      return true;
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
  /*页码初始化*/
  initPage(total){
    this.pages = new Array(total);
    console.log(this.pages);
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
      this.search = new SupermarketProduct();
    }
    this.getSupermarketList();
  }
}

export class SupermarketCategory {
  cid:number;
  cname:string;
}
