import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {InfoBuildingService} from "../../../service/info-building/info-building.service";


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

  private pageSize = 5;
  private pageNo = 1;
  private editBool = true;
  private contractBool = true;
  constructor(
    private http: Http,
    private errorVoid:ErrorResponseService,
    private utilBuildingService:UtilBuildingService,) { }

  ngOnInit() {
    this.repairname = new GuardName();
    this.contractName = new ArchName();
    this.searchCompany =  new Company();
    this.searchArch = new Arch();
    this.pages = [];

    if($('.guard-header a:last-child').hasClass('active')) {
      console.log('保养信息');
      $('.guard-arch,.box2').fadeIn();
      // this.getRecordSecond(this.searchArch, this.pageNo, this.pageSize);
    }else {
      console.log('设备基础信息');
      $('.guard-company,.box1').fadeIn();
      this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
    }
  }
  /*获取/查询设备信息*/
  private getRecord(search, pageNo, pageSize) {
    const SOFTWARES_URL = "/proxy/building/equipment/getEquipmentList/" + pageNo + "/" + pageSize;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify
    console.log(search);
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
  /*获取工单*/
  private getRecordSecond(search, pageNo, pageSize) {
    const SOFTWARES_URL = "/proxy/building/person/getPersonList/" + pageNo + "/" + pageSize;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify
    search.personType = "clean";
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
    if($('.device-header a:last-child').hasClass('active')) {
      // console.log('查询人员档案');
      this.pageNo = 1;
      this.getRecordSecond(this.searchArch, this.pageNo, this.pageSize);
    }else {
      // console.log('查询公司');
      this.pageNo = 1;
      this.getRecord(this.searchCompany, this.pageNo, this.pageSize);
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
    $('.guard-arch').hide();
  }
  /*点击人员档案*/
  mainFade(event) {
    this.pageNo = 1;this.pages = [];
    this.searchArch = new Arch();
    $(event.target).addClass('active');
    $(event.target).siblings('a').removeClass('active');
    this.repairSearch();
    $('.box1').hide();
    $('.box2').show();
    $('.guard-arch').fadeIn();
    $('.guard-company').hide();
  }
  /*点击新增*/
  addCompany() {
    if($('.decive-header a:last-child').hasClass('active')) {
      this.contractBool = true;
      this.contractName = new ArchName();
      $('.mask-contract').fadeIn();
    }else {
      this.editBool = true;
      this.repairname = new GuardName();
      $('.mask-repair').fadeIn();
    }
  }
  /*新增编辑档案信息的取消按钮*/
  contractCancel() {
    this.contractName = new ArchName();
    $('#prese').val('');
    $('.form-control').removeClass('form-error');
    $('.errorMessage').html('');
    $('.mask-repair').hide();
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
  name: string; // 设备名称
  model: string;// 设备型号
  supplie: string;// 设备供应商
  imgPath: string;// 设备图片
  buyDate: string;// 采购日期
  maintenance: string;// 维保单位
  mLastDate: string;// 最近维保日期
  mNextDate: string;// 下次维保日期
  liablePerson: string;// 维保责任人
  lMai: string; // 邮箱
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
  name: string; // 设备名称
}
export class Arch {
  buildingId: string; // 大楼编号
  buildingName: string;  // 大楼名称
  name: string; // 设备名称
}
