import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {SaleProductEmployeeService} from "../../../service/sale-product-employee/sale-product-employee.service";
declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-liuhaolist',
  templateUrl: './liuhaolist.component.html',
  styleUrls: ['./liuhaolist.component.css'],
  providers:[UtilBuildingService,SaleProductEmployeeService],
})
export class LiuhaolistComponent implements OnInit {
  public newCard = new CardInfo();
  public buildings:Array<any>;
  public pageSize = 15;
  public pageNo = 1;
  public total = 0;
  public length = 10;
  public searchInfo = new SearchInfo();
  public record:any;
  public repairDept = [];
  private contractBool = true;
  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
    private utilBuildingService:UtilBuildingService,
    private saleProductEmployeeService:SaleProductEmployeeService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/工作台账上传");
    this.getRepairDept();
    this.searchInfo.branchName = '';
    this.searchInfo.type = '2';
    this.searchInfo.subType = '';
    this.repairSearch(1);

  }
  /*查询*/
  repairSearch(num){
    let url = '/party/report/getList/'+num+'/'+this.pageSize;
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
        this.repairDept = data.data;
      }
    });
  };
  /*点击编辑*/
  editCardInfo(index){
    this.contractBool = false;
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('编辑“六好”党支部建设月报');
    this.newCard = JSON.parse(JSON.stringify(this.record[index]));
    this.newCard.fileName = [];
    this.newCard.filePath = [];
    if(this.newCard.fileContract){
      for(let i=0;i<this.newCard.fileContract.length;i++){
        this.newCard.fileName.push(this.newCard.fileContract[i].fileName);
        this.newCard.filePath.push(this.newCard.fileContract[i].filePath);
      }
    }
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
    this.newCard = new CardInfo();
    this.newCard.branchName = '';
    this.newCard.type = '2';
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('新增“六好”党支部建设月报');
  }
  /*新增校验*/
  public verifybranchName(){
    if (!this.isEmpty('branchName', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifybTime(){
    if (!this.isEmpty('bTime', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifytypicalMethod(){
    if (!this.isEmpty('typicalMethod', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifypioneerNum(){
    if (!this.isEmpty('pioneerNum', '不能为空')) {
      return false;
    }
    return true;
  }
  /*合同上传*/
  prese_upload(files) {
    var xhr = this.utilBuildingService.uploadFileReport(files[0],'partyBuild',-1);
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
  submit(){
    var url;
    if(this.contractBool === false){
      url = "/party/update/updateSixGood";
    }else{
      url = "/party/add/addSixGood";
    }
    if (!this.verifybranchName()||!this.verifybTime()||!this.verifytypicalMethod()||!this.verifypioneerNum()) {
      return false;
    }
    let postData = JSON.parse(JSON.stringify(this.newCard));

    this.ipSetting.sendPost(url, postData).subscribe(data => {
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
    if(data === null){
      this.addErrorClass(id, error);
      return false;
    }else{
      if (data.toString().trim() === '')  {
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
}
export class CardInfo {
  id: number; // 本条信息ID
  branchName:string; // 支部名称
  type:string; // 会议类型(三会一课同级)
  subType:string; // 子类型
  month: string;// 月份
  name:string; // 文件名称
  beginTime:string; // 开始时间
  endTime:string; // 结束时间
  host:string; // 主持人
  recorder:string; // 记录人
  shouldNum:number; // 应到人数
  factNum:number; // 实到人数
  absentNum:number; // 缺席人数
  reason:string; // 缺席原因
  theme:string; // 会议主题
  note:string; // 会议议程
  address:string; // 会议地点
  fileName=[];
  filePath=[];
  fileContract:any;
  typicalMethod:string; // 典型做法篇数
  dynamicMessage:number; // 动态情况简讯篇数
}
export class SearchInfo {
  id: number; // 本条信息ID
  branchName:string; // 支部名称
  type:string; // 会议类型(三会一课同级)
  subType:string; // 子类型
  month: string;// 月份
  name:string; // 文件名称
  beginTime:string; // 开始时间
  endTime:string; // 结束时间
  host:string; // 主持人
  recorder:string; // 记录人
  shouldNum:number; // 应到人数
  factNum:number; // 实到人数
  absentNum:number; // 缺席人数
  reason:string; // 缺席原因
  theme:string; // 会议主题
  note:string; // 会议议程
  address:string; // 会议地点
}
