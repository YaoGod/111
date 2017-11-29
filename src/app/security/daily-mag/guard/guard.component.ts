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
    this.contractName.personType = 'guard';
    this.contractName.fileName = [];
    this.contractName.filePath = [];

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
    const SOFTWARES_URL = "/proxy/building/company/getCompanyList/" + pageNo + "/" + pageSize;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify
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
  /*新增保安公司*/
  addCompany() {
    if($('.guard-header a:last-child').hasClass('active')) {
      $('.mask-contract').fadeIn();
    }else {
      $('.mask-repair').fadeIn();
    }
  }
  /*校验公司信息*/
  private verifyId() {
    if (!this.isEmpty('Id', '信息不能为空')) {
      return false;
    }
    if (!this.verifyIsNumber('Id', '编号为纯数字')) {
      return false;
    }
    if (!this.verifyLength('Id', '请输入四位数字')) {
      return false;
    }
    return true;
  }
  private verifycompanyName() {
    if (!this.isEmpty('companyName', '信息不能为空')) {
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
    console.log(this.repairname);
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
          this.searchCompany = new Company();
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
      'mes': '是否删除此记录？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let SOFTWARES_URL = "/proxy/building/repair/deleteRepairRecord/" +this.repairname.id;
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
              this.searchCompany = new Company();
              this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
            }
          });
      }
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
  buildingId: string;
  buildingName: string;
  companyName: string; // 保安公司
  personNum: 0; // 人数
  personType:string; // 服务人员类别
  filePath: string[]; // 合同路径
  fileName: string[]; // 合同名字
}
export class Company {
  buildingId: string; // 大楼编号
  buildingName: string;  // 大楼名称
  tyoe: string;
  companyType: string; // 服务公司类别
  companyName: string; // 服务公司名称
}
export class Arch {
  buildingId: string; // 大楼编号
  buildingName: string;  // 大楼名称
  contractBtime: string; // 合同开始时间
  contractEtime: string; // 合同结束时间
}
