import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {InfoBuildingService} from "../../../service/info-building/info-building.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {isUndefined} from "util";


declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css'],
  providers: [InfoBuildingService,ErrorResponseService,UtilBuildingService]
})
export class DeviceComponent implements OnInit {
  public searchCompany: Company;
  public searchArch : Arch;
  public record: Array<GuardName>;
  public contract : Array<ArchName>;
  public pages: Array<number>;
  public repairname: GuardName;
  public contractName: ArchName;
  public buildings:any;
  public rule : any;
  public jurisdiction:any;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  private editBool = true;
  private contractBool = true;
  public leading:any;
  public deviceList:any;
  public zong :any;
  public modelList:any;
  public maintenList:any;
  public URL = this.ipSetting.ip + "/common/file/downLoadFile?path=";
  constructor(
    private http: Http,
    private errorVoid:ErrorResponseService,
    private utilBuildingService:UtilBuildingService,
    private globalCatalogService:GlobalCatalogService,
    public ipSetting  : IpSettingService
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
    this.repairname = new GuardName();
    this.contractName = new ArchName();
    this.searchCompany =  new Company();
    this.searchArch = new Arch();
    this.pages = [];
    this.deviceList = [];
    this.modelList = [];
    this.maintenList = [];
    if($('.device-header a:last-child').hasClass('active')) {
      $('.guard-arch,.box2').fadeIn();
      // this.getRecordSecond(this.searchArch, this.pageNo, this.pageSize);
    }else {
      $('.guard-company,.box1').fadeIn();
      this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
    }
    this.getBuildings();
    this.getDeviceList('','');
    this.getPeople();
    this.repairSearch(1);
    $('.box1').hide();
    $('.box2').show();
    $('.device-arch').fadeIn();
    $('.guard-company').hide();
  }
  /**获取权限*/
  private getQuan(){
    if(this.rule!=null){
      let url = "/portal/user/getCata/"+this.rule.ID+"/repair?url=";
      this.ipSetting.sendGet(url).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.jurisdiction = data['data'][0];
          for(let i = 0;i<data.data.length;i++){
            if(data.data[i].routeUrl === "device"){
              this.jurisdiction = data.data[i];
            }
          }
        }
      });
    }
  }
  /**获取大楼列表*/
  private getBuildings() {
    this.utilBuildingService.getBuildingList('')
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.buildings = data['data'];
        }
      })
  }
  /** 获取维保责任人 **/
  private getPeople(){
    let url = "/building/equipment/getLiablePerson?name=";
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.leading = data['data'];
      }
    });
  }
  /**获取/查询设备信息*/
  private getRecord(search, pageNo, pageSize) {
    let url = "/building/equipment/getEquipmentList/" + pageNo + "/" + pageSize;
    this.ipSetting.sendPost(url,search).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.record = data['data']['infos'];
          this.total = data.data.total;
        }
      });
  }
  /**获取大型设备信息*/
  public getDeviceList(id,name) {
    let url = "/building/equipment/getEquipmentSelect";
    let inner = {
      buildingId: id
    };
    this.ipSetting.sendPost(url,inner).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        let result1 = [];
        for(let i=0;i<data['data'].length;i++){
          result1.push(data['data'][i].name);
          if(data['data'][i].name===name){
            this.contractName.maintenance = data['data'][i].maintenance;
            this.contractName.equipModel = data['data'][i].model;
          }
        }
        this.deviceList = result1;
      }
    });
  }
  /**获取工单*/
  private getRecordSecond(search, pageNo, pageSize) {
    let url = "/building/equipment/getEquipmentWO/" + pageNo + "/" + pageSize;
    this.ipSetting.sendPost(url,search)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.contract = data['data']['infos'];
          this.total = data.data.total;
        }
      });
  }
  /*点击查询*/
  repairSearch(num) {
    this.pageNo = num;
    if($('.device-header a:last-child').hasClass('active')) {
      this.pageNo = 1;
      this.getRecordSecond(this.searchArch, this.pageNo, this.pageSize);
    }else {
      this.pageNo = 1;
      this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
    }
  }
  /*点击新增*/
  addCompany() {
    this.getDeviceList('','');
    if($('.device-header a:last-child').hasClass('active')) {
      this.contractBool = true;
      this.contractName = new ArchName();
      $('.mask-contract').fadeIn();
      $('.mask-contract .mask-head p').html('新增工单');
    }else {
      this.editBool = true;
      this.repairname = new GuardName();
      $('.mask-repair').fadeIn();
      $('.mask-repair .mask-head p').html('新增大型设备信息');
      this.repairname.fileName = [];
      this.repairname.filePath = [];
    }
  }
  /*点击设备基础信息*/
  deviceFade(event) {
    this.pages = [];
    this.searchCompany = new Company();
    $(event.target).addClass('active');
    $(event.target).siblings('a').removeClass('active');
    this.repairSearch(1);
    $('.box1').show();
    $('.box2').hide();
    $('.guard-company').fadeIn();
    $('.device-arch').hide();
  }
  /*点击工单*/
  mainFade(event) {
    this.pages = [];
    this.searchArch = new Arch();
    $(event.target).addClass('active');
    $(event.target).siblings('a').removeClass('active');
    this.repairSearch(1);
    $('.box1').hide();
    $('.box2').show();
    $('.device-arch').fadeIn();
    $('.guard-company').hide();
  }

  /*记录新增和编辑界面的取消按钮*/
  recordCancel() {
    this.repairname = new GuardName();
    this.repairname.fileName = [];
    this.repairname.filePath = [];
    $('#prese').val('');
    $('.errorMessage').html('');
    $('.mask-repair').hide();
  }
  /*新增工单的取消按钮*/
  contractCancel() {
    this.contractName = new ArchName();
    $('.form-control').removeClass('form-error');
    $('.errorMessage').html('');
    $('.mask-contract').hide();
    this.getDeviceList('','');
  }
  /*删除合同文件*/
  delFile(index) {
    this.repairname.filePath.splice(index,1);
    this.repairname.fileName.splice(index,1);
  }
  /*图片上传*/
  prese_upload(files) {
    var xhr = this.utilBuildingService.uploadFile(files[0],'equipment',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)) {
          this.repairname.fileName.push(files[0].name);
          this.repairname.filePath.push(data.msg);
          confirmFunc.init({
            'title': '提示' ,
            'mes': '上传成功',
            'popType': 0 ,
            'imgType': 1,
          });
        }else{
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
  /*校验设备信息*/
  public verifybuildingId() {
    if (!this.isEmpty('buildingId', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyname() {
    if (!this.isEmpty('name', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifymodel() {
    if (!this.isEmpty('model', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifybuyDate() {
    if (!this.isEmpty('buyDate', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifysupplier() {
    if (!this.isEmpty('supplier', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyfactoryContacts() {
    if (!this.isEmpty('factoryContacts', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyfactoryPhone() {
    if (!this.isEmpty('factoryPhone', '不能为空')) {
      return false;
    }
    if (!this.verifyIsTel('factoryPhone', '格式不正确')) {
      return false;
    }
    return true;
  }
  public verifymaintenance() {
    if (!this.isEmpty('maintenance', '不能为空')) {
      return false;
    }
    return true;
  }
  /*public verifymLastDate() {
    if (!this.isEmpty('mLastDate', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifymNextDate() {
    if (!this.isEmpty('mNextDate', '不能为空')) {
      return false;
    }
    return true;
  }*/
  public verifyliablePerson() {
    if (!this.isEmpty('liablePerson', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifylDeptId(){
    if (!this.isEmpty('deptId', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifylMail()  {
    if (!this.isEmpty('lMail', '不能为空')) {
      return false;
    }
    if (!this.verifyIsEmail('lMail', '格式不正确')) {
      return false;
    }
    return true;
  }
  /*新增/编辑设备信息提交*/
  recordSubmit() {
    var SOFTWARES_URL;
    if(this.editBool === false) {
      this.pageNo = 1;
      SOFTWARES_URL = "/building/equipment/updateEquipment";
    }else {
      SOFTWARES_URL = "/building/equipment/addEquipment";
    }
    if (!this.verifybuildingId() || !this.verifyname() || !this.verifymodel() || !this.verifybuyDate() || !this.verifysupplier()
      || !this.verifymaintenance() || !this.verifyliablePerson() || !this.verifylMail()) {
      return false;
    }
    const postdata = JSON.parse(JSON.stringify(this.repairname));

    postdata.buyDate = postdata.buyDate.replace(/-/g, "/");
    /*postdata.mLastDate = postdata.mLastDate.replace(/-/g, "/");
    postdata.mNextDate = postdata.mNextDate.replace(/-/g, "/");*/
    this.ipSetting.sendPost(SOFTWARES_URL,postdata).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          $('#prese').val('');
          confirmFunc.init({
            'title': '提示' ,
            'mes': this.editBool === false?'更新成功':'新增成功',
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
          this.getDeviceList('','');
          this.recordCancel();
        }else{
          this.repairname.buyDate = this.repairname.buyDate.replace(/\//g, "-");
          /*this.repairname.mLastDate = this.repairname.mLastDate.replace(/\//g, "-");
          this.repairname.mNextDate = this.repairname.mNextDate.replace(/\//g, "-");*/
        }
      });
  }
  /*编辑设备信息*/
  editRecord(index) {
    this.editBool = false;
    this.repairname = JSON.parse(JSON.stringify(this.record[index]));
    for(let i=0;i<this.leading.length;i++){
      if(this.repairname.liablePerson === this.leading[i].username){
        this.repairname.liablePerson = this.leading[i].userid;
        this.repairname.deptId = this.leading[i].deptId;
      }
    }
    this.repairname.buyDate = this.repairname.buyDate.replace(/\//g, "-");
    /*this.repairname.mLastDate = this.repairname.mLastDate.replace(/\//g, "-");
    this.repairname.mNextDate = this.repairname.mNextDate.replace(/\//g, "-");*/
    $('.mask-repair').fadeIn();
    $('.mask-repair .mask-head p').html('编辑大型设备信息');
  }
  /*删除设备信息*/
  delRecord(index) {
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let url = "/building/equipment/deleteEquipment/" + index;
        this.ipSetting.sendGet(url).subscribe(data => {
            if(this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示' ,
                'mes': data['msg'],
                'popType': 0 ,
                'imgType': 1 ,
              });
              this.pages =[];
              this.pageNo = 1;
              this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
            }
          });
      }
    });
  }
  /*删除工单*/
  delOrder(index){
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let SOFTWARES_URL = "/building/equipment/deleteEquipmentWO/" + index;
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
              this.getRecordSecond(this.searchArch, this.pageNo, this.pageSize);
            }
          });
      }
    });
  }
  /* 完善工单*/
  /*editContract(index,event) {
    this.contractBool = false;
    this.contractName = JSON.parse(JSON.stringify(this.contract[index]));
    for(let i=0;i<this.leading.length;i++){
      let abc = this.contractName.liablePerson;
      if(abc === this.leading[i].username){
        this.contractName.liablePerson = this.leading[i].userid;
      }
    }
    this.changePerson2(this.contractName.liablePerson);
    $('.form-disable').find('input,textarea').attr("disabled",false);
    $('.form-entry').find('input,select').attr("disabled",true);
    $('.mask-contract').fadeIn();
    $('.mask-contract .mask-head p').html('完善工单信息');
  }*/
  /*工单信息校验*/
  public verifyID() {
    if (!this.isEmpty('ID', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyequipmentName() {
    if (!this.isEmpty('equipmentName', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyequipModel() {
    if (!this.isEmpty('equipModel', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifymaintenance2() {
    if (!this.isEmpty('maintenance2', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifymType() {
    if (!this.isEmpty('mType', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyliablePerson2() {
    if (!this.isEmpty('liablePerson2', '不能为空')) {
      return false;
    }
    return true;
  }
  /*public verifyliableBtime() {
    if (!this.isEmpty('liableBtime', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyliableEtime() {
    if (!this.isEmpty('liableEtime', '不能为空')) {
      return false;
    }
    return true;
  }*/
  public verifyliableNextTime() {
    if (!this.isEmpty('liableNextTime', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyliableCost()  {
    if (!this.isEmpty('liableCost', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyliableNote()  {
    if (!this.isEmpty('liableNote', '不能为空')) {
      return false;
    }
    return true;
  }
  /*新增/编辑工单提交*/
  contractSubmit() {
    let SOFTWARES_URL = "/building/equipment/addEquipmentWO";
    /*if(this.contractBool === false) {
       SOFTWARES_URL = "/building/equipment/updateEquipmentWO";
      this.contractName.liableBtime = this.contractName.liableBtime.replace(/-/g, "/");
       this.contractName.liableEtime = this.contractName.liableEtime.replace(/-/g, "/");
    }*/


    if (!this.verifyID() || !this.verifyequipmentName() || !this.verifyequipModel() || !this.verifymaintenance2() ||
      !this.verifymType() || !this.verifyliablePerson2() ||!this.verifyliableNextTime() || !this.verifyliableCost() ||
      !this.verifyliableNote() ) {
      return false;
    }
    let postData = JSON.parse(JSON.stringify(this.contractName));
    postData.liableNextTime = this.contractName.liableNextTime.replace(/-/g, "/");
    this.ipSetting.sendPost(SOFTWARES_URL,postData).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': this.contractBool === false?'更改成功':'新增成功',
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.contractName = new ArchName();
          this.getRecordSecond(this.searchArch, this.pageNo, this.pageSize);
          this.getDeviceList('','');
          this.contractCancel();
        }else{
          if(this.contractBool === false) {
            /*this.contractName.liableBtime = this.contractName.liableBtime.replace(/\//g, "-");
            this.contractName.liableEtime = this.contractName.liableEtime.replace(/\//g, "-");*/
            this.contractName.liableNextTime = this.contractName.liableNextTime.replace(/\//g, "-");
          }

        }
      });
  }
  changePerson(name){
    for(let i=0;i<this.leading.length;i++){
      if(this.leading[i].userid === name) {
        this.repairname.deptId=this.leading[i].deptId;
        this.repairname.lMail=this.leading[i].oaEmail;
      }
    }
  }
  changePerson2(name){
    for(let i=0;i<this.leading.length;i++){
      if(this.leading[i].userid === name) {
        this.contractName.deptId=this.leading[i].deptId;
        this.contractName.lMail=this.leading[i].oaEmail;
      }
    }
  }
  /*跳页加载数据*/
  goPage(page:number) {
    this.pageNo = page;
    if($('.device-header a:last-child').hasClass('active')) {
      this.getRecordSecond(this.searchArch, this.pageNo, this.pageSize);
    }else {
      this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
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
  /**邮箱格式校验*/
  public verifyIsEmail(id: string, error?: string): boolean {
    const data =  $('#' + id).val();
    if (!String(data).match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
      this.addErrorClass(id,  '邮箱格式错误' );
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /** 匹配数字*/
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
  /**验证手机号码*/
  public verifyIsTel(id: string, error?: string): boolean {
    const data =  $('#' + id).val();
    if (!String(data).match( /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/ )){
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /**校验字符长度小于4 */
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
  /**添加错误信息class*/
  public  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /**去除错误信息class*/
  public  removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').removeClass('form-error');
    $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
  }
}
export class GuardName {
  id: number; // 本条信息ID
  buildingId: string;
  buildingName: string;
  buildingNum:string;
  name: string; // 设备名称
  model: string;// 设备型号
  supplier: string;// 设备供应商
  sPerson:string; // 厂家联系人
  sPhone:string; // 厂家联系人电话
  fileName: string[];// 维保合同附件名称
  filePath: string[];// 维保合同附件路径
  buyDate: string;// 采购日期
  maintenance: string;// 维保单位
  mLastDate: string;// 最近维保日期
  mNextDate: string;// 下次维保日期
  liablePerson: string;// 维保责任人
  lMail: string; // 邮箱
  deptId:string;
}
export class ArchName {
  id: number; // 本条信息ID
  buildingId: string;
  buildingNum:string;
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
  lMail: string; // 邮箱
  deptId:string;
}
export class Company {
  buildingId: string; // 大楼编号
  buildingName: string = '';  // 大楼名称
  name: string = ''; // 设备名称
  liablePerson:string=''; // 维保责任人
}
export class Arch {
  buildingId: string; // 大楼编号
  buildingName: string = '';  // 大楼名称
  equipmentName: string = ''; // 设备名称
  liablePerson:string = ''; // 维保责任人
}

