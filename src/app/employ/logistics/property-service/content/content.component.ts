import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions, Headers} from "@angular/http";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {UtilBuildingService} from "../../../../service/util-building/util-building.service";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {InfoBuildingService} from "../../../../service/info-building/info-building.service";

declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  providers: [InfoBuildingService,ErrorResponseService,UtilBuildingService]
})
export class ContentComponent implements OnInit {
  public searchArch : Arch;
  public record: Array<GuardName>;
  public repairname: GuardName;
  public pages: Array<number>;
  public buildings: any;
  public rule : any;
  public jurisdiction:any;
  public serviceCom:any;
  private pageSize = 10;
  private pageNo = 1;
  private editBool = true;
  public serverName:any;

  constructor(private http: Http,
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
    this.searchArch = new Arch();
    this.repairname = new GuardName();
    this.pages = [];
    this.searchArch.servername = "";
    this.serverName = ['保洁服务','报修服务','住家服务'];
    this.getRecord(this.searchArch, this.pageNo, this.pageSize);
  }
  /*获取权限*/
  private getQuan(){
    if(this.rule!=null){
      let SOFTWARES_URL =  "/portal/user/getCata/"+this.rule.ID+"/repair";
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
  /*获取/查询服务公司*/
  private getRecord(search, pageNo, pageSize) {
    const SOFTWARES_URL =  this.ipSetting.ip + "/employee/property/getAllServer/" + pageNo + "/" + pageSize;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
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
  /*获取全部服务公司*/
  private getCompany() {
    const SOFTWARES_URL =  this.ipSetting.ip + "/building/company/getCompany";
    this.http.get(SOFTWARES_URL)
      .map(res => res.json())
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.serviceCom = data.data;
          //
          /*for(let i=0;i<data['data'].length;i++){
           this.serviceCom.push(data['data'][i].companyName);
           }*/
        }
      });
  }
  /*点击查询*/
  repairSearch() {
      this.pageNo = 1;
      this.getRecord(this.searchArch, this.pageNo, this.pageSize);
  }
  /*编辑信息*/
  editAttach(index){
    this.editBool = false;
    this.getBuildings();
    this.getCompany();
    this.repairname = JSON.parse(JSON.stringify(this.record[index]));
    $('.mask').fadeIn();
    $('.mask-head p').html('编辑物业服务');
  }
  /*删除信息*/
  delAttach(index){
    this.repairname = this.record[index];
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let SOFTWARES_URL = this.ipSetting.ip + "/employee/property/deleteServer/" +this.repairname.id;
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
              this.getRecord(this.searchArch, this.pageNo, this.pageSize);
            }
          });
      }
    });
  }
  /*点击新增*/
  addCompany() {
    this.repairname = new GuardName();
    this.editBool = true;
    this.getBuildings();
    this.getCompany();
    $('.mask').fadeIn();
    $('.mask-head p').html('新增物业服务');
  }
  /*新增和编辑界面的取消按钮*/
  recordCancel() {
    this.repairname = new GuardName();
    $('.errorMessage').html('');
    $('.mask').hide();
  }
  queryId(pty){

    /*for(let i=0;i<this.serviceCom.length;i++){
      if(this.serviceCom[i].companyName === pty){

      }
    }*/
  }
  /*校验信息*/
  private verifyId() {
    if (!this.isEmpty('buildingId', '不能为空')) {
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
  private verifyservername() {
    if (!this.isEmpty('servername', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifyserverstatus() {
    if (!this.isEmpty('serverstatus', '不能为空')) {
      return false;
    }
    return true;
  }
  private verifydetail() {
    if (!this.isEmpty('detail', '不能为空')) {
      return false;
    }
    return true;
  }
  /*新增/编辑提交*/
  recordSubmit() {
    let SOFTWARES_URL;
    if(this.editBool === false) {
      this.pageNo = 1;
      SOFTWARES_URL = this.ipSetting.ip + "/employee/property/updateServer";
    }else {
      SOFTWARES_URL = this.ipSetting.ip + "/employee/property/addServer";
    }
    if (!this.verifyId() || !this.verifycompanyName() || !this.verifyservername() || !this.verifyserverstatus()||!this.verifydetail()) {
      return false;
    }
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({headers: headers});
    // JSON.stringify
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
          this.getRecord(this.searchArch, this.pageNo, this.pageSize);
          this.recordCancel();
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
    if(this.pages.length < 5){
      return false;
    } else if(page<=5 && this.pageNo <= 3){
      return false;
    } else if(page>=this.pages.length -4 && this.pageNo>=this.pages.length-2){
      return false;
    } else if (page<=this.pageNo+2 && page>=this.pageNo-2){
      return false;
    }
    return true;
  }
  /*跳页加载数据*/
  goPage(page:number) {
    this.pageNo = page;
    this.getRecord(this.searchArch, this.pageNo, this.pageSize);
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
  /** 匹配数字 */
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
  companyId: string;
  companyName: string; // 公司名字
  detail:string; // 服务详情
  servername: string; // 服务内容
  serverstatus: string; // 服务状态
}
export class Arch {
  buildingId: string; // 大楼编号
  buildingName: string;  // 大楼名称
  servername: string;           // 服务类型
  companyName: string; // 服务公司名称
}
