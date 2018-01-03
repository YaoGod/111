import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Welfare, Other, TargetList} from '../../../../mode/welfare/welfare.service';
import { GlobalCatalogService } from '../../../../service/global-catalog/global-catalog.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import { WelfareEmployeeService } from '../../../../service/welfare-employee/welfare-employee.service';
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
declare var confirmFunc:any;
declare var $: any;
@Component({
  selector: 'app-staff-welfare-mang',
  templateUrl: './staff-welfare-mang.component.html',
  styleUrls: ['./staff-welfare-mang.component.css']
})
export class StaffWelfareMangComponent implements OnInit {

  public pageNo = 1;           /*当前页码*/
  public pageSize = 5;         /*显示页数*/
  public total = 0;
  public  welfares: Array<Welfare>;
  public  copyWelfare: Welfare;
  public  tempOther: Array<any>;
  public  tempFeedbackMsg: Array<any>;
  public  search: string;      /*搜索字段*/
  public  targets: Array<any>;
  public  winTitle: string;
  constructor(
    private router: Router,
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private welfareEmployeeService:WelfareEmployeeService,
    public  ipSetting:IpSettingService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("员工服务/福利专区/福利信息管理");
    this.welfares = new Array<Welfare>();
    this.copyWelfare = new Welfare();
    this.copyWelfare.targetId = new TargetList();
    this.search = "";
    this.targets = [];
    this.getWelfare(1);
    this.getTargetIdList();
    this.winTitle = "";
  }
  getWelfare(pageNo) {
    this.pageNo = pageNo;
    this.welfareEmployeeService.getWelfareList(this.search,pageNo,this.pageSize)
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          this.welfares = data.data.infos;
          this.total =data.data.total;
        }
      });
  }
  getTargetIdList(){
    this.welfareEmployeeService.getTargetIdList()
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          this.targets = data.data;
        }
      });
  }
  fadeBom(){
    this.copyWelfare.others = new Array<Other>();
    this.copyWelfare.targetId = new TargetList();
    this.copyWelfare.targetId.role = [];
    this.copyWelfare.targetId.HRMIS = "";
    this.tempOther = [];
    this.tempFeedbackMsg = [];
    this.winTitle = "新增";
    $('.mask').show();
  }
  closeMask(){
    $('.mask').hide();
    $('#prese').val('');
    $('.form-control').removeClass('red');
    $('.dropify-wrapper').removeClass('red');
    $('.error').fadeOut();
    this.copyWelfare = new Welfare();
    this.copyWelfare.targetId = new TargetList();
    this.copyWelfare.targetId.role = [];
    this.copyWelfare.targetId.HRMIS = "";
    $('#press').val('');
    $('#pressFile').val('');
    this.tempOther = [];
  }
  /*文件图片上传*/
  prese_upload(files,index){
    var xhr = this.welfareEmployeeService.uploadImg(files[0],-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorResponseService.errorMsg(data)){
          this.copyWelfare.imgPath = data.msg;
        }
      }else if(xhr.readyState === 4 && xhr.status === 413 ){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '图片大小超出限制',
          'popType': 1 ,
          'imgType': 2 ,
        });
      }
    };
  }
  /*添加自定义字段*/
  addLine(){
    let length = 0;
    for(let i = 0;i<this.tempOther.length;i++){
      if(this.tempOther[i].isShow){
        length++;
      }
    }
    if(length<5){
      let object = {isShow: true,key:"",type:"文本",list:"",value:""};
      this.tempOther.push(object);
    }
  }
  delLine(index){
    this.tempOther[index].isShow = false;
    let length = 0;
    for(let i = 0;i<this.tempOther.length;i++){
      if(this.tempOther[i].isShow){
        length++;
      }
    }
    if(length === 0){
      this.tempOther = [];
    }
  }
  /*添加反馈字段*/
  addFeedbackLine(){
    let length = 0;
    for(let i = 0;i<this.tempFeedbackMsg.length;i++){
      if(this.tempFeedbackMsg[i].isShow){
        length++;
      }
    }
    if(length<5){
      let object = {isShow: true,key:"",type:"下拉框",list:"",msg:"",value:""};
      this.tempFeedbackMsg.push(object);
    }
  }
  /*删除临时反馈字段*/
  delFeedbackLine(index){
    this.tempFeedbackMsg[index].isShow = false;
  }
  /*打开反馈信息*/
  openFeedback(){
    this.copyWelfare.feedBack = "是";
    $('#feedbackModal').show();
  }
  /*关闭反馈弹窗*/
  closeFeedback(){
    let error = 0;
    let j= 0;
    this.copyWelfare.feedBackMsg = [];
    for (let i = 0; i < this.tempFeedbackMsg.length; i++) {
      if(this.tempFeedbackMsg[i].key === ""){
        this.tempFeedbackMsg[i].isShow = false;
      }
      if (this.tempFeedbackMsg[i].isShow &&this.tempFeedbackMsg[i].key!==""){
        if(this.tempFeedbackMsg[i].type==="下拉框"&&this.tempFeedbackMsg[i].list === ""){
          console.log(this.tempFeedbackMsg[i]);
          error ++;
          confirmFunc.init({
            'title': '提示',
            'mes': '请填写'+this.tempFeedbackMsg[i].key+'的枚举值（用|隔开）',
            'popType': 0,
            'imgType': 2,
          });
          break;
        }else{
          this.copyWelfare.feedBackMsg[j] = new Other();
          this.copyWelfare.feedBackMsg[j].key = this.tempFeedbackMsg[i].key;
          this.copyWelfare.feedBackMsg[j].type = this.tempFeedbackMsg[i].type;
          this.copyWelfare.feedBackMsg[j].list = this.tempFeedbackMsg[i].list;
          this.copyWelfare.feedBackMsg[j].msg = this.tempFeedbackMsg[i].msg;
          j++;
        }
      }
    }
    if(this.copyWelfare.feedBackMsg.length===0&&error===0) {
      error++;
      confirmFunc.init({
        'title': '提示',
        'mes': '请填写需反馈信息！',
        'popType': 0,
        'imgType': 2,
      });
    }
    if(error===0){
        $('#feedbackModal').fadeOut();
    }
  }
  submit(){
    console.log(this.copyWelfare.targetId);
    let error = 0;
    this.verifyImgPath();
    this.verifyEmpty(this.copyWelfare.title,'title');
    this.verifyEmpty(this.copyWelfare.content,'content');
    this.verifyTragetId(this.copyWelfare.targetId,'targetId');
    let j = 0;
    this.copyWelfare.others = [];
    for (let i = 0; i < this.tempOther.length; i++) {
      if (this.tempOther[i].isShow &&this.tempOther[i].key!==""){
        if(this.tempOther[i].value===""){
          error++;
          confirmFunc.init({
            'title': '提示',
            'mes': '请填写模板内容！',
            'popType': 0,
            'imgType': 2,
          });
          break;
        }else{
          this.copyWelfare.others[j] = new Other();
          this.copyWelfare.others[j].key = this.tempOther[i].key;
          this.copyWelfare.others[j].value = this.tempOther[i].value;
          j++;
        }
      }
    }
    if(this.verifyEmpty(this.copyWelfare.feedBack,'feedback2')&&this.copyWelfare.feedBack === "是"){
      if(!this.verifyEmptyArray(this.copyWelfare.feedBackMsg,'feedback2')){
        $('#feedbackModal').show();
      }
    }
    this.verifyEmpty(this.copyWelfare.status,'status2');
    if($('.red').length === 0 && error === 0) {
      let postdata = JSON.parse(JSON.stringify(this.copyWelfare));
      if(typeof (postdata.id) === "undefined" || postdata.id === null) {
        this.welfareEmployeeService.addWelfare(postdata)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                "callback": () => {
                  this.closeMask();
                  this.getWelfare(1);
                },
                "cancel": () => {
                  this.closeMask();
                  this.getWelfare(1);
                }
              });
            }
          });
      }else{
        this.welfareEmployeeService.updateWelfare(postdata)
          .subscribe(data => {

            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                "callback": () => {
                  this.closeMask();
                  this.getWelfare(1);
                },
                "cancel": () => {
                  this.closeMask();
                  this.getWelfare(1);
                }
              });
            }
          });
      }
    }
  }
  /*编辑*/
  edit(data){
    this.fadeBom();
    this.copyWelfare = JSON.parse(JSON.stringify(data));
    this.winTitle = "编辑";
    this.tempOther = JSON.parse(JSON.stringify(data.others));
    for(let i = 0;i< this.tempOther.length;i++){
      this.tempOther[i].isShow = true;
    }
    this.tempFeedbackMsg = JSON.parse(JSON.stringify(data.feedBackMsg));
    for(let i = 0;i< this.tempFeedbackMsg.length;i++){
      this.tempFeedbackMsg[i].isShow = true;
    }
  }
  /*删除*/
  delete(id:number){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除改条数据？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        this.welfareEmployeeService.deleteWelfare(id)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                "callback": () => {
                  this.getWelfare(1);
                },
                "cancel": () => {
                  this.getWelfare(1);
                }
              });
            }
          });
      }
    });
  }
  linkDetail(id){
    this.router.navigate(['/hzportal/employ/welfare/staffWelfare/detail',id]);
  }
  linkStatistics(id){
    this.router.navigate(['/hzportal/employ/welfare/staffWelfare/statistics',id]);
  }
  verifyImgPath(){
    if(typeof (this.copyWelfare.imgPath) === "undefined" ||
      this.copyWelfare.imgPath === null ||
      this.copyWelfare.imgPath === ''){
      this.addErrorClass('newImgPath','请上传图片');
      return false;
    }else{
      this.removeErrorClass('newImgPath');
      return true;
    }
  }
  /*数组非空验证*/
  verifyEmptyArray( value, id){
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id,'该值不能为空');
      return false;
    }if(value.length === 0){
      this.addErrorClass(id,'请选择');
      return false;
    }else{
      this.removeErrorClass(id);
      return true;
    }
  }
  /*非空验证*/
  verifyEmpty( value, id){
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id,'该值不能为空');
      return false;
    }else{
      this.removeErrorClass(id);
      return true;
    }
  }
  /* 添加错误信息*/
  private addErrorClass(id: string, error: string)  {
    $('#' + id).addClass('red');
    $('#' + id).parent().next('.error').fadeIn().html(error);
  }
  /*去除错误信息*/
  private  removeErrorClass(id: string) {
    $('#' + id).removeClass('red');
    $('#' + id).parent().next('.error').fadeOut();
  }
  /*模板导出方法*/
  exportMode(){
    this.welfareEmployeeService.exportTemplate();
  }
  /*享受对象导入*/
  importFile(files){
    var xhr =   this.welfareEmployeeService.importTemplate(files[0])
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorResponseService.errorMsg(data)){
          this.copyWelfare.targetId.HRMIS = data.msg;
          $('#pressFile').val('');
          confirmFunc.init({
            'title': '提示' ,
            'mes': '人员导入成功',
            'popType': 0 ,
            'imgType': 1 ,
          });
        }
      }else if(xhr.readyState === 4 && xhr.status === 413 ){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件大小超出限制',
          'popType': 0 ,
          'imgType': 2 ,
        });
      }
    };
  }
  verifyTragetId(targetId,id){
    if(typeof (targetId.HRMIS) === "undefined"||targetId.HRMIS === ""){
      return this.verifyEmptyArray(targetId.role,id);
    }else{
      return this.verifyEmpty(targetId.HRMIS,id);
    }
  }
}
