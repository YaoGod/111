import { Component, OnInit } from '@angular/core';

import { MinLengthPipe } from "../../../market/supermarket/supermarketApplier/min-length.pipe";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {IpSettingService} from "app/service/ip-setting/ip-setting.service";

import * as $ from 'jquery';
declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-facilitator',
  templateUrl: './facilitator.component.html',
  styleUrls: ['./facilitator.component.css'],
  providers: [ErrorResponseService,SupermarketManagerService,MinLengthPipe]
})
export class FacilitatorComponent implements OnInit {
  public ipServer: String;
  private code: any;
  public file: Array<File>;
  public search: Facilitator;
  public upfile: Array<File>;
  public appliers:Array<Facilitator>;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public  applierAdd={
    applyId:   '',
    applyName:    '',
    copStarttime:  '',
    copEndtime:     '',
    applyDesc:      '',
    fileId:[],
    fileName: [],
    filePath: []
  };
  public  applierView={
    applyId:   '',
    applyName:    '',
    copStarttime:  '',
    copEndtime:     '',
    applyDesc:      '',
  };
  public  applierEdit={
    applyId:   '',
    applyName:    '',
    copStarttime:  '',
    copEndtime:     '',
    applyDesc:      '',
    fileId: [],
    fileName1: [],
    filePath1: []
  };
  constructor(private marketManagerService: SupermarketManagerService,
              private ipSetting: IpSettingService,
              private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.search = new Facilitator();
    this.ipServer = this.ipSetting.ip;
    this.pages = [];
    this.providerList();
  }
  providerList(){
    let url = '/mmall/laundry/provider/providerList/'+this.pageNo + '/' + this.pageSize;

    this.ipSetting.sendPost(url,this.search)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.appliers = data.data.providers;
          // console.log(data.data);
          this.total = data.data.total;
        }
      });
  }
  /*删除合同文件*/
  delFile(index,fileId) {
    this.applierAdd.filePath.splice(index,1);
    this.applierAdd.fileName.splice(index,1);
    console.log(index+"======"+fileId);
    this.marketManagerService.delFile(fileId)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
        }
      });
  }
  delFile1(index,fileId) {
    this.applierEdit.filePath1.splice(index,1);
    this.applierEdit.fileName1.splice(index,1);
    this.marketManagerService.delFile(fileId)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
        }
      });
  }
  uploadbutton(){
    $('#prese').click();
  }

  uploadbutton1(){
    $('#prese1').click();
  }
  /*新增开始*/
  add() {
    $('.maskAdd').show();
    let url = '/mmall/util/getCommonId/';
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.applierAdd.applyId = data.data;
      }
    });
  }
  closeMaskAdd() {
    $('.maskAdd').hide();
    this.applierAdd= {
      applyId:   '',
      applyName:    '',
      copStarttime:  '',
      copEndtime:     '',
      applyDesc:      '',
      fileId:[],
      fileName: [],
      filePath: []
    };
  }
  closeMaskView(){
    $('.maskView').hide();
    this.applierView={
      applyId:   '',
      applyName:    '',
      copStarttime:  '',
      copEndtime:     '',
      applyDesc:      ''
    };
    this.file = new Array<File>();
  }
  closemaskUpdate(){
    $('.maskUpdate').hide();
    this.applierEdit ={
      applyId:   '',
      applyName:    '',
      copStarttime:  '',
      copEndtime:     '',
      applyDesc:      '',
      fileId:[],
      fileName1: [],
      filePath1: []
    };
  }

  upload(files){
    let xhr = this.marketManagerService.uploadFile(files[0],'laundry',this.applierAdd.applyId);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){
          // console.log(data);
          confirmFunc.init({
            'title': '提示' ,
            'mes': '上传成功',
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.applierAdd.fileName.push(files[0].name);
          this.applierAdd.filePath.push(data.msg);
          this.applierAdd.fileId.push(data.fileId);
          $('#prese').val('');
        }
      }else if(xhr.readyState === 4 && xhr.status === 413){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件太大',
          'popType': 0 ,
          'imgType': 2,
        });
        $('#prese').val('');
        return false;
      }
    };
  }
  upload1(files){
    let xhr = this.marketManagerService.uploadFile(files[0],'laundry',this.applierEdit.applyId);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){
          // console.log(data);
          confirmFunc.init({
            'title': '提示' ,
            'mes': '上传成功',
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.applierEdit.fileName1.push(files[0].name);
          this.applierEdit.filePath1.push(data.msg);
          this.applierEdit.fileId.push(data.fileId);
          $('#prese1').val('');
        }
      }else if(xhr.readyState === 4 && xhr.status === 413){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件太大',
          'popType': 0 ,
          'imgType': 2,
        });
        $('#prese1').val('');
        return false;
      }
    };
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
    if (data==null||data==''||data.trim() == '')  {
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
    let url = "/mmall/laundry/provider/providerSave";
    this.ipSetting.sendPost(url,this.applierAdd).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': data['msg'],
          'popType': 0 ,
          'imgType': 1 ,
        });
        $('.maskAdd').hide();
        this.providerList();
      }
    });
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
    let url = "/mmall/laundry/provider/providerUpdate";
    this.ipSetting.sendPost(url,this.applierEdit).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        alert(data.msg);
        $('.maskUpdate').hide();
        this.providerList();
      }
    });
  }
  /*查看*/
  view(applid){
    this.file = new Array<File>();
    let url = "/mmall/laundry/provider/detail/"+applid;
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.applierView = data.data;
        this.file= data.data.file; // console.log(data.data);
      }
    });
    $('.maskView').show();
  }

  update(applid){
    this.upfile = new Array<File>();
    let url = "/mmall/laundry/provider/detail/"+applid;
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.applierEdit = data.data;
        this.upfile = data.data.file;
        this.applierEdit.fileName1 = [];
        this.applierEdit.filePath1 = [];
        this.applierEdit.fileId = [];
        if(this.upfile!=null && this.upfile.length>0){
          for(let i =0 ;i<this.upfile.length;i++){
            this.applierEdit.fileName1.push(this.upfile[i].fileName);
            this.applierEdit.filePath1.push(this.upfile[i].fileAddress);
            this.applierEdit.fileId.push(this.upfile[i].id);
          }
        }
      }
    });
    $('.maskUpdate').show();
  }
  delete(code: number) {
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除？',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        let url = "/mmall/laundry/provider/del/" + code;
        this.ipSetting.sendGet(url).subscribe(data => {
          if (this.errorVoid.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示' ,
              'mes': data['msg'],
              'popType': 0 ,
              'imgType': 1 ,
            });
          }
          this.providerList();
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

  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    if(this.search==null){
      this.search = new Facilitator();
    }
    this.providerList();
  }
}

export class Facilitator {
  applyId:          string;/*经销商id*/
  applyName:        string;/*经销商名称*/
  copStarttime:     string;/*合作开始时间*/
  copEndtime:       string;/*合作结束时间*/
  applyDesc:        string;/*描述*/
}
export class File {
  fatherId:string;
  fatherType:string;
  fileAddress:string;
  fileName:string;
  id:number;
}
