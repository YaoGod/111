import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-sanhuilist',
  templateUrl: './sanhuilist.component.html',
  styleUrls: ['./sanhuilist.component.css'],
  providers:[UtilBuildingService,],
})
export class SanhuilistComponent implements OnInit {
  public newCard = new CardInfo();
  public buildings:Array<any>;
  public pageSize = 15;
  public pageNo = 1;
  public total = 0;
  public length = 10;
  public searchInfo = new CardInfo();
  public record:any;
  private contractBool = true;
  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
    private utilBuildingService:UtilBuildingService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/工作台账上传");
    this.buildings = [
      {id: 1,url:'sanhui',name:'（一）、三会一课',imgPath:'sanhuiyike.png'},
      {id: 2,url:'sanhui',name:'（二）、“六好”党支部建设月报',imgPath:'liuhaoyuebao.png'},
      {id: 3,url:'sanhui',name:'（三）、"主题党日"活动简报',imgPath:'huodongjianbao.png'},
      {id: 4,url:'sanhui',name:'（四）、党建实践案例',imgPath:'shijiananli.png'},
      {id: 5,url:'sanhui',name:'（五）、党委委员调研党支部信息',imgPath:'dangweidiaoyan.png'},
      {id: 6,url:'sanhui',name:'（六）、党支部工作计划和总结',imgPath:'jihuazongjie.png'},
      {id: 7,url:'sanhui',name:'（七）、党支部岗区队建设情况',imgPath:'quduijianshe.png'}];

    this.record = [
      {id:1,branchName:'中国移动市场部支委',type:'党员大会',theme:'研究党性原则的重要性',bTime:'2018/5/1 10:00',eTime:'2018/5/1 12:00',},
      {id:2,branchName:'中国移动市场部支委',type:'党员大会',theme:'研究党性原则的重要性',bTime:'2018/5/1 10:00',eTime:'2018/5/1 12:00',},
      {id:3,branchName:'中国移动市场部支委',type:'党员大会',theme:'研究党性原则的重要性',bTime:'2018/5/1 10:00',eTime:'2018/5/1 12:00',},
      {id:4,branchName:'中国移动市场部支委',type:'党员大会',theme:'研究党性原则的重要性',bTime:'2018/5/1 10:00',eTime:'2018/5/1 12:00',},
      {id:5,branchName:'中国移动市场部支委',type:'党员大会',theme:'研究党性原则的重要性',bTime:'2018/5/1 10:00',eTime:'2018/5/1 12:00',},
      {id:6,branchName:'中国移动市场部支委',type:'党员大会',theme:'研究党性原则的重要性',bTime:'2018/5/1 10:00',eTime:'2018/5/1 12:00',},
      {id:7,branchName:'中国移动市场部支委',type:'党员大会',theme:'研究党性原则的重要性',bTime:'2018/5/1 10:00',eTime:'2018/5/1 12:00',},
      {id:8,branchName:'中国移动市场部支委',type:'党员大会',theme:'研究党性原则的重要性',bTime:'2018/5/1 10:00',eTime:'2018/5/1 12:00',}
    ]




  }
  /*查询*/
  repairSearch(num){
    let url = "/building/parking/getParkingPermitList/list/"+num+"/"+this.pageSize+'?type='+
      this.searchInfo.type+'&&month='+this.searchInfo.month+'&&branchName='+this.searchInfo.branchName;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        console.log(data.data);
        this.record = data.data.infos;
        this.total = data.data.total;
      }
    });
  }

  /*点击编辑*/
  editCardInfo(id){
    this.contractBool = false;
    $('.form-add').attr('disabled',false);
    $('.form-disable').attr('disabled',true).css('backgroundColor','#f8f8f8');
    let url = '/building/parking/getParkingPermitInfo/'+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        $('.mask').fadeIn();
        $('.mask .mask-head p').html('编辑会议记录');
        // this.newCard = data.data.object;

      }
    });
  }
  /*点击删除*/
  delCardInfo(id){
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let url = '/building/parking/deleteParkingPermitInfo/'+id;
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
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('新增会议记录');
  }
  /*新增校验*/
  public verifybranchName(){
    if (!this.isEmpty('branchName', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifynewtype(){
    if(!this.isEmpty('newtype', '不能为空')){
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
  public verifyeTime(){
    if (!this.isEmpty('eTime', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifycompere(){
    if (!this.isEmpty('compere', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyrecorder(){
    if (!this.isEmpty('recorder', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyshouldNum(){
    if (!this.isEmpty('shouldNum', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyfactNum(){
    if (!this.isEmpty('factNum', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyabsentNum(){
    if (!this.isEmpty('absentNum', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyreason(){
    if (!this.isEmpty('reason', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifytheme(){
    if (!this.isEmpty('theme', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifynote(){
    if (!this.isEmpty('repairNote', '不能为空')) {
      return false;
    }
    return true;
  }
  /*合同上传*/
  prese_upload(files) {
    var xhr = this.utilBuildingService.uploadFile(files[0],'sanhui',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.newCard.fileName.push(files[0].name);
          this.newCard.filePath.push(data.msg);

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
      url = "/building/parking/updateParkingPermitInfo";
    }else{
      url = "/building/parking/addParkingPermitInfo";
    }
    if (!this.verifybranchName()||!this.verifynewtype() ) {
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
  type:string; // 会议类型
  month: string;// 月份

  bTime:string; // 开始时间
  eTime:string; // 结束时间
  compere:string; // 主持人
  recorder:string; // 记录人
  shouldNum:number; // 应到人数
  factNum:number; // 实到人数
  absentNum:number; // 缺席人数
  reason:string; // 缺席原因
  theme:string; // 会议主题
  note:string; // 会议议程
  fileName=[];
  filePath=[];
}
