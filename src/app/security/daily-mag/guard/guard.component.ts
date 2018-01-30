import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {InfoBuildingService} from "../../../service/info-building/info-building.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";

declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-guard',
  templateUrl: './guard.component.html',
  styleUrls: ['./guard.component.css'],
  providers: [InfoBuildingService,ErrorResponseService,UtilBuildingService]
})
export class GuardComponent implements OnInit {
  public searchCompany: Company;
  public searchArch : Arch;
  public record: Array<GuardName>;
  public contract : Array<ArchName>;
  public pages: Array<number>;
  public repairname: GuardName;
  public contractName: ArchName;
  public buildings: any;
  public rule : any;
  public jurisdiction:any;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  private editBool = true;
  private contractBool = true;
  public serviceCom:any;
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
    this.contractName.imgPath = '';
    this.getBuildings();
    if($('.guard-header a:last-child').hasClass('active')) {
      $('.guard-arch,.box2').fadeIn();
      this.getRecordSecond(this.searchArch, this.pageNo, this.pageSize);
    }else {
      $('.guard-company,.box1').fadeIn();
      this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
    }
    this.getCompany();
  }
  /*获取权限*/
  private getQuan(){
    if(this.rule!=null){
      let SOFTWARES_URL = "/portal/user/getCata/"+this.rule.ID+"/repair?url=";
      this.ipSetting.sendGet(SOFTWARES_URL).subscribe(data => {
          if(this.errorVoid.errorMsg(data)) {
            for(let i = 0;i<data.data.length;i++){
              if(data.data[i].routeUrl === "guard"){
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
  /*获取/查询服务公司*/
  private getRecord(search, pageNo, pageSize) {
    let SOFTWARES_URL = "/building/company/getCompanyList/" + pageNo + "/" + pageSize;
    this.ipSetting.sendPost(SOFTWARES_URL,search).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.record = data['data']['infos'];
          this.total = data.data.total;
        }
      });
  }
  /*获取全部服务公司*/
  private getCompany() {
    const SOFTWARES_URL = "/building/company/getCompany";
    this.ipSetting.sendGet(SOFTWARES_URL).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.serviceCom = data.data;
        }
      });
  }
  /*获取/查询保安人员档案*/
  private getRecordSecond(search, pageNo, pageSize) {
    let SOFTWARES_URL = "/building/person/getPersonList/" + pageNo + "/" + pageSize;
    this.ipSetting.sendPost(SOFTWARES_URL,search).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.contract = data['data']['infos'];
          this.total = data.data.total;
        }
      });
  }
  /*点击查询*/
  repairSearch() {
    if($('.guard-header a:last-child').hasClass('active')) {
      this.pageNo = 1;
      this.getRecordSecond(this.searchArch, this.pageNo, this.pageSize);
    }else {
      this.pageNo = 1;
      this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
    }
  }
  /*点击新增*/
  addCompany() {
    if($('.guard-header a:last-child').hasClass('active')) {
      this.getCompany();
      this.contractBool = true;
      this.contractName = new ArchName();
      $('.mask-contract').fadeIn();
      $('.mask-contract .mask-head p').html('新增人员档案');
    }else {
      this.editBool = true;
      this.repairname = new GuardName();
      $('.mask-repair').fadeIn();
      $('.mask-repair .mask-head p').html('新增服务公司');
    }
  }
  /*校验公司信息*/
  private verifyId() {
    if (!this.isEmpty('Id', '不能为空')) {
      return false;
    }
    if (!this.verifyIsNumber('Id', '编号为数字')) {
      return false;
    }
    if (!this.verifyLength('Id', '请输入四位')) {
      return false;
    }
    return true;
  }
  private verifycompanyName() {
    if (!this.isEmpty('companyName', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifytype() {
  if (!this.isEmpty('type', '不能为空')) {
    return false;
  }
  return true;
}
  private verifypersonNum() {
    if (!this.isEmpty('personNum', '信息不能为空')) {
      return false;
    }
    if (!this.verifyIsNumber('personNum', '请输入正确的人数')) {
      return false;
    }
    return true;
  }
  /*新增/编辑服务公司提交*/
  recordSubmit() {
    let SOFTWARES_URL;
    if(this.editBool === false) {
      this.pageNo = 1;
      SOFTWARES_URL = "/building/company/updateServerCompany";
    }else {
      SOFTWARES_URL = "/building/company/addServerCompany";
    }
    if (!this.verifyId()|| !this.verifytype() || !this.verifycompanyName() || !this.verifypersonNum()) {
      return false;
    }
    this.ipSetting.sendPost(SOFTWARES_URL,this.repairname).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': this.editBool === false?'更改成功':'新增成功',
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
          this.recordCancel();
        }
      });
  }
  /*公司新增和编辑界面的取消按钮*/
  recordCancel() {
    this.repairname = new GuardName();
    $('.errorMessage').html('');
    $('.mask-repair').hide();
  }
  /*编辑保安公司*/
  editRecord(index) {
    this.editBool = false;
    this.repairname = JSON.parse(JSON.stringify(this.record[index]));
    $('.mask-repair').fadeIn();
    $('.mask-repair .mask-head p').html('编辑服务公司');
  }
  /*删除保安公司*/
  delRecord(index) {
    this.repairname = this.record[index];
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let SOFTWARES_URL = "/building/company/deleteServerCompany/" +this.repairname.id;
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
              this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
            }
          });
      }
    });
  }
  /*点击公司*/
  companyFade(event) {
    this.pageNo = 1;
    this.pages = [];
    this.searchCompany = new Company();
    $(event.target).addClass('active');
    $(event.target).siblings('a').removeClass('active');
    this.repairSearch();
    $('.box1').show();
    $('.box2').hide();
    $('.guard-company').fadeIn();
    $('.guard-arch').hide();
  }
  /*点击人员档案*/
  archFade(event) {
    this.pageNo = 1;
    this.pages = [];
    this.searchArch = new Arch();
    this.searchArch.personType = '';
    $(event.target).addClass('active');
    $(event.target).siblings('a').removeClass('active');
    this.repairSearch();
    $('.box1').hide();
    $('.box2').show();
    $('.guard-arch').fadeIn();
    $('.guard-company').hide();
  }
  private verifycompanyName2() {
    if (!this.isEmpty('companyName2', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifypersonId() {
    if (!this.isEmpty('personId', '不能为空')) {
      return false;
    }
    if (!this.verifyIsNumber('personId', '请输入数字')) {
      return false;
    }
    if (!this.verifyLength8('personId', '请输入8位')) {
      return false;
    }
    return true;
  }
  private verifypersonName() {
    if (!this.isEmpty('personName', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifypersonPhone() {
    if (!this.isEmpty('personPhone', '不能为空')) {
      return false;
    }
    if (!this.verifyIsTel('personPhone', '号码不正确')) {
      return false;
    }
    return true;
  }
  private verifypersonIdcard() {
    if (!this.isEmpty('personIdcard', '不能为空')) {
      return false;
    }
    if (!this.verifyIsCard('personIdcard', '格式不对')) {
      return false;
    }
    return true;
  }
  private verifypersonStatus() {
    if (!this.isEmpty('personStatus', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifypersonType() {
    if (!this.isEmpty('personType', '不能为空')) {
      return false;
    }
    return true;
  }
  /*新增/编辑档案信息提交*/
  contractSubmit() {
    let SOFTWARES_URL;
    if(this.contractBool === false) {
      SOFTWARES_URL = "/building/person/updatePerson";
    }else {
      SOFTWARES_URL = "/building/person/addPerson/1";
    }
    if (!this.verifycompanyName2() || !this.verifypersonType() || !this.verifypersonId() || !this.verifypersonName() ||
      !this.verifypersonPhone() || !this.verifypersonIdcard() || !this.verifypersonStatus()||this.contractName.imgPath ==='') {
      return false;
    }
    this.ipSetting.sendPost(SOFTWARES_URL,this.contractName).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': this.contractBool === false?'更改成功':'新增成功',
            'popType': 0 ,
            'imgType': 1 ,
          });
          $('.mask-contract').hide();
          this.getRecordSecond(this.searchArch, this.pageNo, this.pageSize);
          this.contractCancel();
        }
      });
  }
  /*新增编辑档案信息的取消按钮*/
  contractCancel() {
    this.contractName = new ArchName();
    $('.form-control').removeClass('form-error');
    $('.errorMessage').html('');
    $('.mask-contract').hide();
  }
  /* 编辑人员档案*/
  editContract(index) {
    this.getCompany();
    this.contractBool = false;
    this.contractName = JSON.parse(JSON.stringify(this.contract[index]));

    $('.mask-contract').fadeIn();
    $('.mask-contract .mask-head p').html('编辑人员档案');
  }
  /* 删除人员档案*/
  delContract(index) {
    this.contractName = this.contract[index];
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let SOFTWARES_URL = "/building/person/deletePerson/" +this.contractName.id;
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
  /*图片上传*/
  prese_upload(files,index) {
    var xhr = this.utilBuildingService.uploadImg(files[0],'person',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)) {
          this.contractName.imgPath = data.msg;
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
  /*文件上传*/
  prese_upload2(files) {
    var xhr = this.utilBuildingService.importTemplate2(files[0]);
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
          $('#prese2').val('');
          $('#induction').hide();
          this.pages =[];
          this.pageNo = 1;
          this.getRecordSecond(this.searchArch, this.pageNo, this.pageSize);
        }else{
          $('#prese2').val('');
        }
      }else if (xhr.readyState === 4 && xhr.status === 413){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件太大',
          'popType': 0 ,
          'imgType': 2,
        });
        $('#prese2').val('');
      }
    };
  }
  /*点击导入按钮*/
  private  inductionDialog() {
    $('#induction').fadeIn();
  }
  /*关闭导入对话框*/
  private closeInductionDialog()  {
    $('#induction').fadeOut();
    $('#uploadFileName').val('');
  }
  /*点击导出按钮*/
  private exportFile() {
    $('#deriving').fadeIn();
  }
  /*关闭导出对话框*/
  private closeDeriving() {
    $('#deriving').hide();
  }
  /*导出数据下载*/
  private downDeriving(){
    let InductURL;
    var inerURL = this.searchArch.companyName;
    if((typeof this.searchArch.companyName) === 'undefined'){
      inerURL = 'null';
    }
    if((typeof this.searchArch.personType) === 'undefined'){
      confirmFunc.init({
        'title': '提示' ,
        'mes': '请选择导出人员类型',
        'popType': 0 ,
        'imgType': 2,
      });
      $('#deriving').hide();
      this.searchArch = new Arch();
      return false;
    }
    if(this.searchArch.personType === "保安"){
      InductURL = this.ipSetting.ip + "/building/person/getPersonExcel/"+ inerURL +"/security"
    }else if(this.searchArch.personType === "保洁"){
      InductURL = this.ipSetting.ip + "/building/person/getPersonExcel/"+ inerURL +"/clean"
    }else if(this.searchArch.personType === "绿化"){
      InductURL = this.ipSetting.ip + "/building/person/getPersonExcel/"+ inerURL +"/green"
    }else if(this.searchArch.personType === "物业维修"){
      InductURL = this.ipSetting.ip + "/building/person/getPersonExcel/"+ inerURL +"/repair"
    }if(this.searchArch.personType === ""){
      InductURL = this.ipSetting.ip + "/building/person/getPersonExcel/"+ inerURL +"/null"
    }
    this.http.get( InductURL )
    // .map(res => res.json())
      .subscribe(data => {
        window.location.href =  InductURL;
        this.searchArch = new Arch();
        $('#deriving').fadeOut();
      });
  }
  /*跳页加载数据*/
  goPage(page:number) {
    this.pageNo = page;
    if($('.guard-header a:last-child').hasClass('active')) {
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
  /**验证手机号码   */
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
  /** 验证身份证号码  */
  private verifyIsCard(id: string, error?: string): boolean {
    const data =  $('#' + id).val();
    if (!String(data).match( /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/ )){
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /** 校验字符长度小于4 */
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
  /**校验字符长度小于8 */
  private verifyLength8(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (data.length < 8)  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /** 添加错误信息class   */
  private  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /** 去除错误信息class */
  private  removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').removeClass('form-error');
    $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
  }
}
export class GuardName {
  id: number; // 本条信息ID
  buildingId: string;
  buildingName: string;
  companyName: string; // 公司名字
  type: string; // 服务公司类别
  personNum: number; // 人数
}
export class ArchName {
  id: number; // 本条信息ID
  companyName: string; // 公司名称
  imgPath: string; // 头像地址
  personAge: 0; // 年龄
  personId:string; // 编号
  personIdcard: 0; // 身份证号
  personName:string; // 姓名
  personPhone: 0; // 联系电话
  personSex:string; // 性别
  personStatus: string; // 人员状态
  personType:string; // 人员类别
}
export class Company {
  buildingId: string; // 大楼编号
  buildingName: String = '';  // 大楼名称
  type: string;
  companyName: String = ''; // 服务公司名称
}
export class Arch {
  buildingId: string; // 大楼编号
  buildingName: String = '';  // 大楼名称
  personType: string;
  companyName: String = ''; // 服务公司名称
}
