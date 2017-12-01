import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {InfoBuildingService} from "../../../service/info-building/info-building.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";

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

  private pageSize = 5;
  private pageNo = 1;
  private editBool = true;
  private contractBool = true;
  constructor(
    private http: Http,
    private errorVoid:ErrorResponseService,
    private utilBuildingService:UtilBuildingService,
  ) { }

  ngOnInit() {
    this.repairname = new GuardName();
    this.contractName = new ArchName();
    this.searchCompany =  new Company();
    this.searchArch = new Arch();
    this.pages = [];
    this.repairname.type = 'security';
    this.contractName.personType = 'security';
    this.contractName.imgPath = '';

    if($('.guard-header a:last-child').hasClass('active')) {
      console.log('档案');
      $('.guard-arch,.box2').fadeIn();
      this.getRecordSecond(this.searchArch, this.pageNo, this.pageSize);
    }else {
      console.log('公司');
      $('.guard-company,.box1').fadeIn();
      this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
    }
  }
  /*获取/查询保安公司*/
  private getRecord(search, pageNo, pageSize) {
    const SOFTWARES_URL = "/proxy/building/company/getCompanyList/" + pageNo + "/" + pageSize;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify
    search.type = 'security';
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
  /*获取/查询保安人员档案*/
  private getRecordSecond(search, pageNo, pageSize) {
    const SOFTWARES_URL = "/proxy/building/person/getPersonList/" + pageNo + "/" + pageSize;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify
    search.personType = "security";
    this.http.post(SOFTWARES_URL, search, options)
      .map(res => res.json())
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.contract = data['data']['infos'];
          let total = Math.ceil(data.data.total / this.pageSize);
          this.initPage(total);
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
      this.contractBool = true;
      this.contractName = new ArchName();
      $('.mask-contract').fadeIn();
    }else {
      this.editBool = true;
      this.repairname = new GuardName();
      $('.mask-repair').fadeIn();
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
      SOFTWARES_URL = "/proxy/building/company/updateServerCompany";
    }else {
      SOFTWARES_URL = "/proxy/building/company/addServerCompany";
    }
    if (!this.verifyId() || !this.verifycompanyName() || !this.verifypersonNum()) {
      return false;
    }
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify
    this.repairname.type = 'security';
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
          this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
          this.recordCancel();
        }
      });
  }
  /*记录新增和编辑界面的取消按钮*/
  recordCancel() {
    this.repairname = new GuardName();
    $('.errorMessage').html('');
    $('.mask-repair').hide();
  }
  /*编辑保安公司*/
  editRecord(index) {
    this.editBool = false;
    this.repairname = this.record[index];
    $('.mask-repair').fadeIn();
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
        let SOFTWARES_URL = "/proxy/building/company/deleteServerCompany/" +this.repairname.id;
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
    return true;
  }
  private verifypersonStatus() {
    if (!this.isEmpty('personStatus', '不能为空')) {
      return false;
    }
    return true;
  }
  /*新增/编辑档案信息提交*/
  contractSubmit() {
    let SOFTWARES_URL;
    if(this.contractBool === false) {
      SOFTWARES_URL = "/proxy/building/person/updatePerson";
    }else {
      SOFTWARES_URL = "/proxy/building/person/addPerson/1";
    }
    if (!this.verifycompanyName2() || !this.verifypersonId() || !this.verifypersonName() || !this.verifypersonPhone() ||
      !this.verifypersonIdcard() || !this.verifypersonStatus() ) {
      return false;
    }
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify
    this.contractName.personType = 'security';
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
    this.contractBool = false;
    this.contractName = this.contract[index];
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
        let SOFTWARES_URL = "/proxy/building/person/deletePerson/" +this.contractName.id;
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
        }
      }
    };
  }
  /*文件上传*/
  prese_upload2(files) {
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
          $('#induction').hide();
        }
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
    if((typeof this.searchArch.companyName) === 'undefined'){
      this.searchArch.companyName = 'null';
    }
    this.http.get("/proxy/building/person/getPersonExcel/"+ this.searchArch.companyName +"/security")
    // .map(res => res.json())
      .subscribe(data => {
        window.location.href = "/proxy/building/person/getPersonExcel/"+ this.searchArch.companyName +"/security";
        this.searchArch = new Arch();
        $('#deriving').fadeOut();
      });
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
    if(this.pages.length < 5) {
      return false;
    }else if(this.pageNo < 5) {
      return true;
    }else if(page<=5 && this.pageNo <= 3) {
      return false;
    }else if(page>=this.pages.length -4 && this.pageNo>=this.pages.length-2) {
      return false;
    }else if (page<=this.pageNo+2 && page>=this.pageNo-2) {
      return false;
    }
    return true;
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
    if (data.toString().trim() === '')  {
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
  buildingName: string;  // 大楼名称
  type: string;
  companyName: string; // 服务公司名称
}
export class Arch {
  buildingId: string; // 大楼编号
  buildingName: string;  // 大楼名称
  type: string;
  companyName: string; // 服务公司名称
}
