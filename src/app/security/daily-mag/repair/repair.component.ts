import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {DomSanitizer} from '@angular/platform-browser';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import {InfoBuildingService} from "../../../service/info-building/info-building.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";

declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-repair',
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.css'],
  providers: [InfoBuildingService,ErrorResponseService,UtilBuildingService]
})
export class RepairComponent implements OnInit {
  public repairname: RepairName;
  public record: Array<RepairName>;
  public contractName: ContractName;
  public contract : Array<ContractName>;
  private pageSize = 5;
  private pageNo = 1;
  public pages: Array<number>;
  public searchRepair : SearchRecord;
  public searchContract : SearchContract;
  private editBool = true;
  private beginTime :string;
  private endTime :string;
  private contractBool = true;
  constructor(
    private http: Http,
    private errorVoid:ErrorResponseService,
    private utilBuildingService:UtilBuildingService,
  ) { }

  ngOnInit() {
    this.repairname = new RepairName();
    this.contractName = new ContractName();
    this.searchRepair = new SearchRecord();
    this.searchContract = new SearchContract();
    this.beginTime = '';
    this.endTime = '';
    this.repairname.repairType = '';
    this.contractName.contractType = 'repair';
    this.contractName.fileName = [];
    this.contractName.filePath = [];

    if($('.repair-header a:last-child').hasClass('active')){
      $('.repair-contract,.box2').fadeIn();
      this.getRecordSecond(this.searchRepair, this.pageNo, this.pageSize);
    }else{
      $('.repair-record,.box1').fadeIn();
      this.getRecord(this.searchRepair, this.pageNo, this.pageSize);
    }
  }
  /*setTimePicker() {
    $('#datepicker').pickadate({
      monthsFull: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      weekdaysShort: ['日', '一', '二', '三', '四', '五', '六'],
      today: '今天',
      clear: '清空',
      close: '关闭',
      firstDay: 1,
      format: 'yyyy-mm-dd',
      formatSubmit: 'yyyy-mm-dd',
      max: true,
      onSet: ( context => {
        this.searchContract.contractBtime =  $('#datepicker').val();
      })
    });
  }*/

  /*点击新增*/
  repairNew() {
    if($('.repair-header a:last-child').hasClass('active')){
      $('.mask-contract').fadeIn();
    }else{
      $('.mask-repair').fadeIn();
    }
  }
  /*获取/查询维修记录*/
  private getRecord(search, pageNo, pageSize) {
    const SOFTWARES_URL = "/proxy/building/repair/getRepairList/" + pageNo + "/" + pageSize;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify
    search.repairBtime = this.beginTime.replace(/-/g, "/");
    search.repairEtime = this.endTime.replace(/-/g, "/");
    this.http.post(SOFTWARES_URL, search, options)
      .map(res => res.json())
      .subscribe(data => {
        if (data['status'] === 0) {
          this.record = data['data']['infos'];
          let total = Math.ceil(data.data.total / this.pageSize);
          this.initPage(total);
        }else if (data['status'] === 1) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': data['msg'],
            'popType': 0 ,
            'imgType': 2 ,
          });
        }
      });
  }
  /*点击查询*/
  repairSearch() {
    //console.log(this.endTime==='');
    //console.log(this.beginTime==='');
    if(((this.endTime === '' && this.beginTime !== '') || (this.endTime !== '' && this.beginTime === '') || ((this.beginTime !==
      '' &&  this.endTime !== '') && this.beginTime <= this.endTime)) || (this.beginTime === '' && this.endTime === '')){
      if($('.repair-header a:last-child').hasClass('active')){
        console.log('执行合同');
        this.getRecordSecond(this.searchContract, this.pageNo, this.pageSize);
      }else{
        console.log('执行记录');
        this.getRecord(this.searchRepair, this.pageNo, this.pageSize);
      }
    }else{
      confirmFunc.init({
        'title': '提示' ,
        'mes': '开始时间要大于结束时间',
        'popType': 0 ,
        'imgType': 2 ,
      });
    }
  }
  /*编辑维修记录*/
  editRecord(index) {
    this.editBool = false;
    this.repairname = this.record[index];
    this.repairname.repairBtime = this.repairname.repairBtime.replace(/\//g, "-");
    this.repairname.repairEtime = this.repairname.repairEtime.replace(/\//g, "-");
    $('.mask-repair').fadeIn();
  }
  /*删除装修记录*/
  delRecord(index) {
    this.repairname = this.record[index];
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除此记录？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let SOFTWARES_URL = "/proxy/building/repair/deleteRepairRecord/" +this.repairname.id;
        this.http.get(SOFTWARES_URL)
          .map(res => res.json())
          .subscribe(data => {
            if (data['status'] === 0) {
              confirmFunc.init({
                'title': '提示' ,
                'mes': data['msg'],
                'popType': 0 ,
                'imgType': 1 ,
              });
              this.searchRepair = new SearchRecord();
              this.getRecord(this.searchRepair, this.pageNo, this.pageSize);
            }else if (data['status'] === 1) {
              confirmFunc.init({
                'title': '提示' ,
                'mes': data['msg'],
                'popType': 0 ,
                'imgType': 2 ,
              });
            }
          });
      }
    });
  }
  /*记录新增和编辑界面的取消按钮*/
  recordCancel() {
    this.repairname = new RepairName();
    $('.form-control').removeClass('form-error');
    $('.errorMessage').html('');
    this.repairname.repairType = '';
    $('.mask-repair').hide();
  }

  /*维修记录校验规则*/
  private verifyId() {
    if (!this.isEmpty('Id', '大楼编号不能为空')) {
      return false;
    }
    if (!this.verifyIsNumber('Id', '请输入纯数字编号')) {
      return false;
    }
    if (!this.verifyLength('Id', '请输入四位数字')) {
      return false;
    }
    return true;
  }
  private verifyRecordId() {
    if (!this.isEmpty('recordId', '编号不能为空')) {
      return false;
    }/*if (!this.verifyIsBlend('recordId', '联系人不能包含特殊字符'))  {return false;}*/
    return true;
  }
  private verifyRepairType() {
    if (!this.isEmpty('repairType', '维修类型不能为空')) {
      return false;
    }
    return true;
  }
  private verifyCmccDepartment() {
    if (!this.isEmpty('cmccDepartment', '部门不能为空')) {
      return false;
    }
    return true;
  }
  private verifyCmccContacts() {
    if (!this.isEmpty('cmccContacts', '部门联系人不能为空')) {
      return false;
    }
    return true;
  }
  private verifyCmccPhone()  {
    if (!this.isEmpty('cmccPhone', '维修部门电话不能为空')) {
      return false;
    }
    if (!this.verifyIsTel('cmccPhone', '请输入正确的手机号')) {
      return false;
    }
    return true;
  }
  private verifyRepairDepartment() {
    if (!this.isEmpty('repairDepartment', '维修商不能为空')) {
      return false;
    }
    return true;
  }
  private verifyRepairContacts() {
    if (!this.isEmpty('repairContacts', '维修联系人不能为空')) {
      return false;
    }
    return true;
  }
  private verifyRepairPhone()  {
    if (!this.isEmpty('repairPhone', '电话不能为空')) {
      return false;
    }
    if (!this.verifyIsTel('repairPhone', '请输入正确的手机号')) {
      return false;
    }
    return true;
  }
  private verifyRepairBtime() {
    if (!this.isEmpty('repairBtime', '时间不能为空')) {
      return false;
    }
    return true;
  }
  private verifyRepairEtime() {
    if (!this.isEmpty('repairEtime', '时间不能为空')) {
      return false;
    }
    return true;
  }
  private verifyRepairCost() {
    if (!this.isEmpty('repairCost', '费用不能为空')) {
      return false;
    }
    if (!this.verifyIsNumber('repairCost', '请输入正确的费用')) {
      return false;
    }
    return true;
  }
  private verifyRepairNote() {
    if (!this.isEmpty('repairNote', '维修详情不能为空')) {
      return false;
    }
    return true;
  }

  // 新增/编辑维修记录提交
  recordSubmit() {
    let SOFTWARES_URL;
    if(this.editBool === false){
      this.pageNo = 1;
      SOFTWARES_URL = "/proxy/building/repair/updateRepairRecord";
    }else{
      SOFTWARES_URL = "/proxy/building/repair/addRepairRecord";
    }
    if (!this.verifyId() || !this.verifyRecordId() || !this.verifyRepairType() || !this.verifyCmccDepartment() ||
      !this.verifyCmccContacts() || !this.verifyCmccPhone() || !this.verifyRepairDepartment() || !this.verifyRepairContacts() ||
      !this.verifyRepairPhone() || !this.verifyRepairBtime() || !this.verifyRepairEtime() || !this.verifyRepairCost() ||
      !this.verifyRepairNote()) {
      return false;
  }
    if(this.repairname.repairBtime > this.repairname.repairEtime){
      confirmFunc.init({
        'title': '提示' ,
        'mes': '开始时间要小于结束时间',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify
    this.repairname.repairBtime = this.repairname.repairBtime.replace(/-/g, "/");
    this.repairname.repairEtime = this.repairname.repairEtime.replace(/-/g, "/");
    //console.log(this.repairname);
    this.http.post(SOFTWARES_URL, this.repairname, options)
      .map(res => res.json())
      .subscribe(data => {
        if (data['status'] === 0) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': this.editBool === false?'更改成功':'新增成功',
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.searchRepair = new SearchRecord();
          this.getRecord(this.searchRepair, this.pageNo, this.pageSize);
          this.recordCancel();
        }else if (data['status'] === 1) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': data['msg'],
            'popType': 0 ,
            'imgType': 2 ,
          });
          this.repairname.repairBtime = this.repairname.repairBtime.replace(/\//g, "-");
          this.repairname.repairEtime = this.repairname.repairEtime.replace(/\//g, "-");
        }
      });
  }
  /*点击大楼维修记录*/
  recordFade(event) {
    this.beginTime = '';
    this.endTime = '';
    this.pageNo = 1;
    $(event.target).addClass('active');
    $(event.target).siblings('a').removeClass('active');
    this.repairSearch();
    $('.box1').show();
    $('.box2').hide();
    $('.repair-record').fadeIn();
    $('.repair-contract').hide();
  }
  /*点击大楼维修合同*/
  contractFade(event) {
    this.beginTime = '';
    this.endTime = '';
    this.pageNo = 1;
    $(event.target).addClass('active');
    $(event.target).siblings('a').removeClass('active');
    this.repairSearch();
    $('.box1').hide();
    $('.box2').show();
    $('.repair-contract').fadeIn();
    $('.repair-record').hide();
  }
  /*获取/查询维修合同*/
  private getRecordSecond(search, pageNo, pageSize) {
    const SOFTWARES_URL = "/proxy/building/repair/getRepairContract/" + pageNo + "/" + pageSize;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    //search.contractType = 'repair';
    // JSON.stringify
    this.searchContract.contractBtime = this.beginTime.replace(/-/g, "/");
    this.searchContract.contractEtime = this.endTime.replace(/-/g, "/");
    this.http.post(SOFTWARES_URL, search, options)
      .map(res => res.json())
      .subscribe(data => {
        if (data['status'] === 0) {
          this.contract = data['data']['infos'];
          let total = Math.ceil(data.data.total / this.pageSize);
          this.initPage(total);
        }else if (data['status'] === 1) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': data['msg'],
            'popType': 0 ,
            'imgType': 2 ,
          });
        }
      });
  }
  /* 编辑维修合同*/
  editContract(index){
    this.contractBool = false;
    this.contractName = this.contract[index];
    this.contractName.contractBtime = this.contractName.contractBtime.replace(/\//g, "-");
    this.contractName.contractEtime = this.contractName.contractEtime.replace(/\//g, "-");
    $('.mask-contract').fadeIn();
  }
  /* 删除维修合同*/
  delContract(index){
    this.contractName = this.contract[index];
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除此记录？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let SOFTWARES_URL = "/proxy/building/repair/deleteRepairContract/" +this.contractName.id;
        this.http.get(SOFTWARES_URL)
          .map(res => res.json())
          .subscribe(data => {
            if (data['status'] === 0) {
              confirmFunc.init({
                'title': '提示' ,
                'mes': data['msg'],
                'popType': 0 ,
                'imgType': 1 ,
              });
              this.searchContract = new SearchContract();
              this.getRecordSecond(this.searchContract, this.pageNo, this.pageSize);
            }
            else if (data['status'] === 1) {
              confirmFunc.init({
                'title': '提示' ,
                'mes': data['msg'],
                'popType': 0 ,
                'imgType': 2 ,
              });
            }
          });
      }
    });
  }
  /*删除合同文件*/
  delFile(index){
    this.contractName.filePath.splice(index,1);
    this.contractName.fileName.splice(index,1);
  }
  /*合同上传*/
  prese_upload(files){
    var xhr = this.utilBuildingService.uploadFile(files[0],'repair',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          // this.newBuilding.imgPath = data.msg;

          this.contractName.fileName.push(files[0].name);
          this.contractName.filePath.push(data.msg);
          console.log(this.contractName.fileName);
          confirmFunc.init({
            'title': '提示' ,
            'mes': '上传成功',
            'popType': 0 ,
            'imgType': 1,
          });
        }
      }
    };
  }
  /*合同信息校验*/
  private verifyContractId() {
    if (!this.isEmpty('contractId', '大楼编号不能为空')) {
      return false;
    }
    if (!this.verifyIsNumber('contractId', '请输入纯数字编号')) {
      return false;
    }
    if (!this.verifyLength('contractId', '请输入四位数字')) {
      return false;
    }
    return true;
  }
  private verifyCmccName() {
    if (!this.isEmpty('cmccName', '甲方不能为空')) {
      return false;
    }
    return true;
  }
  private verifycontractcmccContacts() {
    if (!this.isEmpty('contractcmccContacts', '甲方联系人不能为空')) {
      return false;
    }
    return true;
  }
  private verifycontractcmccPhone()  {
    if (!this.isEmpty('contractcmccPhone', '甲方联系电话不能为空')) {
      return false;
    }
    if (!this.verifyIsTel('contractcmccPhone', '请输入正确的手机号')) {
      return false;
    }
    return true;
  }
  private verifycontractname2() {
    if (!this.isEmpty('contractname2', '乙方不能为空')) {
      return false;
    }
    return true;
  }
  private verifycontacts() {
    if (!this.isEmpty('contacts', '乙方联系人不能为空')) {
      return false;
    }
    return true;
  }
  private verifyphone()  {
    if (!this.isEmpty('phone', '乙方联系电话不能为空')) {
      return false;
    }
    if (!this.verifyIsTel('phone', '请输入正确的手机号')) {
      return false;
    }
    return true;
  }
  private verifycontractBtime() {
    if (!this.isEmpty('contractBtime', '开始时间不能为空')) {
      return false;
    }
    return true;
  }
  private verifycontractEtime() {
    if (!this.isEmpty('contractEtime', '结束时间不能为空')) {
      return false;
    }
    return true;
  }

  /*合同信息提交*/
  contractSubmit() {
    let SOFTWARES_URL;
    if(this.contractBool === false){
      SOFTWARES_URL = "/proxy/building/repair/updateRepairContract";
    }else{
      SOFTWARES_URL = "/proxy/building/repair/addRepairContract";
    }
    if (!this.verifyContractId() || !this.verifyCmccName() || !this.verifycontractcmccContacts() || !this.verifycontractcmccPhone() || !this.verifycontractname2() || !this.verifycontacts() || !this.verifyphone() || !this.verifycontractBtime() || !this.verifycontractEtime()) {
      return false;
    }
    if(this.contractName.contractBtime > this.contractName.contractEtime){
      confirmFunc.init({
        'title': '提示' ,
        'mes': '开始时间要小于结束时间',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }
    if(this.contractName.filePath.length<1){
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请补全合同信息',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }
//console.log(this.contractName);
    this.contractName.contractBtime = this.contractName.contractBtime.replace(/-/g, "/");
    this.contractName.contractEtime = this.contractName.contractEtime.replace(/-/g, "/");
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify
    this.http.post(SOFTWARES_URL, this.contractName, options)
      .map(res => res.json())
      .subscribe(data => {
        if (data['status'] === 0) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': this.contractBool === false?'更改成功':'新增成功',
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.searchContract = new SearchContract();
          this.getRecordSecond(this.searchContract, this.pageNo, this.pageSize);
          this.contractCancel();
        }else if (data['status'] === 1) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': data['msg'],
            'popType': 0 ,
            'imgType': 2 ,
          });
          this.contractName.contractBtime = this.contractName.contractBtime.replace(/\//g, "-");
          this.contractName.contractEtime = this.contractName.contractEtime.replace(/\//g, "-");
        }
      });
  }
  /*合同新增/编辑的取消按钮*/
  contractCancel(){
      this.contractName = new ContractName();
      $('.form-control').removeClass('form-error');
      $('.errorMessage').html('');
      this.contractName.fileName = [];
      this.contractName.filePath = [];
      $('.mask-contract').hide();
  }
  /*页码初始化*/
  initPage(total){
    this.pages = new Array(total);
    for(let i = 0;i< total ;i++){
      this.pages[i] = i+1;
    }
  }
  /*页面显示区间5页*/
  pageLimit(page:number){
    if(this.pages.length < 5){
      return false;
    }
    else if(this.pageNo < 5){
      return true;
    }
    else if(page<=5 && this.pageNo <= 3){
      return false;
    }
    else if(page>=this.pages.length -4 && this.pageNo>=this.pages.length-2){
      return false;
    }
    else if (page<=this.pageNo+2 && page>=this.pageNo-2){
      return false;
    }
    return true;
  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    if($('.repair-header a:last-child').hasClass('active')){
      this.getRecordSecond(this.searchRepair, this.pageNo, this.pageSize);
    }else{
      this.getRecord(this.searchRepair, this.pageNo, this.pageSize);
    }
  }
  /**非空校验*/
  private isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (data.toString().trim() === '')  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /**
   * 验证手机号码
   * @return
   */
  private verifyIsTel(id: string, error?: string): boolean {
    const data =  $('#' + id).val();/*/^1(3[4-9]|5[0-2]|8[0-3,78])\d{8}$/ 移动号段*/
    if (!String(data).match( /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/ ))  {
      this.addErrorClass(id, '请填写正确手机号');
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /**
   * 匹配数字
   * @param id
   * @param error
   * @returns {boolean}
   */
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
  /**
   * 校验是否包含中文英文数字
   * @param id
   * @param error
   * @returns {boolean}
   */
  private verifyIsBlend(id: string, error: string): boolean {
    const data =  $('#' + id).val();
    if (!String(data).match(/^[\u4E00-\u9FA5A-Za-z0-9]+$/))  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /**
   * 校验字符长度小于4
   * @param id
   * @param error
   * @returns {boolean}
   */
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
  }
}
export class RepairName {
  id: number; // 本条信息ID
  buildingId: string;
  buildingName: string;
  recordId: string; // 维修单编号
  repairType: string; // 维修类别
  cmccDepartment: string; // 需要维修部门
  cmccContacts: string; // 需要维修单位联系人
  cmccPhone: string; // 需要维修单位联系人电话
  repairCost: string; // 维修费用
  repairDepartment: string; // 维修商
  repairContacts: string; // 维修商联系人
  repairPhone: string; // 维修商联电话
  repairBtime: string; // 开始时间
  repairEtime: string; // 结束时间
  repairNote: string; // 详细内容
}
export class ContractName {
  id: number; // 本条信息ID
  buildingId: string;
  buildingName: string;
  contractId: string; //合同编号
  cmccName: string; // 甲方（各级移动公司）
  cmccContacts: string; // 甲方联系人
  cmccPhone: string; // 甲方联系人电话
  name: string; // 乙方（维修单位全称）
  contacts: string; // 乙方联系人
  phone: string; // 乙方联系电话
  contractType:string; // 种类
  contractStatus: string; // 合同状态
  contractBtime: string; // 合同开始时间
  contractEtime: string; // 合同结束时间
  filePath: string[]; //合同路径
  fileName: string[]; //合同名字
}
export class SearchRecord {
  buildingId: string; // 大楼编号
  buildingName: string;  // 大楼名称
  fitmentNum: string; // 装修单编号
  contractType: string; // 'decorate'
  decorateBtime: string; // 合同开始时间
  decorateEtime: string; // 合同结束时间
}
export class SearchContract {
  buildingId: string; // 大楼编号
  buildingName: string;  // 大楼名称
  contractType: string; // 'decorate'
  contractBtime: string; // 合同开始时间
  contractEtime: string; // 合同结束时间
}
