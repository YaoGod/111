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
  public buildings: any;
  public rule : any;
  public serviceCom:any;
  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  private editBool = true;
  public serverName:any;
  public tempMsg: Array<any>;

  constructor(private http: Http,
              private errorVoid:ErrorResponseService,
              private utilBuildingService:UtilBuildingService,
              private globalCatalogService:GlobalCatalogService,
              public ipSetting  : IpSettingService
  ) {}

  ngOnInit() {
    this.getRule();
    this.searchArch = new Arch();
    this.repairname = new GuardName();
    this.pages = [];
    this.tempMsg = [];
    this.serverName = ['保洁服务','报修服务','借用服务','节假日停车'];
    this.getBuildings();
    this.getCompany();
    this.getRecord(this.searchArch, this.pageNo, this.pageSize);
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'logistics','employ/logistics/property')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          this.rule = data.data[0];
        }
      })
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
    let url = "/employee/property/getAllServer/" + pageNo + "/" + pageSize;
    this.ipSetting.sendPost(url, search).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.record = data['data']['infos'];
          this.total = data.data.total;
        }
      });
  }
  /*获取全部服务公司*/
  private getCompany() {
    let url = "/building/company/getCompany";
    this.ipSetting.sendGet(url)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          this.serviceCom = data.data;
          /*for(let i=0;i<data['data'].length;i++){
           this.serviceCom.push(data['data'][i].companyName);
           }*/
        }
      });
  }
  /*点击查询*/
  repairSearch(num) {
      this.pageNo = num;
      this.getRecord(this.searchArch, this.pageNo, this.pageSize);
  }
  /*编辑信息*/
  editAttach(index){
    this.editBool = false;
    this.repairname = JSON.parse(JSON.stringify(this.record[index]));
    $('.mask').fadeIn();
    $('.mask-head p').html('编辑物业服务');
  }
  /*添加反馈字段*/
  addFeedbackLine(){
    let length = 0;
    for(let i = 0;i<this.tempMsg.length;i++){
      if(this.tempMsg[i].isShow){
        length++;
      }
    }
    if(length<5){
      let object = {isShow: true,key:"",type:"下拉框",list:"",msg:"",value:""};
      this.tempMsg.push(object);
    }
  }
  /*删除临时反馈字段*/
  delFeedbackLine(index){
    this.tempMsg[index].isShow = false;
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
  /*校验信息*/
  public verifyId() {
    if (!this.isEmpty('buildingId', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifycompanyName() {
    if (!this.isEmpty('companyName', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyservername() {
    if (!this.isEmpty('servername', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyserverstatus() {
    if (!this.isEmpty('serverstatus', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifydetail() {
    if (!this.isEmpty('detail', '不能为空')) {
      return false;
    }
    return true;
  }

  public verifyleaseNum() {
    if (!this.isEmpty('leaseNum', '不能为空')) {
      return false;
    }
    return true;
  }

  /*新增/编辑提交*/
  recordSubmit() {
    let SOFTWARES_URL;
    if(this.editBool === false) {
      SOFTWARES_URL = "/employee/property/updateServer";
    }else {
      SOFTWARES_URL = "/employee/property/addServer";
    }
    if (!this.verifyId() || !this.verifycompanyName() || !this.verifyservername() || !this.verifyserverstatus()) {
      return false;
    }
    this.ipSetting.sendPost(SOFTWARES_URL, this.repairname).subscribe(data => {
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
  /*跳页加载数据*/
  goPage(page:number) {
    this.pageNo = page;
    this.getRecord(this.searchArch, this.pageNo, this.pageSize);
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
  /** 匹配数字 */
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
  /**验证手机号码   */
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
  /** 验证身份证号码  */
  public verifyIsCard(id: string, error?: string): boolean {
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
  public verifyLength8(id: string, error: string): boolean  {
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
  public  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /** 去除错误信息class */
  public  removeErrorClass(id: string) {
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
  number:string; // 数量
  type:string; // 型号
  mark:string; // 备用
  price:string; // 价格
  note:string; // 备注
  servername: string; // 服务内容
  serverstatus: string; // 服务状态
}
export class Arch {
  buildingId: string; // 大楼编号
  buildingName: string='';  // 大楼名称
  servername: string='';   // 服务类型
  companyName: string=''; // 服务公司名称
}
