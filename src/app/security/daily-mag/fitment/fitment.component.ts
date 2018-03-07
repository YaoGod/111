import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {InfoBuildingService} from "../../../service/info-building/info-building.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {Building} from "../../../mode/building/building.service";
import {Floor} from "../../../mode/floor/floor.service";


declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-fitment',
  templateUrl: './fitment.component.html',
  styleUrls: ['./fitment.component.css'],
  providers: [InfoBuildingService,ErrorResponseService,UtilBuildingService,Building,Floor]
})
export class FitmentComponent implements OnInit {
  public jurisdiction: any;
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
  public beginTime :string;
  public endTime :string;
  public buildings: any;
  public editBool = true;
  private contractBool = true;
  public URL = this.ipSetting.ip + "/common/file/downLoadFile?path=";
  public floorNames   : Array<any>;  /*大楼楼层名称列表*/
  public rule: any;
  constructor(private http: Http,
              private errorVoid:ErrorResponseService,
              private utilBuildingService:UtilBuildingService,
              private infoBuildingService:InfoBuildingService,
              private globalCatalogService:GlobalCatalogService,
              private ipSetting  : IpSettingService
  ) {
    this.rule = this.globalCatalogService.getRole("security/daily");
  }

  ngOnInit() {
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("security/daily");
        this.getQuan();
      }
    );
    this.getQuan();
    this.searchRepair = new SearchRecord();
    this.searchContract = new SearchContract();
    this.repairname = new RepairName();
    this.contractName = new ContractName();
    this.beginTime = '';
    this.endTime = '';
    this.pages = [];
    this.contractName.fileName = [];
    this.contractName.filePath = [];

    this.getBuildings();
    if($('.repair-header a:last-child').hasClass('active')){
      $('.repair-contract,.box2').fadeIn();
      this.getRecordSecond(this.searchContract, this.pageNo, this.pageSize);
    }else{
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
            for(let i = 0;i<data.data.length;i++){
              if(data.data[i].routeUrl === "fitment"){
                this.jurisdiction = data.data[i];
              }
            }
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
  /*获取楼层名称*/
  getFloorNameListInfo(id:string) {
    this.infoBuildingService.getFloorNameListMsg(Number(id))
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.floorNames = data.data;
        }
      });
  }
  /*点击新增*/
  repairNew() {
    if($('.repair-header a:last-child').hasClass('active')) {
      this.contractBool = true;
      this.contractName = new ContractName();
      this.contractName.fileName = [];
      this.contractName.filePath = [];
      $('.mask-contract').fadeIn();
      $('.mask-contract .mask-head p').html('新增装修合同');
    }else {
      this.editBool = true;
      this.repairname = new RepairName();
      $('.mask-repair').fadeIn();
      $('.mask-repair .mask-head p').html('新增装修记录');
    }
  }
  /*获取/查询装修记录*/
  private getRecord(search, pageNo, pageSize) {
    const SOFTWARES_URL = "/building/decorate/getDecorateList/" + pageNo + "/" + pageSize;
    search.decorateBtime = this.beginTime.replace(/-/g, "/");
    search.decorateEtime = this.endTime.replace(/-/g, "/");
    this.ipSetting.sendPost(SOFTWARES_URL,this.searchRepair).subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          this.record = data['data']['infos'];
          this.total = data.data.total;
        }
      });
  }
  /*获取/查询装修合同 */
  private getRecordSecond(search, pageNo, pageSize) {
    let SOFTWARES_URL = "/building/decorate/getDecorateContract/" + pageNo + "/" + pageSize;
    this.searchContract.contractType = 'decorate';
    this.searchContract.contractBtime = this.beginTime.replace(/-/g, "/");
    this.searchContract.contractEtime = this.endTime.replace(/-/g, "/");
    this.ipSetting.sendPost(SOFTWARES_URL,search).subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          this.contract = data['data']['infos'];
          this.total = data.data.total;
        }
      });
  }
  /*装修记录的新增、编辑取消按钮*/
  recordCancel() {
    this.repairname = new RepairName();
    $('.form-control').removeClass('form-error');
    $('.errorMessage').html('');
    $('.mask-repair').hide();
  }
  /*点击查询*/
  repairSearch(num) {
    this.pageNo = num;
    /*if(((this.endTime === '' && this.beginTime !== '') || (this.endTime !== '' && this.beginTime === '') || ((this.beginTime !==
      '' &&  this.endTime !== '') && this.beginTime <= this.endTime)) || (this.beginTime === '' && this.endTime === '')) {*/
      if ($('.repair-header a:last-child').hasClass('active')) {
        this.getRecordSecond(this.searchContract, this.pageNo, this.pageSize);
      } else {
        this.getRecord(this.searchRepair, this.pageNo, this.pageSize);
      }
    /*}else{
      confirmFunc.init({
        'title': '提示' ,
        'mes': '开始时间要大于结束时间',
        'popType': 0 ,
        'imgType': 2 ,
      });
    }*/
  }
  /*点击大楼维修记录*/
  recordFade(event) {
    this.beginTime = '';
    this.endTime = '';
    this.searchRepair = new SearchRecord();
    $(event.target).addClass('active');
    $(event.target).siblings('a').removeClass('active');
    this.repairSearch(1);
    $('.box1').show();
    $('.box2').hide();
    $('.repair-record').fadeIn();
    $('.repair-contract').hide();
  }
  /*点击大楼维修合同*/
  contractFade(event) {
    this.beginTime = '';
    this.endTime = '';
    this.searchContract = new SearchContract();
    $(event.target).addClass('active');
    $(event.target).siblings('a').removeClass('active');
    this.repairSearch(1);
    $('.box1').hide();
    $('.box2').show();
    $('.repair-contract').fadeIn();
    $('.repair-record').hide();
  }
  /*编辑装修记录*/
  editRecord(index) {
    this.editBool = false;
    this.repairname = JSON.parse(JSON.stringify(this.record[index]));
    this.getFloorNameListInfo(this.repairname.buildingId);
    this.repairname.decorateBtime = this.repairname.decorateBtime.replace(/\//g, "-");
    this.repairname.decorateEtime = this.repairname.decorateEtime.replace(/\//g, "-");
    $('.mask-repair').fadeIn();
    $('.mask-repair .mask-head p').html('编辑装修记录');
  }
  /*删除装修记录*/
  delRecord(index) {
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let SOFTWARES_URL = "/building/decorate/deleteDecorateRecord/" + index;
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
  /* 编辑装修合同*/
  editContract(index){
    this.contractBool = false;
    this.contractName = JSON.parse(JSON.stringify(this.contract[index]));
    this.contractName.contractBtime = this.contractName.contractBtime.replace(/\//g, "-");
    this.contractName.contractEtime = this.contractName.contractEtime.replace(/\//g, "-");
    $('.mask-contract').fadeIn();
    $('.mask-contract .mask-head p').html('编辑维修合同');
  }
  /* 删除装修合同*/
  delContract(index) {
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let SOFTWARES_URL = "/building/decorate/deleteDecorateContract/" + index;
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
              this.getRecordSecond(this.searchContract, this.pageNo, this.pageSize);
            }
          });
      }
    });
  }
  /*装修记录校验规则*/
  public verifyId() {
    if (!this.isEmpty('Id', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyRecordId() {
    if (!this.isEmpty('recordId', '不能为空')) {
      return false;
    }
    if (!this.verifyRecoad('recordId', '格式不对')) {
      return false;
    }
    return true;
  }
  public verifydecorateFloor() {
    if (!this.isEmpty('decorateFloor', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyCmccDepartment() {
    if (!this.isEmpty('cmccDepartment', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyCmccContacts() {
    if (!this.isEmpty('cmccContacts', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyCmccPhone()  {
    if (!this.isEmpty('cmccPhone', '不能为空')) {
      return false;
    }
    if (!this.verifyIsTel('cmccPhone', '格式不对')) {
      return false;
    }
    return true;
  }
  public verifydecorateDepartment() {
    if (!this.isEmpty('decorateDepartment', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifydecorateContacts() {
    if (!this.isEmpty('decorateContacts', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifydecoratePhone()  {
    if (!this.isEmpty('decoratePhone', '不能为空')) {
      return false;
    }
    if (!this.verifyIsTel('decoratePhone', '格式不对')) {
      return false;
    }
    return true;
  }
  public verifydecorateBtime() {
    if (!this.isEmpty('decorateBtime', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifydecorateEtime() {
    if (!this.isEmpty('decorateEtime', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifydecorateCost() {
    if (!this.isEmpty('decorateCost', '不能为空')) {
      return false;
    }
    if (!this.verifyIsNumber('decorateCost', '请输入整数')) {
      return false;
    }
    return true;
  }
  public verifydecorateNote() {
    if (!this.isEmpty('repairNote', '不能为空')) {
      return false;
    }
    return true;
  }

  /*新增/编辑装修记录提交*/
  recordSubmit() {
    let SOFTWARES_URL;
    if(this.editBool === false){
      SOFTWARES_URL = "/building/decorate/updateDecorateRecord";
    }else{
      SOFTWARES_URL = "/building/decorate/addDecorateRecord";
    }
    if (!this.verifyId() || !this.verifyRecordId() || !this.verifydecorateFloor() || !this.verifyCmccDepartment() ||
      !this.verifyCmccContacts() || !this.verifyCmccPhone() || !this.verifydecorateDepartment()
      || !this.verifydecorateContacts() || !this.verifydecoratePhone() || !this.verifydecorateBtime() ||
      !this.verifydecorateEtime() || !this.verifydecorateCost() || !this.verifydecorateNote()) {
      return false;
    }
    /*if(this.repairname.decorateBtime > this.repairname.decorateEtime){
      confirmFunc.init({
        'title': '提示' ,
        'mes': '开始时间要小于结束时间',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }*/
    this.repairname.decorateBtime = this.repairname.decorateBtime.replace(/-/g, "/");
    this.repairname.decorateEtime = this.repairname.decorateEtime.replace(/-/g, "/");
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
          this.repairname.decorateBtime = this.repairname.decorateBtime.replace(/\//g, "-");
          this.repairname.decorateEtime = this.repairname.decorateEtime.replace(/\//g, "-");
        }
      });
  }
  /*合同信息校验*/
  public verifyContractId() {
    if (!this.isEmpty('contractId', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifycontractNum() {
    if (!this.isEmpty('contractNum', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyCmccName() {
    if (!this.isEmpty('cmccName', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifycontractcmccContacts() {
    if (!this.isEmpty('contractcmccContacts', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifycontractcmccPhone()  {
    if (!this.isEmpty('contractcmccPhone', '不能为空')) {
      return false;
    }
    if (!this.verifyIsTel('contractcmccPhone', '格式不对')) {
      return false;
    }
    return true;
  }
  public verifycontractname2() {
    if (!this.isEmpty('contractname2', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifycontacts() {
    if (!this.isEmpty('contacts', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyphone()  {
    if (!this.isEmpty('phone', '不能为空')) {
      return false;
    }
    if (!this.verifyIsTel('phone', '格式不对')) {
      return false;
    }
    return true;
  }
  public verifycontractBtime() {
    if (!this.isEmpty('contractBtime', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifycontractEtime() {
    if (!this.isEmpty('contractEtime', '不能为空')) {
      return false;
    }
    return true;
  }
  /*合同上传*/
  prese_upload(files){
    let xhr = this.utilBuildingService.uploadFile(files[0],'decorate',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
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
      }else if(xhr.readyState === 4 && xhr.status === 413){
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
  delFile(index){
    this.contractName.filePath.splice(index,1);
    this.contractName.fileName.splice(index,1);
  }
  /*新增/编辑合同信息提交*/
  contractSubmit() {
    let SOFTWARES_URL;
    if(this.contractBool === false){
      SOFTWARES_URL = "/building/decorate/updateDecorateContract";
    }else{
      SOFTWARES_URL = "/building/decorate/addDecorateContract";
    }
    if (!this.verifyContractId() || !this.verifycontractNum() || !this.verifyCmccName() || !this.verifycontractcmccContacts() ||
      !this.verifycontractcmccPhone() || !this.verifycontractname2() || !this.verifycontacts() || !this.verifyphone() ||
      !this.verifycontractBtime() || !this.verifycontractEtime() ) {
      return false;
    }

    if( this.contractName.filePath.length<1 ) {
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请上传文件信息',
        'popType': 0 ,
        'imgType': 2 ,
      });
      return false;
    }
    this.contractName.contractBtime = this.contractName.contractBtime.replace(/-/g, "/");
    this.contractName.contractEtime = this.contractName.contractEtime.replace(/-/g, "/");
    this.ipSetting.sendPost(SOFTWARES_URL,this.contractName).subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          confirmFunc.init({
            'title': '提示' ,
            'mes': this.contractBool === false?'更改成功':'新增成功',
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.getRecordSecond(this.searchContract, this.pageNo, this.pageSize);
          this.contractCancel();
        }else{
          this.contractName.contractBtime = this.contractName.contractBtime.replace(/\//g, "-");
          this.contractName.contractEtime = this.contractName.contractEtime.replace(/\//g, "-");
        }
      });
  }
  contractCancel(){
    this.contractName = new ContractName();
    $('.form-control').removeClass('form-error');
    $('.errorMessage').html('');
    this.contractName.fileName = [];
    this.contractName.filePath = [];
    $('.mask-contract').hide();
  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    if($('.fitment-header a:last-child').hasClass('active')){
      this.getRecordSecond(this.searchRepair, this.pageNo, this.pageSize);
    }else{
      this.getRecord(this.searchRepair, this.pageNo, this.pageSize);
    }
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
  /**验证手机号*/
  public verifyIsTel(id: string, error?: string): boolean {
    const data =  $('#' + id).val();
    if (!String(data).match(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/)&&
      !String(data).match(/^400\-[\d|\-]{7}[\d]{1}$/) )  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /**匹配数字 */
  public verifyIsNumber(id: string, error: string): boolean  {
    const data =  $('#' + id).val();// /^[0-9]*$/
    if (!String(data).match(/^[0-9]*$/))  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /**校验是否包含中文英文数字   */
  public verifyIsBlend(id: string, error: string): boolean {
    const data =  $('#' + id).val();
    if (!String(data).match(/^[\u4E00-\u9FA5A-Za-z0-9]+$/))  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /**校验字符长度小于4*/
  public verifyLength(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (data.length < 4)  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /**校验装修单*/
  public verifyRecoad(id: string, error: string): boolean {
    const data =  $('#' + id).val();
    if (!String(data).match(/^Z\d{4}$/))  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /** * 添加错误信息class   */
  public  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /**去除错误信息class */
  public  removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').removeClass('form-error');
    $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
  }
}
export class RepairName {
  id: number; // 本条信息ID
  buildingId: string;
  buildingNum: string;
  buildingName: string;
  recordId: string; // 装修单编号
  decorateFloor = ''; // 装修楼层
  cmccDepartment: string; // 需要装修部门
  cmccContacts: string; // 需要装修单位联系人
  cmccPhone: string; // 需要装修单位联系人电话
  decorateCost: string; // 装修费用
  decorateDepartment: string; // 装修公司
  decorateContacts: string; // 装修公司联系人
  decoratePhone: string; // 装修公司联系电话
  decorateBtime: string; // 开始时间
  decorateEtime: string; // 结束时间
  decorateNote: string; // 详细内容
}
export class ContractName {
  id: number; // 本条信息ID
  buildingId: string;
  buildingNum: string;
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
  fitmentNum: string; // 装修单编号
  contractType: string; // 'decorate'
  decorateBtime: string; // 开始时间
  decorateEtime: string; // 结束时间
}
export class SearchContract {
  buildingId: string; // 大楼编号
  buildingName: String = '';  // 大楼名称
  contractType: string; // 'decorate'
  contractBtime: string; // 合同开始时间
  contractEtime: string; // 合同结束时间
}

