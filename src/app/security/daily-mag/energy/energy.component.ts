import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {InfoBuildingService} from "../../../service/info-building/info-building.service";


declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-energy',
  templateUrl: './energy.component.html',
  styleUrls: ['./energy.component.css'],
  providers: [InfoBuildingService,ErrorResponseService,UtilBuildingService]
})
export class EnergyComponent implements OnInit {
  public search: Search;
  public record: Array<GuardName>;
  public pages: Array<number>;
  public theadW: Array<string>;
  public theadE: Array<string>;
  public theadG: Array<string>;
  public Head:Array<string>;
  public repairname: GuardName;
  public contractName: ArchName;
  public buildings:any;
  private editBool = true;

  private pageSize = 12;
  private pageNo = 1;
  constructor(private http: Http,
              private errorVoid:ErrorResponseService,
              private utilBuildingService:UtilBuildingService,
  ) { }

  ngOnInit() {
    this.search = new Search();
    this.repairname = new GuardName();
    this.contractName = new ArchName();
    this.pages = [];
    this.theadW = ['大楼编号','大楼名称','月份','上期度数','本期度数','本月使用度数','单价','水费','操作'];
    this.theadE = ['大楼编号','大楼名称','月份','上期度数','本期度数','本月使用度数','单价','电费','操作'];
    this.theadG = ['大楼编号','大楼名称','月份','上期度数','本期度数','本月使用度数','单价','燃气费','操作'];
    this.Head = this.theadW;
    if($('.energy-header a:nth-of-type(1)').hasClass('active')){
      this.repairname.energyType = 'water';
    }else if($('.energy-header a:nth-of-type(2)').hasClass('active')) {
      this.repairname.energyType = 'electric';
    }else{
      this.repairname.energyType = 'gas';
    }
    this.getBuildings();
    this.getRecord(this.search, this.pageNo, this.pageSize);
  }
  /*获取大楼列表*/
  private getBuildings() {
    const SOFTWARES_URL = "/proxy/building/util/getBuildingList";
    this.http.get(SOFTWARES_URL)
      .map(res => res.json())
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.buildings = data['data'];
        }
      });
  }
  /*获取/查询能耗信息*/
  private getRecord(search, pageNo, pageSize) {
    const SOFTWARES_URL = "/proxy/building/energy/getEnergy/" + pageNo + "/" + pageSize;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify
    if($('.energy-header a:nth-of-type(1)').hasClass('active')){
      search.energyType = 'water';
    }else if($('.energy-header a:nth-of-type(2)').hasClass('active')) {
      search.energyType = 'electric';
    }else{
      search.energyType = 'gas';
    }
    if((typeof search.bTime) === 'undefined' || (typeof search.eTime) === 'undefined'){
      search.bTime = '';
      search.eTime = '';
    }
    search.bTime = search.bTime.replace(/-/g, "/");
    search.eTime = search.eTime.replace(/-/g, "/");

    this.http.post(SOFTWARES_URL, search, options)
      .map(res => res.json())
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.record = data['data']['infos'];
          let total = Math.ceil(data.data.total / this.pageSize);
          this.initPage(total);
        }
      });
  }
  /*用水管理*/
  waterFade(event) {
    this.pageNo = 1;
    this.pages = [];
    this.search = new Search();
    this.Head = this.theadW;
    $(event.target).addClass('active');
    $(event.target).siblings('a').removeClass('active');
    this.listSearch();
  }
  /*用电管理*/
  electricFade(event) {
    this.pageNo = 1;
    this.pages = [];
    this.search = new Search();
    this.Head = this.theadE;
    $(event.target).addClass('active');
    $(event.target).siblings('a').removeClass('active');
    this.listSearch();
  }
  /*燃气管理*/
  gasFade(event) {
    this.pageNo = 1;
    this.pages = [];
    this.search = new Search();
    this.Head = this.theadG;
    $(event.target).addClass('active');
    $(event.target).siblings('a').removeClass('active');
    this.listSearch();
  }
  /*点击导入*/
  leadIn(){
    $('#induction').fadeIn();
  }
  /*关闭导入对话框*/
  private closeInduction()  {
    $('#induction').fadeOut();
    $('#prese').val('');
  }
  /*文件上传*/
  prese_upload(files) {
    var xhr = this.utilBuildingService.importTemplate(files[0]);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': '导入成功',
            'popType': 0 ,
            'imgType': 1,
          });
          $('#prese').val('');
          $('#induction').hide();
          this.pages =[];
          this.pageNo = 1;
          this.getRecord(this.search, this.pageNo, this.pageSize);
        }else{
          $('#prese').val('');
        }
      }
    };
  }
  /*点击导出*/
  leadOut(){
    $('#deriving').fadeIn();
  }
  /*关闭导出对话框*/
  private closeDeriving() {
    $('#deriving').hide();
  }
  /*导出数据下载*/
  private downDeriving(){
    if((typeof this.search.energyType) === 'undefined'){
      //this.search.companyName = 'null';
    }
    this.search.bTime = this.search.bTime.replace(/-/g, "/");
    this.search.eTime = this.search.eTime.replace(/-/g, "/");
    this.http.get("/proxy/building/energy/getEnergyExcel/"+this.search.energyType+"?bTime="+this.search.bTime+"&eTime="+this.search.eTime)
    // .map(res => res.json())
      .subscribe(data => {
        window.location.href = "/proxy/building/energy/getEnergyExcel/"+this.search.energyType+"?bTime="+this.search.bTime+"&eTime="+this.search.eTime;
        this.search = new Search();
        $('#deriving').fadeOut();
      });
  }
  /*点击新增*/
  creatList(){
    $('.mask').fadeIn(500);
    this.repairname = new GuardName();
    $('#buildingId').attr('disabled',false);
  }
  /*点击查询*/
  listSearch(){
      this.pageNo = 1;
      this.getRecord(this.search, this.pageNo, this.pageSize);
      this.search = new Search();
  }
  /*校验信息*/
  private verifyId() {
    if (!this.isEmpty('buildingId', '不能为空')) {
      return false;
    }
    if (!this.verifyIsNumber('buildingId', '编号为数字')) {
      return false;
    }
    if (!this.verifyLength('buildingId', '请输入四位')) {
      return false;
    }
    return true;
  }
  private verifymonth() {
    if (!this.isEmpty('month', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifynomNum() {
    if (!this.isEmpty('nomNum', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyunitprice() {
    if (!this.isEmpty('unitprice', '不能为空')) {
      return false;
    }
    /*if (!this.verifyIsNumber('unitprice', '单价为数字')) {
      return false;
    }*/
    return true;
  }
  /*编辑信息*/
  editAttach(index){
    this.editBool = false;
    this.repairname = JSON.parse(JSON.stringify(this.record[index]));
    this.repairname.month = this.repairname.month.replace(/\//g, "-");
    $('.mask').fadeIn();
    $('#buildingId').attr('disabled',true);
  }
  /*删除信息*/
  delAttach(index){
    this.repairname = this.record[index];
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let SOFTWARES_URL = "/proxy/building/energy/deleteEnergyRecord/" +this.repairname.id;
        this.http.get(SOFTWARES_URL)
          .map(res => res.json())
          .subscribe(data => {
            if(this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示' ,
                'mes': data['msg'],
                'popType': 0 ,
                'imgType': 1 ,
              });
              this.pages =[];
              this.pageNo = 1;
              this.getRecord(this.search, this.pageNo, this.pageSize);
            }
          });
      }
    });
  }
  /*新增/编辑提交*/
  recordSubmit() {
    let SOFTWARES_URL;
    if(this.editBool === false) {
      this.pageNo = 1;
      SOFTWARES_URL = "/proxy/building/energy/updateEnergyRecord";
    }else {
      SOFTWARES_URL = "/proxy/building/energy/addEnergyRecord";
    }
    if (!this.verifyId() || !this.verifymonth() || !this.verifynomNum() || !this.verifyunitprice()) {
      return false;
    }
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify

    if($('.energy-header a:nth-of-type(1)').hasClass('active')){
      this.repairname.energyType = 'water';
      console.log('用水');
    }else if($('.energy-header a:nth-of-type(2)').hasClass('active')) {
      this.repairname.energyType = 'electric';
      console.log('用电');
    }else{
      this.repairname.energyType = 'gas';
      console.log('燃气');
    }
    this.repairname.month = this.repairname.month.replace(/-/g, "/");
    this.http.post(SOFTWARES_URL, this.repairname, options)
      .map(res => res.json())
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': this.editBool === false?'更改成功':'新增成功',
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.getRecord(this.search, this.pageNo, this.pageSize);
          this.recordCancel();
        }
      });
  }
  /*新增和编辑界面的取消按钮*/
  recordCancel() {
    this.repairname = new GuardName();
    $('.errorMessage').html('');
    $('.mask').hide();
  }
  /*页码初始化*/
  initPage(total) {
    this.pages = new Array(total);
    for(let i = 0;i< total ;i++) {
      this.pages[i] = i+1;
    }
  }
  /*页面显示区间5页*/
  pageLimit(page:number) {
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
  goPage(page:number) {
    this.pageNo = page;
    if($('.energy-header a:last-child').hasClass('active')) {
      // this.getRecordSecond(this.searchArch, this.pageNo, this.pageSize);
    }else {
     // this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
    }
  }
  /**非空校验*/
  private isEmpty(id: string, error: string): boolean  {
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
  /**邮箱格式校验*/
  private verifyIsEmail(id: string, error?: string): boolean {
    const data =  $('#' + id).val();
    if (!String(data).match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
      this.addErrorClass(id,  '请填写正确邮箱');
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /** 匹配数字*/
  private verifyIsNumber(id: string, error: string): boolean  {
    const data =  $('#' + id).val();// /^[0-9]*$/
    if (!String(data).match(/^[0-9]*$/))  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /** 验证手机号码*/
  private verifyIsTel(id: string, error?: string): boolean {
    const data =  $('#' + id).val();
    if (!String(data).match( /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/ )){
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /**校验字符长度小于4*/
  private verifyLength(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (data.length < 4)  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /**添加错误信息class*/
  private  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /**去除错误信息class*/
  private  removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').removeClass('form-error');
    $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
  }
}
export class Search {
  buildingId: string; // 大楼编号
  buildingName: string;  // 大楼名称
  bTime: string; // 开始时间
  eTime: string; // 结束时间
  energyType:string; // 类型
}
export class GuardName {
  id: number; // 本条信息ID
  buildingId: string;
  buildingName: string;
  energyType: string; // 能耗类型
  month: string;// 月份
  lastNum: string;// 上期度数
  nomNum: string;// 本期度数
  useNum: string;// 使用度数
  unitprice: string;// 单价
  cost: string;// 费用
}
export class ArchName {
  id: number; // 本条信息ID
  buildingId: string;
  buildingName: string;
  equipmentName:string; // 设备名称
  equipModel: string;// 设备型号
  maintenance:string; // 维保单位
  mType: string; // 维保类型
  liablePerson:string; // 维保责任人
  liableBtime: string; // 维保开始日期
  liableEtime: string; // 维保结束日期
  liableNextTime: string;// 下次维保日期
  liableCost:string; // 维保费用
  liableNote: string; // 维保情况
}
