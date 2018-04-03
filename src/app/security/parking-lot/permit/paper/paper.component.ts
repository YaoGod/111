import { Component, OnInit } from '@angular/core';
import {UtilBuildingService} from "../../../../service/util-building/util-building.service";
import {SaleProductEmployeeService} from "../../../../service/sale-product-employee/sale-product-employee.service";
import {Http} from "@angular/http";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {GlobalCatalogService} from "../../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";

declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.css'],
  providers:[UtilBuildingService,SaleProductEmployeeService,]
})
export class PaperComponent implements OnInit {
  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public length = 10;
  private contractBool = true;
  public buildings: any;
  public deptList: any;
  public rule : any;
  public jurisdiction:any;
  public searchInfo = new CardInfo();
  public newCard = new CardInfo();
  public record : Array<CardInfo> = new Array<CardInfo>();
  constructor( private http: Http,
               private errorVoid:ErrorResponseService,
               private globalCatalogService:GlobalCatalogService,
               private utilBuildingService:UtilBuildingService,
               private saleProductEmployeeService:SaleProductEmployeeService,
               public ipSetting  : IpSettingService) { }

  ngOnInit() {
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("security/parking");
        this.getQuan();
      }
    );
    this.getQuan();
    this.repairSearch(1);
    this.getBuildings();
    this.getDeptList();
    this.searchInfo.useUserDept = '';
  }
  /*获取权限*/
  private getQuan(){
    if(this.rule!=null){
      let url = "/portal/user/getCata/"+this.rule.ID+"/parking?url=";
      this.ipSetting.sendGet(url).subscribe(data => {
        if(this.errorVoid.errorMsg(data)) {
          for(let i = 0;i<data.data.length;i++){
            if(data.data[i].routeUrl === "security/parking/permit"){
              this.jurisdiction = data.data[i];
              // console.log(this.jurisdiction)
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
          // console.log(this.buildings);
        }
      })
  }
  /*获取所有部门列表*/
  getDeptList(){
    this.saleProductEmployeeService.getDeptList()
      .subscribe(data =>{
        if(this.errorVoid.errorMsg(data)){
          this.deptList = data.data;
        }
      });
  }
  /*获取停车证信息*/
  getPermitInfo(){
    let url = "/building/parking/getParkingPermitList/list/"+this.pageNo+"/"+this.pageSize;

    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        // console.log(data.data.infos);
        this.record = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  /*根据员工号获取人员和姓名*/
  getUserName(value) {
    if (value && value.length > 7) {
      let url = "/portal/user/getUserInfo/" + value;
      this.ipSetting.sendGet(url).subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.newCard.useUserDept = data.data.deptId;
          this.newCard.useUserName = data.data.username;
          this.newCard.useUserTel = data.data.teleNum;
        }
        if (data.status === 1) {
          this.newCard.useUserDept = '';
          this.newCard.useUserName = '';
          this.newCard.useUserTel = '';
        }
      });
    }
  }
  /*获取员工车辆信息*/
  getUserCar(id){
    if (id && id.length > 7) {
      let inner = '';
      let url = "/building/carInfo/getUserCar/" + id;
      this.ipSetting.sendGet(url).subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          if (data.data.length < 2) {
            inner += data.data[0].carNumber;
          } else {
            for (let i = 0; i < data.data.length; i++) {
              inner += data.data[i].carNumber + ',';
            }
          }
          this.newCard.useCarCode = inner.substring(0, inner.length - 1);
        }
      });
    }
  }
  /*点击查询*/
  repairSearch(num){
    this.pageNo = num;
    this.getPermitInfo();
  }
  /*点击新增*/
  addVehicle(){
    this.contractBool = true;
    $('.form-disable').attr('disabled',false).css('backgroundColor','#fff');
    this.newCard = new CardInfo();
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('新增停车证');
  }
  /*queryBuilding*/
  queryBuilding(name){
    for(let i=0;i<this.buildings.length;i++){
      if(this.buildings[i].NAME === name){
        this.newCard.buildingId = this.buildings[i].ID;
      }
    }
  }
  /*取消*/
  addCancel(){
    $('.mask').fadeOut();
    $('.errorMessage').html('');
  }
  public verifybuildingName() {
    if (!this.isEmpty('buildingName', '不能为空')) {
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
  public verifytype() {
    if (!this.isEmpty('type', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifycode() {
    if (!this.isEmpty('code', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifystatus() {
    if (!this.isEmpty('status', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyeTime() {
    if (!this.isEmpty('eTime', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifybTime() {
    if (!this.isEmpty('bTime', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyuseUserId() {
    if (!this.isEmpty('useUserId', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyuseUserName() {
    if (!this.isEmpty('useUserName', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyuseUserDept() {
    if (!this.isEmpty('useUserDept', '不能为空')) {
      return false;
    }
    return true;
  }
  public verifyuseCarCode() {
    if (!this.isEmpty('useCarCode', '不能为空')) {
      return false;
    }
    return true;
  }
  submit(){
    var url;
    if(this.contractBool === false){
      url = "/building/parking/updateParkingPermitInfo";
    }else{
      url = "/building/parking/addParkingPermitInfo";
    }
    if (!this.verifybuildingName()||!this.verifyname() ||!this.verifytype() || !this.verifycode() || !this.verifystatus()||
      !this.verifyeTime()) {
      return false;
    }

    this.ipSetting.sendPost(url, this.newCard).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        confirmFunc.init({
          'title': '提示' ,
          'mes': this.contractBool === false?'更新成功':'新增成功',
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.repairSearch(1);
        this.addCancel();
      }
    });

  }
  /*点击导入*/
  leadIn(){
    $('#induction').fadeIn();
  }
  /*关闭导入对话框*/
  public closeInduction()  {
    $('#induction').fadeOut();
    $('#prese').val('');
  }
  /*文件上传*/
  prese_upload(files) {
    // POST /building/parking/importTemplate
    var xhr = this.utilBuildingService.importTempPermit(files[0]);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)) {
          if(data.status === 0 && data.data.result==='success'){
            confirmFunc.init({
              'title': '提示' ,
              'mes': '导入成功',
              'popType': 0 ,
              'imgType': 1,
            });
          }else if(data.data.result==='fail'){
            confirmFunc.init({
              'title': '提示',
              'mes': '导入失败，是否下载错误信息？',
              'popType': 1,
              'imgType': 3,
              "callback": () => {
                window.location.href = this.ipSetting.ip+'/common/file/downErrorExcel/'+data.data.fileName;
              }
            })
          }
          $('#prese').val('');
          $('#induction').hide();
          this.pageNo = 1;
          this.getPermitInfo();
        }else{
          $('#prese').val('');
        }
      }
    };
  }
  /*点击导出*/
  leadOut(){
    $('#deriving').fadeIn();
  }
  /*关闭导出对话框*/
  public closeDeriving() {
    $('#deriving').hide();
  }
  /*导出数据下载*/
  public downDeriving(){
    /*if((typeof this.search.energyType) === 'undefined'){
     // this.search.companyName = 'null';
     }
     this.search.bTime = this.search.bTime.replace(/-/g, "/");
     this.search.eTime = this.search.eTime.replace(/-/g, "/");*/
    let url = this.ipSetting.ip + "/building/parking/getParkingPermitList/excel/1/5";
    this.http.get(url)
    // .map(res => res.json())
      .subscribe(data => {
        window.location.href = this.ipSetting.ip + "/building/parking/getParkingPermitList/excel/1/5";
        // this.search = new Search();
        $('#deriving').fadeOut();
      });
  }
  /*点击编辑*/
  editCardInfo(id,useId){
    this.contractBool = false;
    $('.form-disable').attr('disabled',true).css('backgroundColor','#f8f8f8');
    this.getUserName(useId);
    this.getUserCar(useId);
    let url = '/building/parking/getParkingPermitInfo/'+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        // console.log(data.data);
        this.newCard = data.data;
      }
    });
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('编辑停车证');
  }
  /*点击删除*/
  delCardInfo(id){
    confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let url = '/building/parking/deleteParkingPermitInfo/'+id;
        this.ipSetting.sendGet(url).subscribe(data => {
          if(this.errorVoid.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示' ,
              'mes': data['msg'],
              'popType': 0 ,
              'imgType': 1 ,
            });
            this.pageNo = 1;
            this.getPermitInfo();
          }
        });
      }
    });
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
  /** 验证车牌号  */
  public verifyIsCardNum(id: string, error?: string): boolean {
    const data =  $('#' + id).val();
    if (!String(data).match(/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/)){
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /** 添加错误信息class */
  public  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-inp').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /**去除错误信息class */
  public  removeErrorClass(id: string) {
    $('#' + id).parents('.form-inp').removeClass('form-error');
    $('#' + id).parents('.form-inp').children('.errorMessage').html('');
  }
}
export class CardInfo {
  id: number; // 本条信息ID
  buildingName:string; // 大楼名称
  buildingId:string; // 大楼ID
  useUserId: string;// 员工编号
  useUserName:string; // 员工姓名
  useUserDept: string; // 员工部门
  useUserTel:string; // 电话
  eTime:string; // 有效期开始日期
  bTime: string; // 有效期截止日期
  modifyTime:string; // 发放日期
  useCarCode: string; // 车牌号
  status: string; // 状态
  name:string;// 停车证名称x
  code: string; // 停车证编码
  type: string; // 停车证类型
  note:string; // 备注

}
