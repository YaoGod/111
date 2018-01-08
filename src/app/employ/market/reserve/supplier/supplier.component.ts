import { Component, OnInit } from '@angular/core';
import {SupermarketManagerService} from "../../../../service/supermarket-manager/supermarket-manager.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
  providers: [SupermarketManagerService,ErrorResponseService]
})
export class SupplierComponent implements OnInit {
  public imgPrefix: string;
  private code: any;
  public file: Array<File>;
  public upfile: Array<File>;
  public appliers:Array<GoodsApplier>;
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
    file: [],
    fileId: [],
    fileName1: [],
    filePath1: []
  };
  constructor(private marketManagerService: SupermarketManagerService,
              private ipSetting:IpSettingService ,
              private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.imgPrefix = this.ipSetting.ip;
    this.providerList();
  }
  providerList(){
    let url = '/goodsProduct/provider/list';
    this.ipSetting.sendGet(url)
    .subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        console.log(data);
        this.appliers = data.data.providers;
        console.log(this.appliers);
      }
    });
  }

  /*删除合同文件*/
  delFile(index,fileId) {
    this.applierAdd.filePath.splice(index,1);
    this.applierAdd.fileName.splice(index,1);
    /*this.marketManagerService.delFile(fileId)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data.status)) {

        }

      });*/

  }

  delFile1(index,fileId) {
    this.applierEdit.filePath1.splice(index,1);
    this.applierEdit.fileName1.splice(index,1);
    this.applierEdit.file.splice(index,1);
    let url = '/mmall/util/delFile/'+fileId[index];
    this.ipSetting.sendGet(url)
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
    /*let url = '/mmall/util/getCommonId';
    this.ipSetting.sendGet(url)
    .subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.applierAdd.applyId = data.data;
      }
    });*/
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
      file: [],
      fileId:[],
      fileName1: [],
      filePath1: []
    };
  }

  upload(files){
    if (this.applierAdd.applyId == ''){
      // this.applierAdd.applyId = 'K';
      alert("请将供应商信息填写完整!");
      return;
    }
    let url = '/mmall/util/uploadFile/'+'goodsProvider'+ '/' +this.applierAdd.applyId;
    let xhr = this.ipSetting.uploadFile(url,files[0]);

    // var xhr = this.marketManagerService.uploadFile(files[0],'SupermarketApplier',this.applierAdd.applyId);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          console.log(data);
          alert("上传成功");
          this.applierAdd.fileName.push(files[0].name);
          this.applierAdd.filePath.push(data.msg);
       //   this.applierAdd.fileId.push(data.fileId);
        }
      }
    };
  }

  upload1(files){
    if (this.applierEdit.applyId == ''){
      alert("请将供应商信息填写完整!");
      return;
    }
    let url = '/mmall/util/uploadFile/'+'goodsProvider'+ '/' +this.applierEdit.applyId;
    let xhr = this.ipSetting.uploadFile(url,files[0]);

   // var xhr = this.marketManagerService.uploadFile(files[0],'SupermarketApplier',this.applierEdit.applyId);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){
          console.log(data.msg);
          alert("上传成功");
          this.applierEdit.fileName1.push(files[0].name);
          this.applierEdit.filePath1.push(data.msg);
       //   this.applierEdit.fileId.push(data.data.fileId);
        }
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
    if (data==null||data==''||data.trim() === '')  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }

  addAppliar(){
    if(!this.verifyEmpty('suppliername','供应商名称不能为空')||!this.verifyEmpty('supplierstarttime','不能为空')||
      !this.verifyEmpty('supplierendtime','不能为空')||!this.verifyEmpty('supplierdetail','供应商介绍不能为空')){
      return false;
    }
    if(this.applierAdd.copStarttime > this.applierAdd.copEndtime){
      this.addErrorClass('supplierendtime', '结束时间不能早于开始时间');
      return false;
    }

    let url = '/goodsProduct/provider/save';
    this.ipSetting.sendPost(url,this.applierAdd)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
        console.log(data);
        alert(data.msg);
       // $('.maskAdd').hide();
        this.closeMaskAdd();
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
    let url = '/goodsProduct/provider/update';
    this.ipSetting.sendPost(url,this.applierEdit)
    .subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        alert(data.msg);
        $('.maskUpdate').hide();
        this.providerList();
      }else{
        alert(data.msg);
      }
    });
  }


  view(applid){
    this.file = new Array<File>();
    let url = '/goodsProduct/provider/detail/'+applid;
    this.ipSetting.sendGet(url)
    .subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.applierView = data.data;
        this.file= data.data.file;
        console.log(data.data);
      }
    });
    $('.maskView').show();
  }
  update(applid){
    this.upfile = new Array<File>();
    let url = '/goodsProduct/provider/detail/'+applid;
    this.ipSetting.sendGet(url)
    .subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        this.applierEdit = data.data;
        this.upfile  = data.data.file;
        this.applierEdit.fileName1 = [];
        this.applierEdit.filePath1 = [];
        this.applierEdit.fileId = [];
        if(this.upfile!=null && this.upfile.length>0){
          for(var i =0 ;i<this.upfile.length;i++){
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
    this.code = code;
    $('.confirm').fadeIn();
  }
  /*删除*/
  okFunc() {
    $('.confirm').hide();
    let url = '/goodsProduct/provider/del/'+this.code;
    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data.status)) {
          alert("删除成功");
        }
        this.providerList();
      });
  }
  noFunc() {
    $('.confirm').fadeOut();
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
  //  window.open("proxy/" + url);
    window.open(this.ipSetting.ip + url);
  }
}
export class File {
  fatherId:string;
  fatherType:string;
  fileAddress:string;
  fileName:string;
  id:number;
}

export class GoodsApplier {

  applyId:          string;/*经销商id*/
  applyName:        string;/*经销商名称*/
  copStarttime:     string;/*合作开始时间*/
  copEndtime:       string;/*合作结束时间*/
  applyDesc:        string;/*描述*/
}
