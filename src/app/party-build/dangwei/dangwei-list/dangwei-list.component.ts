import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {SaleProductEmployeeService} from "../../../service/sale-product-employee/sale-product-employee.service";
declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-dangwei-list',
  templateUrl: './dangwei-list.component.html',
  styleUrls: ['./dangwei-list.component.css'],
  providers: [SaleProductEmployeeService]
})
export class DangweiListComponent implements OnInit {

  public newCard = new CardInfo();
  public deptList:Array<any>;
  public pageSize = 15;
  public pageNo = 1;
  public total = 0;
  public length = 10;
  public searchInfo = new CardInfo();
  public record: Array<CardInfo>;
  private contractBool = true;
  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
    private saleProductEmployeeService:SaleProductEmployeeService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/党委委员调研党支部信息");
    this.searchInfo.createUserId = localStorage.getItem("username");
    this.searchInfo.branchName = "";
    this.searchInfo.type = "5";
    this.getRepairDept();
    this.repairSearch(1);
  }
  /*查询*/
  repairSearch(num){
    this.pageNo  = num;
    let url = "/party/report/getList/"+this.pageNo+"/"+this.pageSize;
    this.ipSetting.sendPost(url,this.searchInfo).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.record = data.data.list;
        this.total = data.data.total;
      }
    });
  }

  /*获取部门列表*/
  getRepairDept(){
    this.saleProductEmployeeService.getDeptList().subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.deptList = data.data;
      }
    });
  };
  /*点击编辑*/
  editCardInfo(inner){
    this.contractBool = false;
    $('.form-add').attr('disabled',false);
    $('.form-disable').attr('disabled',true).css('backgroundColor','#f8f8f8');
    this.newCard = JSON.parse(JSON.stringify(inner));
    this.newCard.fileName = [];
    this.newCard.filePath = [];
    for(let i = 0;i<this.newCard.fileContract.length;i++){
      this.newCard.filePath.push(this.newCard.fileContract[i].filePath);
      this.newCard.fileName.push(this.newCard.fileContract[i].fileName);
    }
    this.newCard.subType = "党委委员调研";
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('编辑“党委委员调研党支部信息”');
  }
  /*点击删除*/
  delCardInfo(id){
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let url = '/party/report/delete/'+id;
        this.ipSetting.sendGet(url).subscribe(data => {
          if(this.errorVoid.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示' ,
              'mes': data['msg'],
              'popType': 0 ,
              'imgType': 1 ,
            });
            this.repairSearch(1);
          }
        });
      }
    });
  }
  /*点击新增*/
  addVehicle(){
    this.contractBool = true;
    $('.form-disable').attr('disabled',false).css('backgroundColor','#fff');
    this.newCard = new CardInfo();
    this.newCard.branchName = "";
    this.newCard.type = "5";
    this.newCard.subType = "党委委员调研";
    this.newCard.fileName = [];
    this.newCard.filePath = [];
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('新增“党委委员调研党支部信息”');
  }
  /*新增校验*/
  public verifyEmpty(id){
    if (!this.isEmpty(id, '不能为空')) {
      return false;
    }
    return true;
  }

  submit(){
    let url;
    if(this.contractBool === false){
      url = "/party/update/updateSurvey";
    }else{
      url = "/party/add/addSurvey";
    }
    if (!this.verifyEmpty('branchName')||!this.verifyEmpty('month')||!this.verifyEmpty('partyWorkerName')
      ||!this.verifyEmpty('themeTitle')) {
      return false;
    }

    this.ipSetting.sendPost(url, this.newCard).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        confirmFunc.init({
          'title': '提示' ,
          'mes': this.contractBool === false?'更新成功':'新增成功',
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.repairSearch(1);
        this.addCancel();
      }
    });
  }
  /*取消*/
  addCancel(){
    $('.mask,.mask1,.mask2').fadeOut();
    $('.errorMessage').html('');
  }
  /**非空校验*/
  public isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if(typeof(data)==="undefined" || data === null){
      this.addErrorClass(id, error);
      return false;
    }else{
      if (typeof(data)!=="undefined" && data.toString().trim() === '')  {
        this.addErrorClass(id, error);
        return false;
      }else {
        this.removeErrorClass(id);
        return true;
      }
    }
  }
  /** 添加错误信息class */
  public  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-inp').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /**去除错误信息class */
  public  removeErrorClass(id: string) {
    $('#' + id).parents('.form-inp').removeClass('form-error');
    $('#' + id).parents('.form-inp').children('.errorMessage').html('');
  }
  /*附件上传*/
  prese_upload(files) {
    let xhr = this.ipSetting.uploadFile("/party/report/uploadFile/partyBuild/-1",files[0]);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.newCard.fileName.push(files[0].name);
          this.newCard.filePath.push(data.data);

          confirmFunc.init({
            'title': '提示' ,
            'mes': '上传成功',
            'popType': 0 ,
            'imgType': 1,
          });
          $('#prese').val('');
        }
      }else if (xhr.readyState === 4 && xhr.status === 413){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件太大',
          'popType': 0 ,
          'imgType': 2,
        });
        $('#prese').val('');
      }
    };
  }
  /*删除合同文件*/
  delFile(index) {
    this.newCard.filePath.splice(index,1);
    this.newCard.fileName.splice(index,1);
  }
}
export class CardInfo {
  id: number; // 本条信息ID
  branchName:string; // 支部名称
  type:string; // 类型
  createUserId:string;
  filePath:Array<any>;
  fileName: Array<any>; // 文件名称
  host: string;  // 党委委员
  theme: string; // 调研主题
  month: string;   // 月份
  subType: string;
  fileContract: Array<any>;
}
