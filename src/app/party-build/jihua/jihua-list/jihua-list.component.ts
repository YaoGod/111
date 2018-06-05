import { Component, OnInit } from '@angular/core';
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {SaleProductEmployeeService} from "../../../service/sale-product-employee/sale-product-employee.service";
declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-jihua-list',
  templateUrl: './jihua-list.component.html',
  styleUrls: ['./jihua-list.component.css'],
  providers: [SaleProductEmployeeService]
})
export class JihuaListComponent implements OnInit {

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
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
    private saleProductEmployeeService:SaleProductEmployeeService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/党委委员调研党支部信息");
    this.getRepairDept();
    this.searchInfo.branchName = "";
    this.searchInfo.subType = "";
    this.searchInfo.type = "6";
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
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('编辑“党支部工作计划和总结”');
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
    this.newCard.type = "6";
    this.newCard.fileName = [];
    this.newCard.filePath = [];
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('新增“党支部工作计划和总结”');
  }
  /*新增校验*/
  public verifybranchName(){
    if (!this.isEmpty('branchName', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifynewtype(){
    if(!this.isEmpty('type', '不能为空')){
      return false;
    }
    return true;
  }
  public verifybTime(){
    if (!this.isEmpty('month', '不能为空')) {
      return false;
    }
    return true;
  }
   submit(){
    let url;
    if(this.contractBool === false){
      url = "/party/update/updateWorkInfo";
    }else{
      url = "/party/add/addWorkInfo";
    }
    if (!this.verifybranchName()||!this.verifynewtype() ||!this.verifybTime() ) {
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
  /*合同上传*/
  prese_upload(files) {
    var xhr = this.ipSetting.uploadFile("/party/report/uploadFile/partyBuild/-1",files[0]);
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
  month: string;// 月份
  bTime:string; // 开始时间
  eTime:string; // 结束时间
  filePath: Array<string>;
  fileName: any; // 文件名称
  subType: string; // 小标题
  fileContract: Array<any>;
}
