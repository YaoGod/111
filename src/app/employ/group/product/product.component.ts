import { Component, OnInit } from '@angular/core';
import { GroupProduct } from '../../../mode/groupProduct/group-product.service';
import { GroupProductService } from '../../../service/group-product/group-product.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import * as $ from 'jquery';
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {SaleProductEmployeeService} from "../../../service/sale-product-employee/sale-product-employee.service";
declare var $:any;
declare var confirmFunc: any;
declare var tinymce: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [GroupProductService,UtilBuildingService,ErrorResponseService,SaleProductEmployeeService],
})
export class ProductComponent implements OnInit {

  public catas;
  public rule;
  public groupProducts: Array<GroupProduct>;
  public search: GroupProduct;
  private code: any;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public imgUrl: Array<string>;
  public open = false;
  public imgUrlPath = ['','',''];
  public isAllDept:boolean;
  public isAllDept2:boolean;
  public deptList: Array<Department>;
  public upGroupProduct={
    code:'',
    name: '',
    imgPath: '',
    detail:'',
    price: '',
    status: '',
    startTime: '',
    endTime:'',
    contact:'',
    phone:    '',
    payaccount:'',
    label:  '',
    producttype: '',
    checkStatus:'',
    shipping:'',
    targetId:[],
    targetName:[],
    imgPathList:[]
  };
  public newGroupProduct={
    name: '',
    imgPath: '',
    detail:'',
    price: '',
    status: '',
    startTime: '',
    endTime:'',
    contact:'',
    phone:    '',
    payaccount:'',
    label:  '',
    producttype: '',
    checkStatus:'',
    shipping:'',
    targetId:[],
    targetName:[],
  };
  constructor(
    private groupProductService: GroupProductService,
    private globalCatalogService: GlobalCatalogService,
    private errorVoid: ErrorResponseService,
    public  ipSetting:IpSettingService,
    private saleProductEmployeeService:SaleProductEmployeeService,
  ) {
  }
  ngOnInit() {
    this.getRule();
    this.search = new GroupProduct();
    this.pages = [];
    this.deptList = [];
    this.getProductList(1);
    this.getDeptList();
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'group','employ/group')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;
          for(let i = 0;i<this.catas.length;i++){
            if(this.catas[i].routeUrl === "employ/group"){
              this.catas.splice(i,1);
              i = 0;
            }
            if(this.catas[i].routeUrl === "employ/group/product"){
              this.rule = this.catas[i];
            }
          }
        }
      })
  }
  getProductList(pageNo){
    this.pageNo = pageNo;
    this.groupProductService.getProductList(this.pageNo,this.pageSize,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.groupProducts = data.data.infos;
        for(let i=0;i<this.groupProducts.length;i++){
          if(this.groupProducts[i].imgPath!==null){
            this.groupProducts[i].imgPath = this.groupProducts[i].imgPath.split(';');
          }
        }

        this.total = data.data.total;
      }
    });
  }
  /*获取所有部门列表*/
  getDeptList(){
    this.saleProductEmployeeService.getDeptList()
      .subscribe(data =>{
        if(this.errorVoid.errorMsg(data)){
          this.deptList = data.data;
          for(let i = 0;i<this.deptList.length;i++){
            this.deptList[i].choose = false;
          }
        }
      });
  }
  fadeBom() {
    $('.mask').show();
    this.newGroupProduct.targetId = ['all'];
    this.newGroupProduct.targetName = ['所有人员'];
    this.isAllDept = true;
  }
  closeMask() {
    $('.mask').hide();
    $('.errorMessage').html('');
    this.imgUrlPath = ['','',''];
    $('#preseA,#preseB,#preseC').val('');
    this.newGroupProduct={
      name: '',
      imgPath: '',
      detail:'',
      price: '',
      status: '',
      startTime: '',
      endTime:'',
      contact:'',
      phone:    '',
      payaccount:'',
      label:  '',
      producttype: '',
      checkStatus:'',
      shipping:'',
      targetId:[],
      targetName:[],
    };
    for(let i = 0;i<this.deptList.length;i++){
      this.deptList[i].choose = false;
    }
  }
  /*选取部门*/
  chooseDept(){
    this.isAllDept = false;
    this.newGroupProduct.targetId = [];
    this.newGroupProduct.targetName = [];
    for(let i = 0;i<this.deptList.length;i++){
      if(this.deptList[i].choose){
        this.newGroupProduct.targetId.push(this.deptList[i].DEPT_ID);
        this.newGroupProduct.targetName.push(this.deptList[i].DEPT_NAME);
      }
    }
    if(this.newGroupProduct.targetId.length === 0){
      this.newGroupProduct.targetId = ['all'];
      this.newGroupProduct.targetName = ['所有人员'];
      this.isAllDept = true;
    }
  }
  /*编辑选取部门*/
  chooseDept2(){
    this.isAllDept2 = false;
    this.upGroupProduct.targetId = [];
    this.upGroupProduct.targetName = [];
    for(let i = 0;i<this.deptList.length;i++){
      if(this.deptList[i].choose){
        this.upGroupProduct.targetId.push(this.deptList[i].DEPT_ID);
        this.upGroupProduct.targetName.push(this.deptList[i].DEPT_NAME);
      }
    }
    if(this.upGroupProduct.targetId.length === 0){
      this.upGroupProduct.targetId = ['all'];
      this.upGroupProduct.targetName = ['所有人员'];
      this.isAllDept2 = true;
    }
  }
  /*全选*/
  chooseAll(){
    this.isAllDept = true;
    this.newGroupProduct.targetId = ['all'];
    this.newGroupProduct.targetName = ['所有人员'];
    for(let i = 0;i<this.deptList.length;i++){
      this.deptList[i].choose = false;
    }
  }
  /*全选*/
  chooseAll2(){
    this.isAllDept2 = true;
    this.upGroupProduct.targetId = ['all'];
    this.upGroupProduct.targetName = ['所有人员'];
    for(let i = 0;i<this.deptList.length;i++){
      this.deptList[i].choose = false;
    }
  }
  public verifyEmpty(id,label) {
    if (!this.isEmpty(id, label)) {
      return false;
    }else{
      if(id=="upprice"){
        return  this.verifyProductPrice(id);
      }
      if(id=="upphone"){
        return this.verifyPhone(id);
      }
      return true;
    }
  }
  public verifyProductPrice(id) {
    if (!this.verifyIsNumber(id, '请输入正确的费用格式')) {
      return false;
    }
    return true;
  }
  public verifyPhone(id)  {
    if (!this.verifyIsTel(id, '手机号码异常')) {
      return false;
    }
    return true;
  }

  /*提交*/
  subGroupProduct() {
    if (!this.verifyEmpty('newname','名称不能为空')||!this.verifyEmpty('newprice','不能为空')||!this.verifyEmpty('newstartTime'
        ,'不能为空')|| !this.verifyEmpty('newendTime','不能为空')||!this.verifyEmpty('newpconcant','不能为空')||
      !this.verifyEmpty('newphone','不能为空')|| !this.verifyPhone('newphone')|| !this.verifyEmpty('newpayaccount','收款账户不能为空')||
      !this.verifyEmpty('newesetail','商品详情不能为空')) {
      return false;
    }
    if(this.newGroupProduct.startTime > this.newGroupProduct.endTime){
      this.addErrorClass('newendTime', '结束时间不能早于开始时间');
      return false;
    }
    this.newGroupProduct.checkStatus = '0';
    let postdata = JSON.parse(JSON.stringify(this.newGroupProduct));
    postdata.checkStatus = '0';
    postdata.imgPath = '';
    let array = JSON.parse(JSON.stringify(this.imgUrlPath));
    this.filter_array(array);
    if(array&&array.length===0){
      confirmFunc.init({
        'title': '提示',
        'mes': '请上传图片！',
        'popType': 0,
        'imgType': 2,
      });
      return false;
    }
    for(let i=0;i<array.length;i++){
      postdata.imgPath += array[i] + ';'
    }
    delete postdata.imgPathList;
    this.groupProductService.addGroupBuyProduct(postdata)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data['msg'],
            'popType': 0,
            'imgType': 1,
          });
          this.closeMask();
          this.getProductList(1);
        }
      })
  }
  update(code: string) {
    this.groupProductService.getGroupProduct(code)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.open = true;
          this.upGroupProduct = data.data;
          this.imgUrl = this.upGroupProduct.imgPath.split(';');
          $('.mask2').show();
          /*抢购对象部门处理*/
            for (let i = 0; i < this.upGroupProduct.targetId.length; i++) {
              if (this.upGroupProduct.targetId[i] !== "all") {
                this.isAllDept2 = false;
              }else{
                this.isAllDept2 = true;
              }
              for (let j = 0; j < this.deptList.length; j++) {
                if (this.deptList[j].DEPT_ID === this.upGroupProduct.targetId[i]) {
                  this.deptList[j].choose = true;
                  // console.log(this.deptList[j].DEPT_NAME);
                }
              }
            }
          }
      })
  }

  private filter_array(array) {
    // return array.filter(item=>item);
    for(var i = 0 ;i<array.length;i++)
    {
      if(array[i] == "" || typeof(array[i]) == "undefined")
      {
        array.splice(i,1);
        i= i-1;
      }
    }
    return array;
  }

  /** 修改商品信息提交*/
  updateGroupProduct() {

    if (!this.verifyEmpty('upnewname','名称不能为空')||!this.verifyEmpty('upnewprice','不能为空')||!this.verifyEmpty('upnewstartTime'
        ,'不能为空')|| !this.verifyEmpty('upnewendTime','不能为空')||!this.verifyEmpty('upnewpconcant','联系人不能为空')||
      !this.verifyEmpty('upnewphone','不能为空')|| !this.verifyEmpty('upnewpayaccount','收款账户不能为空')||!this.verifyEmpty(
        'upnewesetail','商品详情不能为空')) {
      return false;
    }
    let postdata = JSON.parse(JSON.stringify(this.upGroupProduct));
    if(postdata.startTime > postdata.endTime){
      this.addErrorClass('upnewendTime', '结束时间不能早于开始时间');
      return false;
    }
    postdata.imgPath = '';
    this.filter_array(this.imgUrl);
    for(let i=0;i<this.imgUrl.length;i++){
        postdata.imgPath += this.imgUrl[i] + ';'
    }
    delete postdata.imgPathList;
    this.groupProductService.updateGroupbuyProduct(postdata)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示',
            'mes': data.msg,
            'popType': 0,
            'imgType': 1,
          });
          this.closeMask2();

          this.getProductList(1);
        }
      })
  }
  closeMask2() {
    $('.mask2').hide();
    $('#prese1,#prese2,#prese3').val('');
    $('.errorMessage').html('');
    for(let i = 0;i<this.deptList.length;i++){
      this.deptList[i].choose = false;
    }
  }
  /*新增文件图片上传*/
  prese_upload(files,index){
    let  xhr = this.groupProductService.uploadImg(files[0],'group',-2);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.imgUrlPath[index] = data.msg;
          confirmFunc.init({
            'title': '提示',
            'mes': '上传成功',
            'popType': 0,
            'imgType': 1,
          });
          $("#preseA,#preseB,#preseC").val("");
        }else {
          $("#preseA,#preseB,#preseC").val("");
        }
      }
    };
  }
  /*修改文件图片上传*/
  prese_upload2(files,index){
    let xhr = this.groupProductService.uploadImg(files[0],'group',-2);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.imgUrl[index] = data.msg;

          confirmFunc.init({
            'title': '提示',
            'mes': '上传成功',
            'popType': 0,
            'imgType': 1,
          });
        }else {
          $("#prese1,#prese2,#prese3").val("");
        }
      }
    };
  }

  /*删除商品*/
  delete(index) {
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        this.groupProductService.deleteGroupbuyProduct(index)
          .subscribe(data => {
            if (this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data['msg'],
                'popType': 0,
                'imgType': 1,
              });
              this.pages = [];
              this.pageNo = 1;
            }
            this.getProductList(1);
          });
      }
    });
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
  /** 验证手机号码 */
  public verifyIsTel(id: string, error?: string): boolean {
    const data =  $('#' + id).val();/*/^1(3[4-9]|5[0-2]|8[0-3,78])\d{8}$/ 移动号段*/
    if (!String(data).match( /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/ ))  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /** 匹配数字 */
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
  /** 添加错误信息class */
  public  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).siblings('span').html('输入错误');
    }else {
      $('#' + id).siblings('span').html(error);
    }
  }
  /** 去除错误信息class */
  public  removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').removeClass('form-error');
    $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
    $('#' + id).siblings('span').html('');
  }
  /*重新审核*/
  reCheck(code){
    this.groupProductService.recheckGroupProduct(code)
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          confirmFunc.init({
            'title': '提示',
            'mes': '已重新提交，请等待管理员审核。',
            'popType': 0,
            'imgType': 1,
          });
          this.getProductList(1);
        }
      })
  }
}
export class Department {
  DEPT_ID   : string;
  DEPT_NAME : string;
  choose    : boolean;
}
