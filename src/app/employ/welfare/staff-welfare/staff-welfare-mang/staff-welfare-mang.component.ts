import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Welfare, Other } from '../../../../mode/welfare/Welfare.service';
import { GlobalCatalogService } from '../../../../service/global-catalog/global-catalog.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import { WelfareEmployeeService } from '../../../../service/welfare-employee/welfare-employee.service';
declare var confirmFunc:any;
declare var $: any;
@Component({
  selector: 'app-staff-welfare-mang',
  templateUrl: './staff-welfare-mang.component.html',
  styleUrls: ['./staff-welfare-mang.component.css']
})
export class StaffWelfareMangComponent implements OnInit {

  private pageNo = 1;           /*当前页码*/
  private pageSize = 5;         /*显示页数*/
  public  pages: Array<number>; /*页码*/
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
    private welfareEmployeeService:WelfareEmployeeService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("员工服务/福利专区/福利信息管理");
    this.welfares = new Array<Welfare>();
    this.copyWelfare = new Welfare();
    this.pages = new Array<number>();
    this.search = "";
    this.targets = [];
    this.getWelfare();
    this.winTitle = "";
  }
  getWelfare() {
    this.welfareEmployeeService.getWelfareList(this.search,this.pageNo,this.pageSize)
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          this.welfares = data.data.infos;
          let total = Math.ceil(data.data.total / this.pageSize);
          this.initPage(total);
          this.getTargetIdList();
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
  searchInfo(){
    this.pageNo = 1;
    this.getWelfare();
  }
  fadeBom(){
    this.copyWelfare.others = new Array<Other>();
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
      let object = {isShow: true,key:"",value:""};
      this.tempOther.push(object);
    }
  }
  delLine(index){
    this.tempOther[index].isShow = false;
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
      let object = {isShow: true,key:"",msg:"",value:""};
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
  /*取消反馈*/
  closeFeedback(){
    $('#feedbackModal').fadeOut();
  }
  submit(){
    console.log(this.copyWelfare);
    this.verifyImgPath();
    this.verifyEmpty(this.copyWelfare.title,'title');
    this.verifyEmpty(this.copyWelfare.content,'content');
    this.verifyEmptyArray(this.copyWelfare.targetId,'targetId');
    let j = 0;
    this.copyWelfare.others = [];
    for (let i = 0; i < this.tempOther.length; i++) {
      if (this.tempOther[i].isShow &&this.tempOther[i].key!==""&&this.tempOther[i].value!==""){
        this.copyWelfare.others[j] = new Other();
        this.copyWelfare.others[j].key = this.tempOther[i].key;
        this.copyWelfare.others[j].value = this.tempOther[i].value;
        j++;
      }
    }
    j= 0;
    this.copyWelfare.feedBackMsg = [];
    for (let i = 0; i < this.tempFeedbackMsg.length; i++) {
      if (this.tempFeedbackMsg[i].isShow &&this.tempFeedbackMsg[i].key!==""){
        this.copyWelfare.feedBackMsg[j] = new Other();
        this.copyWelfare.feedBackMsg[j].key = this.tempFeedbackMsg[i].key;
        this.copyWelfare.feedBackMsg[j].msg = this.tempFeedbackMsg[i].msg;
        j++;
      }
    }
    if(this.verifyEmpty(this.copyWelfare.feedBack,'feedback2')&&this.copyWelfare.feedBack === "是"){
      if(!this.verifyEmptyArray(this.copyWelfare.feedBackMsg,'feedback2')){
        $('#feedbackModal').show();
      }
    }
    this.verifyEmpty(this.copyWelfare.status,'status2');
    if($('.red').length === 0) {
      let postdata = JSON.parse(JSON.stringify(this.copyWelfare));
      if(typeof (postdata.id) === "undefined" || postdata.id === null) {
        this.welfareEmployeeService.addWelfare(postdata)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              console.log(111);
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                "callback": () => {
                  this.closeMask();
                  this.pageNo = 1;
                  this.getWelfare();
                },
                "cancle": () => {
                  this.closeMask();
                  this.pageNo = 1;
                  this.getWelfare();
                }
              });
            }
          });
      }else{
        this.welfareEmployeeService.updateWelfare(postdata)
          .subscribe(data => {

            if (this.errorResponseService.errorMsg(data)) {
              console.log(222);
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                "callback": () => {
                  this.closeMask();
                  this.pageNo = 1;
                  this.getWelfare();
                },
                "cancle": () => {
                  this.closeMask();
                  this.pageNo = 1;
                  this.getWelfare();
                }
              });
            }
          });
      }
    }
  }
  /*编辑*/
  edit(data){
    this.copyWelfare = JSON.parse(JSON.stringify(data));
    this.fadeBom();
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
                  this.pageNo = 1;
                  this.getWelfare();
                },
                "cancle": () => {
                  this.pageNo = 1;
                  this.getWelfare();
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
  /*页码初始化*/
  initPage(total){
    this.pages = new Array(total);
    for(let i = 0;i< total ;i++){
      this.pages[i] = i+1;
    }
  }
  /*页面显示区间5页*/
  pageLimit(page:number){
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
  goPage(page:number){
    this.pageNo = page;
    this.getWelfare();
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

}
