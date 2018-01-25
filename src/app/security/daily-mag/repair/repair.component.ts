import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {DomSanitizer} from '@angular/platform-browser';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import { sndCatalog} from "../../../mode/catalog/catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";

declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-repair',
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.css'],
  providers: [ErrorResponseService,UtilBuildingService,sndCatalog]
})
export class RepairComponent implements OnInit {
  public repairname: RepairName;
  public record: Array<RepairName>;
  public contractName: ContractName;
  public contract : Array<ContractName>;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public searchRepair : SearchRecord;
  public searchContract : SearchContract;
  private editBool = true;
  public beginTime :string;
  public buildings: any;
  public endTime :string;
  private contractBool = true;
  public rule : any;
  public jurisdiction:any;
  public repairDept:any;
  constructor(
    private http: Http,
    private errorVoid:ErrorResponseService,
    private utilBuildingService:UtilBuildingService,
    private globalCatalogService:GlobalCatalogService,
    private ipSetting  : IpSettingService
  ) {
    this.rule = this.globalCatalogService.getRole("security/daily");
    this.getQuan();
  }

  ngOnInit() {
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("security/daily");
        this.getQuan();
      }
    );
    this.repairname = new RepairName();
    this.contractName = new ContractName();
    this.searchRepair = new SearchRecord();
    this.searchContract = new SearchContract();
    this.beginTime = '';
    this.endTime = '';
    this.pages = [];
    this.contractName.contractType = 'repair';
    this.contractName.fileName = [];
    this.contractName.filePath = [];
    this.getBuildings();
    this.getRepairDept();
    if($('.repair-header a:last-child').hasClass('active')) {
      $('.repair-contract,.box2').fadeIn();
      this.getRecordSecond(this.searchContract, this.pageNo, this.pageSize);
    }else {
      $('.repair-record,.box1').fadeIn();
      this.getRecord(this.searchRepair, this.pageNo, this.pageSize);
    }
  }
  /*获取权限*/
  private getQuan(){
    if(this.rule!=null){
      let SOFTWARES_URL = "/portal/user/getCata/"+this.rule.ID+"/repair?url=";
      this.ipSetting.sendGet(SOFTWARES_URL).subscribe(data => {
          if(this.errorVoid.errorMsg(data)) {
            this.jurisdiction = data['data'][0];
          }
        });
    }
  }
  /*获取大楼列表*/
  private getBuildings() {
    this.utilBuildingService.getBuildingList('')
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.buildings = data['data'];
        }
      })
  }
  /*点击新增*/
  repairNew() {
    if($('.repair-header a:last-child').hasClass('active')) {
      this.contractBool = true;
      this.contractName = new ContractName();
      this.contractName.fileName = [];
      this.contractName.filePath = [];
      $('.mask-contract').fadeIn();
      $('.mask-contract .mask-head p').html('新增维修合同');
    }else {
      this.editBool = true;
      this.repairname = new RepairName();
      $('.mask-repair').fadeIn();
      $('.mask-repair .mask-head p').html('新增维修记录');
    }
  }
  /*获取/查询维修记录*/
  private getRecord(search, pageNo, pageSize) {
    let SOFTWARES_URL = "/building/repair/getRepairList/" + pageNo + "/" + pageSize;
    search.repairBtime = this.beginTime.replace(/-/g, "/");
    search.repairEtime = this.endTime.replace(/-/g, "/");
    this.ipSetting.sendPost(SOFTWARES_URL,search).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.record = data['data']['infos'];
          this.total=data.data.total;
        }
      });
  }
  /*点击查询*/
  repairSearch() {
    if(((this.endTime === '' && this.beginTime !== '') || (this.endTime !== '' && this.beginTime === '') || ((this.beginTime !==
      '' &&  this.endTime !== '') && this.beginTime <= this.endTime)) || (this.beginTime === '' && this.endTime === '')){
      if($('.repair-header a:last-child').hasClass('active')) {
        this.getRecordSecond(this.searchContract, this.pageNo, this.pageSize);
      }else {
        this.getRecord(this.searchRepair, this.pageNo, this.pageSize);
      }
    }else {
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
    this.repairname = JSON.parse(JSON.stringify(this.record[index]));
    this.repairname.repairBtime = this.repairname.repairBtime.replace(/\//g, "-");
    this.repairname.repairEtime = this.repairname.repairEtime.replace(/\//g, "-");
    $('.mask-repair').fadeIn();
    $('.mask-repair .mask-head p').html('编辑维修记录');
  }
  /*删除维修记录*/
  delRecord(index) {
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let SOFTWARES_URL = "/building/repair/deleteRepairRecord/" + index;
        this.ipSetting.sendGet(SOFTWARES_URL).subscribe(data => {
            if(this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示' ,
                'mes': data['msg'],
                'popType': 0 ,
                'imgType': 1 ,
              });
              this.pages =[];
              this.pageNo = 1;
              this.getRecord(this.searchRepair, this.pageNo, this.pageSize);
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
    $('.mask-repair').hide();
  }

  /*维修记录校验规则*/
  private verifyId() {
    if (!this.isEmpty('Id', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyRecordId() {
    if (!this.isEmpty('recordId', '不能为空')) {
      return false;
    }
    if (!this.verifyRecoad('recordId', '格式不对')) {
      return false;
    }
    return true;
  }
  private verifyRepairType() {
    if (!this.isEmpty('repairType', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyCmccDepartment() {
    if (!this.isEmpty('cmccDepartment', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyCmccContacts() {
    if (!this.isEmpty('cmccContacts', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyCmccPhone()  {
    if (!this.isEmpty('cmccPhone', '不能为空')) {
      return false;
    }
    if (!this.verifyIsTel('cmccPhone', '格式不正确')) {
      return false;
    }
    return true;
  }
  private verifyRepairDepartment() {
    if (!this.isEmpty('repairDepartment', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyRepairContacts() {
    if (!this.isEmpty('repairContacts', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyRepairPhone()  {
    if (!this.isEmpty('repairPhone', '不能为空')) {
      return false;
    }
    if (!this.verifyIsTel('repairPhone', '格式不正确')) {
      return false;
    }
    return true;
  }
  private verifyRepairBtime() {
    if (!this.isEmpty('repairBtime', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyRepairEtime() {
    if (!this.isEmpty('repairEtime', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyRepairCost() {
    if (!this.isEmpty('repairCost', '不能为空')) {
      return false;
    }
    if (!this.verifyIsNumber('repairCost', '费用为整数')) {
      return false;
    }
    return true;
  }
  private verifyRepairNote() {
    if (!this.isEmpty('repairNote', '不能为空')) {
      return false;
    }
    return true;
  }

  // 新增/编辑维修记录提交
  recordSubmit() {
    let SOFTWARES_URL;
    if(this.editBool === false) {
      this.pageNo = 1;
      SOFTWARES_URL = "/building/repair/updateRepairRecord";
    }else {
      SOFTWARES_URL = "/building/repair/addRepairRecord";
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
    this.repairname.repairBtime = this.repairname.repairBtime.replace(/-/g, "/");
    this.repairname.repairEtime = this.repairname.repairEtime.replace(/-/g, "/");
    this.ipSetting.sendPost(SOFTWARES_URL,this.repairname).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        confirmFunc.init({
          'title': '提示' ,
          'mes': this.editBool === false?'更改成功':'新增成功',
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.getRecord(this.searchRepair, this.pageNo, this.pageSize);
        this.recordCancel();
      }else {
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
    this.searchRepair = new SearchRecord();
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
    let SOFTWARES_URL = "/building/repair/getRepairContract/" + pageNo + "/" + pageSize;
    this.searchContract.contractBtime = this.beginTime.replace(/-/g, "/");
    this.searchContract.contractEtime = this.endTime.replace(/-/g, "/");
    this.ipSetting.sendPost(SOFTWARES_URL, search)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          this.contract = data['data']['infos'];
          this.total = data.data.total;
        }
      });
  }
  /* 编辑维修合同*/
  editContract(index) {
    this.contractBool = false;
    this.contractName = JSON.parse(JSON.stringify(this.contract[index]));
    this.contractName.contractBtime = this.contractName.contractBtime.replace(/\//g, "-");
    this.contractName.contractEtime = this.contractName.contractEtime.replace(/\//g, "-");
    $('.mask-contract').fadeIn();
    $('.mask-contract .mask-head p').html('编辑维修合同');
  }
  /* 删除维修合同*/
  delContract(index) {
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let SOFTWARES_URL = "/building/repair/deleteRepairContract/" + index;
        this.ipSetting.sendGet(SOFTWARES_URL)
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
              this.getRecordSecond(this.searchContract, this.pageNo, this.pageSize);
            }
          });
      }
    });
  }
  /*删除合同文件*/
  delFile(index) {
    this.contractName.filePath.splice(index,1);
    this.contractName.fileName.splice(index,1);
  }
  /*合同上传*/
  prese_upload(files) {
    var xhr = this.utilBuildingService.uploadFile(files[0],'repair',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)){
          this.contractName.fileName.push(files[0].name);
          this.contractName.filePath.push(data.msg);

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
  /*合同信息校验*/
  private verifyContractId() {
    if (!this.isEmpty('contractId', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifycontractNum() {
  if (!this.isEmpty('contractNum', '不能为空')) {
    return false;
  }
  return true;
}
  private verifyCmccName() {
    if (!this.isEmpty('cmccName', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifycontractcmccContacts() {
    if (!this.isEmpty('contractcmccContacts', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifycontractcmccPhone()  {
    if (!this.isEmpty('contractcmccPhone', '不能为空')) {
      return false;
    }
    if (!this.verifyIsTel('contractcmccPhone', '格式不对')) {
      return false;
    }
    return true;
  }
  private verifycontractname2() {
    if (!this.isEmpty('contractname2', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifycontacts() {
    if (!this.isEmpty('contacts', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyphone()  {
    if (!this.isEmpty('phone', '不能为空')) {
      return false;
    }
    if (!this.verifyIsTel('phone', '格式不对')) {
      return false;
    }
    return true;
  }
  private verifycontractBtime() {
    if (!this.isEmpty('contractBtime', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifycontractEtime() {
    if (!this.isEmpty('contractEtime', '不能为空')) {
      return false;
    }
    return true;
  }

  /*合同信息提交*/
  contractSubmit() {
    let SOFTWARES_URL;
    if(this.contractBool === false){
      SOFTWARES_URL = "/building/repair/updateRepairContract";
    }else{
      SOFTWARES_URL = "/building/repair/addRepairContract";
    }
    if (!this.verifyContractId() ||!this.verifycontractNum() || !this.verifyCmccName() || !this.verifycontractcmccContacts() ||
      !this.verifycontractcmccPhone() || !this.verifycontractname2() || !this.verifycontacts() || !this.verifyphone() ||
      !this.verifycontractBtime() || !this.verifycontractEtime()) {
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
    this.contractName.contractBtime = this.contractName.contractBtime.replace(/-/g, "/");
    this.contractName.contractEtime = this.contractName.contractEtime.replace(/-/g, "/");
    // JSON.stringify
    this.ipSetting.sendPost(SOFTWARES_URL, this.contractName).subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          confirmFunc.init({
            'title': '提示' ,
            'mes': this.contractBool === false?'更改成功':'新增成功',
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.getRecordSecond(this.searchContract, this.pageNo, this.pageSize);
          this.contractCancel();
        }else if (data['status'] === 1) {
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
  /*获取维修部门列表*/
  getRepairDept(){
    let url = '/building/repair/getRepairDept'
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.repairDept = data.data;
      }
    });
  };
  /*自动更改维修单号*/
  changeType(cont){
    if(this.repairname.recordId === undefined){
      this.repairname.recordId = cont.slice(0,1);
    }else if(this.repairname.recordId.length>1){
      this.repairname.recordId = cont.slice(0,1)+this.repairname.recordId.slice(1);
    }else{
      this.repairname.recordId = cont.slice(0,1);
    }

  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    if($('.repair-header a:last-child').hasClass('active')){
      this.getRecordSecond(this.searchContract, this.pageNo, this.pageSize);
    }else{
      this.getRecord(this.searchRepair, this.pageNo, this.pageSize);
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
  /**
   * 验证电话号码
   * @return
   */
  private verifyIsTel(id: string, error?: string): boolean {
    const data =  $('#' + id).val();/*/^1(3[4-9]|5[0-2]|8[0-3,78])\d{8}$/ 移动号段*/
    /*let isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
    let isMob=/^((\+?86)|(\+86))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;*/
    if (!String(data).match(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/)&&
      !String(data).match(/^400\-[\d|\-]{7}|[\d]{1}$/) && !String(data).match(/^([0-9]{3,4}-)?[0-9]{7,8}$/)) {
      this.addErrorClass(id, error);
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
 * 校验维修单号
 * @param id
 * @param error
 * @returns {boolean}
 */
private verifyRecoad(id: string, error: string): boolean {
  const data =  $('#' + id).val();
  if (!String(data).match(/^[A-Z]\d{4}$/))  {
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
    $('#' + id).parents('.form-inp').addClass('form-error');
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
    $('#' + id).parents('.form-inp').removeClass('form-error');
    $('#' + id).parents('.form-inp').children('.errorMessage').html('');
  }
}
export class RepairName {
  id: number; // 本条信息ID
  buildingId: string;
  buildingName: string;
  recordId: string; // 维修单编号
  repairType: string; // 维修类别
  cmccDepartment: String = ''; // 需要维修部门
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
  contractId: string; // 合同编号
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
  filePath: string[]; // 合同路径
  fileName: string[]; // 合同名字
}
export class SearchRecord {
  buildingId: string; // 大楼编号
  buildingName: String = '';  // 大楼名称
  fitmentNum: string; // 维修单编号
  contractType: string; // 'decorate'
  decorateBtime: string; // 合同开始时间
  decorateEtime: string; // 合同结束时间
}
export class SearchContract {
  buildingId: string; // 大楼编号
  buildingName:  String = '';  // 大楼名称
  contractType: string; // 'decorate'
  contractBtime: string; // 合同开始时间
  contractEtime: string; // 合同结束时间
}
