import { Component, OnInit } from '@angular/core';
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {SupermarketApplier} from "../../../../mode/supermarketApplier/supermarket-applier.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import * as $ from 'jquery';
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
  providers: [SupermarketManagerService,ErrorResponseService,SupermarketApplier]
})
export class SupplierComponent implements OnInit {
  public rule;
  public catas;
  public  file: Array<File>;
  public  upfile: Array<File>;
  public  appliers:Array<SupermarketApplier>;
  public  applierAdd :SupermarketApplier;
  public  applierView:SupermarketApplier;
  public  applierEdit:SupermarketApplier;
  public  deleteFileList : Array<number>;
  public pageNo   : number = 1;
  public pageSize : number = 5;
  public total    : number = 0;
  constructor(private marketManagerService:SupermarketManagerService ,
              private errorVoid: ErrorResponseService,
              private globalCatalogService: GlobalCatalogService) { }

  ngOnInit() {
    this.getRule();
    this.applierAdd =  new SupermarketApplier();
    this.applierView =  new SupermarketApplier();
    this.applierEdit =  new SupermarketApplier();
    this.deleteFileList = [];
    this.providerList(1);

  }
  getRule(){
    this.globalCatalogService.getCata(-1,'market','employ/market/supermarket')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.catas = data.data;
          for(let i = 0;i<this.catas.length;i++){
            if(this.catas[i].routeUrl === "employ/market/supermarket/supermarketApplier"){
              this.rule = this.catas[i];
            }
          }
        }
      })
  }
  /*服务商管理列表*/
  providerList(pageNo){
    this.pageNo = pageNo;
    this.marketManagerService.providerList(this.pageNo,this.pageSize)
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.appliers = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  /*删除文件*/
  delFile(i,fileId,type) {
    this.deleteFileList.push(fileId);
    if(type === 0){
      this.applierAdd.file.splice(i,1);
    }else{
      this.applierEdit.file.splice(i,1);
    }
  }

  uploadbutton(){
    $('#prese').click();
  }

  uploadbutton1(){
    $('#prese1').click();

  }

  /*新增开始*/
  add() {
    this.applierAdd.file = [];
    $('.maskAdd').show();
    $('.errorMessage').html('');
    this.marketManagerService.getCommonId()
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
       this.applierAdd.applyId = data.data;
      }
    });
  }
  /*窗口关闭*/
  closeMaskAdd() {
    $('.maskAdd').hide();
    this.applierAdd =  new SupermarketApplier();
    this.deleteFileList = [];
  }
  closeMaskView(){
    $('.maskView').hide();
    this.applierView =  new SupermarketApplier();
    this.file = new Array<File>();
  }
  closemaskUpdate(){
    $('.maskUpdate').hide();
    this.applierEdit = new SupermarketApplier();
    this.deleteFileList = [];
  }
  /*更新服务商信息*/
  upload(id,files,type){
    if(typeof(files[0]) === 'object') {
      let xhr = this.marketManagerService.uploadFile(files[0], 'SupermarketApplier', id);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
          let data: any = JSON.parse(xhr.responseText);
          if (this.errorVoid.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示',
              'mes': "上传成功",
              'popType': 0,
              'imgType': 1,
            });
            if (type === 0) {
              this.applierAdd.file.push(files[0]);
              this.applierAdd.file[this.applierAdd.file.length - 1].fileId = data.data;
              this.removeErrorClass('prese');
            } else {
              this.applierEdit.file.push(files[0]);
              this.applierEdit.file[this.applierEdit.file.length - 1].id = data.data;
              this.removeErrorClass('prese1');
            }
          }
        }
      };
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
    if (data==null||data===''||data.trim() === '')  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }

  /*新增供应商*/
  addAppliar(){
    if(!this.verifyEmpty('suppliername','供应商名称不能为空')||!this.verifyEmpty('supplierstarttime','不能为空')||
      !this.verifyEmpty('supplierendtime','不能为空')||!this.verifyEmpty('supplierdetail','供应商介绍不能为空')){
      return false;
    }
    if(this.applierAdd.copStarttime > this.applierAdd.copEndtime){
      this.addErrorClass('supplierendtime', '结束时间不能早于开始时间');
      return false;
    }
    if(typeof (this.applierAdd.file) === "undefined"|| this.applierAdd.file.length === 0){
      this.addErrorClass('prese', '请上传文件');
      return false;
    }
    this.marketManagerService.providerSave(this.applierAdd)
      .subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示',
          'mes': data.msg,
          'popType': 0,
          'imgType': 1,
        });
        this.deleteFiles();
        this.closeMaskAdd();
        this.providerList(1);
      }
    });
  }
  /*删除被删除的文件*/
  deleteFiles(){
    if(this.deleteFileList.length>0){
      this.marketManagerService.delFile(this.deleteFileList)
        .subscribe(data => {
          if (this.errorVoid.errorMsg(data.status)) {
          }
        });
    }
  }

  updateAppliar(){

    if(!this.verifyEmpty('vnewnane','供应商名称不能为空')||!this.verifyEmpty('upnewstartTime','不能为空')||
      !this.verifyEmpty('upnewendTime','不能为空')||!this.verifyEmpty('supplierdetailup','供应商介绍不能为空')){
      return false;
    }
    if(this.applierEdit.copStarttime > this.applierEdit.copEndtime){
      this.addErrorClass('upnewendTime', '结束时间不能早于开始时间');
      return false;
    }
    if(typeof (this.applierEdit.file) === "undefined"||
      (this.applierEdit.file&&this.applierEdit.file.length === 0)){
      this.addErrorClass('prese1', '请上传文件');
      return false;
    }
    this.marketManagerService.providerUpdate(this.applierEdit).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示',
          'mes': data.msg,
          'popType': 0,
          'imgType': 1,
        });
        this.deleteFiles();
        this.closemaskUpdate();
        this.providerList(1);
      }
    });
  }


  view(applid){
    this.file = new Array<File>();
    this.marketManagerService.providerDetail(applid).subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.applierView = data.data;
        this.file= data.data.file;

      }
    });
    $('.maskView').show();
  }
  update(applid){
    this.upfile = new Array<File>();
    this.marketManagerService.providerDetail(applid).subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.applierEdit = data.data;
      }
    });
    $('.maskUpdate').show();
    $('.errorMessage').html('');
  }
  /*删除*/
  delete(id: number)  {
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除此条数据？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        this.marketManagerService.providerDel(id)
          .subscribe(data => {
            if (this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': "删除成功",
                'popType': 0,
                'imgType': 1,
              });
            }
            this.providerList(1);
          });
      }
    });
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

  download(url){
    window.open("proxy/" + url);
  }
}

export class File {
  fatherId:string;
  fatherType:string;
  fileAddress:string;
  fileName:string;
  id:number;
}
