import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';

import * as $ from 'jquery';
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
  private pageSize = 10;
  private pageNo = 1;
  private searchRepair = '';
  private editBool = true;
  private contractBool = true;
  constructor(
    private http: Http,
    private errorVoid:ErrorResponseService,
    private utilBuildingService:UtilBuildingService,
  ) { }

  ngOnInit() {
    this.repairname = new RepairName();
    this.contractName = new ContractName();
    this.repairname.repairType = '';
    this.contractName.contractType = 'repair';
    this.contractName.contractStatus = '已完成';

    if($('.repair-header a:last-child').hasClass('active')){
      $('.repair-contract').fadeIn();
      this.getRecordSecond(this.searchRepair, this.pageNo, this.pageSize);
    }else{
      $('.repair-record').fadeIn();
      this.getRecord(this.searchRepair, this.pageNo, this.pageSize);
    }
  }
  /*private initDatePicker () {
    $('#repairBtime').pickadate({
      monthsFull: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      weekdaysShort: ['日', '一', '二', '三', '四', '五', '六'],
      today: '今天',
      clear: '清空',
      close: '关闭',
      firstDay: 1,
      format: 'yyyy-mm-dd',
      formatSubmit: 'yyyy-mm-dd',
      max: true,
      onSet:  ( context => {
        this.beginTime = $('#repairBtime').val();
        this.repairname.repairBtime = this.beginTime;
      }),
    });
  }*/
  private getBeginTime() {
    // this.initDatePicker();
  }
  private getEndTime() {}
  // 点击新增
  repairNew() {
    if($('.repair-header a:last-child').hasClass('active')){
      $('.mask-contract').fadeIn();
    }else{
      $('.mask-repair').fadeIn();
    }

  }

  // 获取/查询维修记录 POST /building/repair/getRepairList/{pageNo}/{pageSize}
  private getRecord(search, pageNo, pageSize) {
    const SOFTWARES_URL = "/proxy/building/repair/getRepairList/" + pageNo + "/" + pageSize + '?search=' + search;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify
    const dataPost = {
      'decorateRepair': search,
      'pageNo': pageNo,
      'pageSize': pageSize
    };
    this.http.post(SOFTWARES_URL, dataPost, options)
      .map(res => res.json())
      .subscribe(data => {
        if (data['status'] === 0) {
          this.record = data['data']['infos'];
        }
      });
  }
  // 查询
  repairSearch() {
    if($('.repair-header a:last-child').hasClass('active')){
      console.log('执行合同');
      this.getRecordSecond(this.searchRepair, this.pageNo, this.pageSize);
    }else{
      console.log('执行记录');
      this.getRecord(this.searchRepair, this.pageNo, this.pageSize);
    }
  }
  // 编辑装修记录  Method:POST /building/repair/updateRepairRecord
  editRecord(index) {
    this.editBool = false;
    this.repairname = this.record[index];
    $('.mask-repair').fadeIn();
  }
  delRecord(index) {
    $('.confirm').fadeIn();
    this.repairname = this.record[index];
  }
  // 取消按钮
  recordCancel() {
    this.repairname = new RepairName();
    $('.form-control').removeClass('form-error');
    $('.errorMessage').html('');
    this.repairname.repairType = '';
    $('.mask-repair').hide();
    /*let url = '/knowledge/list/' + '';
     this.router.navigate([url]);*/
  }
  /*删除*/
  okFunc(){
    $('.confirm').hide();
    const SOFTWARES_URL = "/proxy/building/repair/deleteRepairRecord/" +this.repairname.id;
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
          this.searchRepair = '';
          this.getRecord(this.searchRepair, this.pageNo, this.pageSize);
        }
      });
  }
  noFunc(){
    $('.confirm').hide();
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
  private verifyName() {
    if (!this.isEmpty('name', '大楼名称不能为空')) {
      return false;
    }
    return true;
  }
  private verifyRecordId() {
    if (!this.isEmpty('recordId', '维修单编号不能为空')) {
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
    if (!this.isEmpty('cmccDepartment', '维修部门不能为空')) {
      return false;
    }
    return true;
  }
  private verifyCmccContacts() {
    if (!this.isEmpty('cmccContacts', '维修部门联系人不能为空')) {
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
    if (!this.isEmpty('repairContacts', '维修商不能为空')) {
      return false;
    }
    return true;
  }
  private verifyRepairPhone()  {
    if (!this.isEmpty('repairPhone', '维修商电话不能为空')) {
      return false;
    }
    if (!this.verifyIsTel('repairPhone', '请输入正确的手机号')) {
      return false;
    }
    return true;
  }
  private verifyRepairBtime() {
    if (!this.isEmpty('repairBtime', '维修开始时间不能为空')) {
      return false;
    }
    return true;
  }
  private verifyRepairEtime() {
    if (!this.isEmpty('repairEtime', '维修结束时间不能为空')) {
      return false;
    }
    return true;
  }
  private verifyRepairCost() {
    if (!this.isEmpty('repairCost', '维修费用不能为空')) {
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
    if(this.editBool === false){
      var SOFTWARES_URL = "/proxy/building/repair/updateRepairRecord";
    }else{
      var SOFTWARES_URL = "/proxy/building/repair/addRepairRecord";
    }
    if (!this.verifyId() || !this.verifyName() || !this.verifyRecordId() || !this.verifyRepairType() || !this.verifyCmccDepartment() || !this.verifyCmccContacts() || !this.verifyCmccPhone() || !this.verifyRepairDepartment() || !this.verifyRepairContacts() || !this.verifyRepairPhone() || !this.verifyRepairBtime() || !this.verifyRepairEtime() || !this.verifyRepairCost() || !this.verifyRepairNote()) {
      return false;
    }
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify
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
          this.searchRepair = '';
          this.getRecord(this.searchRepair, this.pageNo, this.pageSize);
          this.recordCancel();
        }
      });
  }
  /*点击大楼维修记录*/
  recordFade(event) {
    $(event.target).addClass('active');
    $(event.target).siblings('a').removeClass('active');
    this.repairSearch();
    $('.repair-record').fadeIn();
    $('.repair-contract').hide();
  }
  /*点击大楼维修合同*/
  contractFade(event) {
    $(event.target).addClass('active');
    $(event.target).siblings('a').removeClass('active');
    this.repairSearch();
    $('.repair-contract').fadeIn();
    $('.repair-record').hide();
  }
// 获取/查询维修合同 POST /building/repair/getRepairContract/{pageNo}/{pageSize}
  private getRecordSecond(search, pageNo, pageSize) {
    const SOFTWARES_URL = "/proxy/building/repair/getRepairContract/" + pageNo + "/" + pageSize + '?search=' + search;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify
    const dataPost2 = {
      'decorateRepair': search,
      'contractType': 'repair',
      'pageNo': pageNo,
      'pageSize': pageSize
    };
    this.http.post(SOFTWARES_URL, dataPost2, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if (data['status'] === 0) {
          this.contract = data['data']['infos'];
        }
      });
  }
  //新增记录或者合同
  recordNew(){
    if($('.repair-header a:last-child').hasClass('active')){
      $('.mask-contract').fadeIn();
    }else{
      $('.mask-repair').fadeIn();
    }
  }
  /* 编辑维修合同*/
  editContract(){

  }
  /* 删除维修合同*/
  delContract(){

  }
  /*合同上传*/
  prese_upload(files,index){
    var xhr = this.utilBuildingService.uploadImg(files[0],'contract',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data.status)){
          // this.newBuilding.imgPath = data.msg;
          console.log(data);
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
  private verifyContractName() {
    if (!this.isEmpty('contractName', '大楼名称不能为空')) {
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
    if (!this.isEmpty('contractBtime', '合同开始时间不能为空')) {
      return false;
    }
    return true;
  }
  private verifycontractEtime() {
    if (!this.isEmpty('contractEtime', '合同结束时间不能为空')) {
      return false;
    }
    return true;
  }

  // 新增/编辑合同信息提交
  contractSubmit() {
    if(this.contractBool === false){
      var SOFTWARES_URL = "/proxy/building/repair/updateRepairContract";
      alert(1);
    }else{
      console.log(this.contractName);
      var SOFTWARES_URL = "/proxy/building/repair/addRepairContract";
    }
    if (!this.verifyContractId() || !this.verifyContractName() || !this.verifyCmccName() || !this.verifycontractcmccContacts() || !this.verifycontractcmccPhone() || !this.verifycontractname2() || !this.verifycontacts() || !this.verifyphone() || !this.verifycontractBtime() || !this.verifycontractEtime()) {
      return false;
    }
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
          this.searchRepair = '';
          this.getRecordSecond(this.searchRepair, this.pageNo, this.pageSize);
          this.contractCancel();
        }
      });
  }
  contractCancel(){
      this.contractName = new ContractName();
      $('.form-control').removeClass('form-error');
      $('.errorMessage').html('');
      this.contractName.contractStatus = '';
    $('.mask-contract').hide();
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
    const data =  $('#' + id).val();
    if (!String(data).match(/^1(3[4-9]|5[0-2]|8[0-3,78])\d{8}$/))  {
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
}
