import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {InfoBuildingService} from "../../../service/info-building/info-building.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";


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
    this.repairname = new GuardName();
    this.contractName = new ArchName();
    this.searchCompany =  new Company();
    this.searchArch = new Arch();
    this.pages = [];

    if($('.device-header a:last-child').hasClass('active')) {
      //
      $('.guard-arch,.box2').fadeIn();
      // this.getRecordSecond(this.searchArch, this.pageNo, this.pageSize);
    }else {
      //
      $('.guard-company,.box1').fadeIn();
      this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
    }
    this.getBuildings();
  }
  /*获取权限*/
  private getQuan(){
    if(this.rule!=null){
      const SOFTWARES_URL = this.ipSetting.ip + "/portal/user/getCata/"+this.rule.ID+"/repair";
      this.http.get(SOFTWARES_URL)
        .map(res => res.json())
        .subscribe(data => {
          if(this.errorVoid.errorMsg(data)) {
            this.jurisdiction = data['data'][0];
          }
        });
    }
  }
  /*获取大楼列表*/
  private getBuildings() {
    const SOFTWARES_URL = this.ipSetting.ip + "/building/util/getBuildingList";
    this.http.get(SOFTWARES_URL)
      .map(res => res.json())
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.buildings = data['data'];
        }
      });
  }
  /*获取/查询设备信息*/
  private getRecord(search, pageNo, pageSize) {
    const SOFTWARES_URL = this.ipSetting.ip + "/building/equipment/getEquipmentList/" + pageNo + "/" + pageSize;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify
    this.http.post(SOFTWARES_URL, search, options)
      .map(res => res.json())
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.record = data['data']['infos'];
          this.total = data.data.total;
        }
      });
  }
  /*获取工单*/
  private getRecordSecond(search, pageNo, pageSize) {
    const SOFTWARES_URL = this.ipSetting.ip + "/building/equipment/getEquipmentWO/" + pageNo + "/" + pageSize;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify

    this.http.post(SOFTWARES_URL, search, options)
      .map(res => res.json())
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.contract = data['data']['infos'];
          this.total = data.data.total;
        }
      });
  }
  /*点击查询*/
  repairSearch() {
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
    if($('.device-header a:last-child').hasClass('active')) {
      this.contractBool = true;
      this.contractName = new ArchName();
      $('.mask-contract').fadeIn();
      $('.mask-contract .mask-head p').html('新增工单信息');
      $('.form-entry').find('input').attr("disabled",false);
      $('.form-disable').find('input,textarea').attr("disabled",true);
    }else {
      this.editBool = true;
      this.repairname = new GuardName();
      $('.mask-repair').fadeIn();
      $('.mask-repair .mask-head p').html('新增大型设备信息');
    }
  }
  /*点击设备基础信息*/
  deviceFade(event) {
    this.pageNo = 1;
    this.pages = [];
    this.searchCompany = new Company();
    $(event.target).addClass('active');
    $(event.target).siblings('a').removeClass('active');
    this.repairSearch();
    $('.box1').show();
    $('.box2').hide();
    $('.guard-company').fadeIn();
    $('.device-arch').hide();// device-arch
  }
  /*点击工单*/
  mainFade(event) {
    this.pageNo = 1;
    this.pages = [];
    this.searchArch = new Arch();
    $(event.target).addClass('active');
    $(event.target).siblings('a').removeClass('active');
    this.repairSearch();
    $('.box1').hide();
    $('.box2').show();
    $('.device-arch').fadeIn();
    $('.guard-company').hide();
  }

  /*记录新增和编辑界面的取消按钮*/
  recordCancel() {
    this.repairname = new GuardName();
    $('.errorMessage').html('');
    $('.mask-repair').hide();
  }
  /*新增工单的取消按钮*/
  contractCancel() {
    this.contractName = new ArchName();
    $('.form-control').removeClass('form-error');
    $('.errorMessage').html('');
    $('.mask-contract').hide();
  }

  /*图片上传*/
  prese_upload(files,index) {
    var xhr = this.utilBuildingService.uploadImg(files[0],'equip',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)) {
          this.repairname.imgPath = data.msg;
          confirmFunc.init({
            'title': '提示' ,
            'mes': '上传成功',
            'popType': 0 ,
            'imgType': 1,
          });
          $('#prese').val('');
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
  private verifybuildingId() {
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
  private verifyname() {
    if (!this.isEmpty('name', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifymodel() {
    if (!this.isEmpty('model', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifybuyDate() {
    if (!this.isEmpty('buyDate', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifysupplier() {
    if (!this.isEmpty('supplier', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifymaintenance() {
    if (!this.isEmpty('maintenance', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifymLastDate() {
    if (!this.isEmpty('mLastDate', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifymNextDate() {
    if (!this.isEmpty('mNextDate', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyliablePerson() {
    if (!this.isEmpty('liablePerson', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifylMail()  {
    if (!this.isEmpty('lMail', '邮箱不能为空')) {
      return false;
    }
    if (!this.verifyIsEmail('lMail', '邮箱格式不正确')) {
      return false;
    }
    return true;
  }
  /*新增/编辑设备信息提交*/
  recordSubmit() {
    let SOFTWARES_URL;
    if(this.editBool === false) {
      this.pageNo = 1;
      SOFTWARES_URL = this.ipSetting.ip + "/building/equipment/updateEquipment";
    }else {
      SOFTWARES_URL = this.ipSetting.ip + "/building/equipment/addEquipment";
    }
    if (!this.verifybuildingId() || !this.verifyname() || !this.verifymodel() || !this.verifybuyDate() || !this.verifysupplier()
      || !this.verifymaintenance() || !this.verifymLastDate() || !this.verifymNextDate() || !this.verifyliablePerson() ||
      !this.verifylMail()) {
      return false;
    }
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    this.repairname.buyDate = this.repairname.buyDate.replace(/-/g, "/");
    this.repairname.mLastDate = this.repairname.mLastDate.replace(/-/g, "/");
    this.repairname.mNextDate = this.repairname.mNextDate.replace(/-/g, "/");
    this.http.post(SOFTWARES_URL, this.repairname, options)
      .map(res => res.json())
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': this.editBool === false?'更新成功':'新增成功',
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
          this.recordCancel();
        }else{
          this.repairname.buyDate = this.repairname.buyDate.replace(/\//g, "-");
          this.repairname.mLastDate = this.repairname.mLastDate.replace(/\//g, "-");
          this.repairname.mNextDate = this.repairname.mNextDate.replace(/\//g, "-");
        }
      });
  }
  /*编辑设备信息*/
  editRecord(index) {
    this.editBool = false;
    this.repairname = JSON.parse(JSON.stringify(this.record[index]));
    this.repairname.buyDate = this.repairname.buyDate.replace(/\//g, "-");
    this.repairname.mLastDate = this.repairname.mLastDate.replace(/\//g, "-");
    this.repairname.mNextDate = this.repairname.mNextDate.replace(/\//g, "-");
    $('.mask-repair').fadeIn();
    $('.mask-repair .mask-head p').html('编辑大型设备信息');
  }
  /*删除设备信息*/
  delRecord(index) {
    this.repairname = this.record[index];
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let SOFTWARES_URL = this.ipSetting.ip + "/building/equipment/deleteEquipment/" +this.repairname.id;
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
              this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
            }
          });
      }
    });
  }
  /*删除工单*/
  delOrder(index){
    this.contractName = this.contract[index];
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let SOFTWARES_URL = this.ipSetting.ip + "/building/equipment/deleteEquipmentWO/" +this.contractName.id;
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
              this.getRecordSecond(this.searchArch, this.pageNo, this.pageSize);
            }
          });
      }
    });
  }
  /* 完善工单*/
  editContract(index,event) {
    this.contractBool = false;
    this.contractName = JSON.parse(JSON.stringify(this.contract[index]));
    $('.form-disable').find('input,textarea').attr("disabled",false);
    $('.form-entry').find('input').attr("disabled",true);
    $('.mask-contract').fadeIn();
    $('.mask-contract .mask-head p').html('完善工单信息');
  }
  /*工单信息校验*/
  private verifyID() {
    if (!this.isEmpty('ID', '不能为空')) {
      return false;
    }
    if (!this.verifyIsNumber('ID', '编号为数字')) {
      return false;
    }
    if (!this.verifyLength('ID', '请输入四位')) {
      return false;
    }
    return true;
  }
  private verifyequipmentName() {
    if (!this.isEmpty('equipmentName', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyequipModel() {
    if (!this.isEmpty('equipModel', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifymaintenance2() {
    if (!this.isEmpty('maintenance2', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifymType() {
    if (!this.isEmpty('mType', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyliablePerson2() {
    if (!this.isEmpty('liablePerson2', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyliableBtime() {
    if (!this.isEmpty('liableBtime', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyliableEtime() {
    if (!this.isEmpty('liableEtime', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyliableNextTime() {
    if (!this.isEmpty('liableNextTime', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyliableCost()  {
    if (!this.isEmpty('liableCost', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyliableNote()  {
    if (!this.isEmpty('liableNote', '不能为空')) {
      return false;
    }
    return true;
  }
  /*新增/编辑工单提交*/
  contractSubmit() {
    let SOFTWARES_URL;
    if(this.contractBool === false) {
      SOFTWARES_URL = this.ipSetting.ip + "/building/equipment/updateEquipmentWO";
      if ( !this.verifyliableBtime() || !this.verifyliableEtime() || !this.verifyliableNextTime() || !this.verifyliableCost() ||
        !this.verifyliableNote() ) {
        return false;
      }
      this.contractName.liableBtime = this.contractName.liableBtime.replace(/-/g, "/");
      this.contractName.liableEtime = this.contractName.liableEtime.replace(/-/g, "/");
      this.contractName.liableNextTime = this.contractName.liableNextTime.replace(/-/g, "/");
      $('.device-arch .order-btn').attr("disable",true);
    }else {
      SOFTWARES_URL = this.ipSetting.ip + "/building/equipment/addEquipmentWO";
      if (!this.verifyID() || !this.verifyequipmentName() || !this.verifyequipModel() || !this.verifymaintenance2() ||
        !this.verifymType() || !this.verifyliablePerson2() ) {
        return false;
      }
    }
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify
    this.http.post(SOFTWARES_URL, this.contractName, options)
      .map(res => res.json())
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': this.contractBool === false?'更改成功':'新增成功',
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.contractName = new ArchName();
          this.getRecordSecond(this.searchArch, this.pageNo, this.pageSize);
          this.contractCancel();
        }else{
          if(this.contractBool === false) {
            this.contractName.liableBtime = this.contractName.liableBtime.replace(/\//g, "-");
            this.contractName.liableEtime = this.contractName.liableEtime.replace(/\//g, "-");
            this.contractName.liableNextTime = this.contractName.liableNextTime.replace(/\//g, "-");
          }

        }
      });
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
      this.addErrorClass(id,  '邮箱格式错误' );
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
   * 验证手机号码
   * @return
   */
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
export class GuardName {
  id: number; // 本条信息ID
  buildingId: string;
  buildingName: string;
  name: string; // 设备名称
  model: string;// 设备型号
  supplier: string;// 设备供应商
  imgPath: string;// 设备图片
  buyDate: string;// 采购日期
  maintenance: string;// 维保单位
  mLastDate: string;// 最近维保日期
  mNextDate: string;// 下次维保日期
  liablePerson: string;// 维保责任人
  lMail: string; // 邮箱
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
export class Company {
  buildingId: string; // 大楼编号
  buildingName: string;  // 大楼名称
  equipmentName: string; // 设备名称
  liablePerson:string; // 维保责任人
}
export class Arch {
  buildingId: string; // 大楼编号
  buildingName: string;  // 大楼名称
  equipmentName: string; // 设备名称
  liablePerson:string; // 维保责任人
}
