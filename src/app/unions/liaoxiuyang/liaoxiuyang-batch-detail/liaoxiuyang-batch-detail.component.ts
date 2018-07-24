import { Component, OnInit } from '@angular/core';
import {Batch} from "../liaoxiuyang-batch/liaoxiuyang-batch.component";
import {ActivatedRoute} from "@angular/router";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-liaoxiuyang-batch-detail',
  templateUrl: './liaoxiuyang-batch-detail.component.html',
  styleUrls: ['./liaoxiuyang-batch-detail.component.css']
})
export class LiaoxiuyangBatchDetailComponent implements OnInit {

  public rule: any;
  public batch:Batch;
  public people: Array<Person>;
  public newPerson: Person;
  constructor(
    private route    : ActivatedRoute,
    private globalCatalogService:GlobalCatalogService,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("工会管理/疗休养/批次信息");
    this.rule = null;
    this.batch = new Batch();
    this.people = [];
    this.newPerson = new Person();
    this.getRule();
    this.route.params.subscribe(data => {
      this.getBatchInfo(data.id);
      this.getBatchPersonInfo(data.id);
    });
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'unions','unions/liaoxiuyang/group')
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)){
          if(data.data.length>0){
            this.rule = data.data[0];
          }
        }
      })
  }
  getBatchInfo(id){
    let url = "/soclaty/tourbatch/getTourBatchInfo/"+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.batch = data.data;
        this.batch.lineName = this.batch.tourLine.name;
      }
    });
  }
  getBatchPersonInfo(id){
    let url = "/soclaty/tourbatch/getTourBatchPerson/"+id+"?userId=";
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.people = data.data;
      }
    });
  }
  getUserInfo(id){
    let url = "/soclaty/tourenroll/getUserInfo/"+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(data.status === 0){
        this.newPerson.name = data.data.username;
        this.newPerson.deptId = data.data.deptId;
        this.newPerson.deptName = data.data.deptName;
        this.newPerson.telNum = data.data.teleNum;
        this.newPerson.sex = data.data.sex;
      }
    });
  }
  /*打开新建窗口*/
  addNewPerson(){
    this.newPerson = new Person();
    this.newPerson.type = "Y";
    this.newPerson.sex = "男";
    this.newPerson.tourEnrolls = [];
    $('#youke').fadeIn();
    $('#youke .mask-head>p').html("新增人员信息");
  }
  /*编辑人员信息*/
  editPerson(person:Person,type){
    this.addNewPerson();
    $('#youke .mask-head>p').html("编辑人员信息");
    this.newPerson = JSON.parse(JSON.stringify(person));
    this.newPerson.type = type;
  }
  resetPerson(){
    let temp = this.newPerson.type;
    this.newPerson = new Person();
    this.newPerson.type = temp;
    this.newPerson.sex = "男";
    $('.errorMessage').html('');
  }
  setChildDept(){
    for(let i=0;i<this.people.length;i++){
      if(this.newPerson.fatherId === this.people[i].id){
        this.newPerson.deptName = this.people[i].deptName;
      }
    }
  }
  submit(){
    let url;
    if(this.newPerson.id){
      url = "/soclaty/tourenroll/updateTourEnroll";
    }else{
      url = "/soclaty/tourenroll/addTourEnroll";
    }
    this.newPerson.tourEnrolls = [];
    let postData = JSON.parse(JSON.stringify(this.newPerson));
    postData.lineId = this.batch.lineId;
    postData.batchId = this.batch.id;
    this.ipSetting.sendPost(url, postData)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          confirmFunc.init({
            'title': '提示' ,
            'mes': data.msg,
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.getBatchInfo(this.batch.id);
          this.getBatchPersonInfo(this.batch.id);
          this.addCancel();
        }
      });
  }
  /*取消*/
  addCancel(){
    $('.mask').fadeOut();
    $('.errorMessage').html('');
  }
  deletePersonInfo(id){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除该人员信息？',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        let url = "/soclaty/tourenroll/deleteTourEnroll/" + id;
        this.ipSetting.sendGet(url).subscribe(data => {
          if (this.errorVoid.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示' ,
              'mes': data.msg,
              'popType': 0 ,
              'imgType': 1 ,
            });
            this.getBatchInfo(this.batch.id);
            this.getBatchPersonInfo(this.batch.id);
          }
        });
      }
    });
  }
  /*成团*/
  groupPerson(){
    if(this.batch.realNum>=this.batch.minNum){
      confirmFunc.init({
        'title': '提示',
        'mes': "当前报名人数"+this.batch.realNum+"人，是否确认成团？",
        'popType': 1,
        'imgType': 3,
        'callback': () => {
          let url = "/soclaty/tourbatch/updateTourBatchStatus";
          let postData = JSON.parse(JSON.stringify(this.batch));
          postData.status = "pass";
          this.ipSetting.sendPost(url,postData).subscribe(data => {
            if (this.errorVoid.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示' ,
                'mes': data.msg,
                'popType': 0 ,
                'imgType': 1 ,
              });
              this.getBatchInfo(this.batch.id);
              this.getBatchPersonInfo(this.batch.id);
            }
          });
        }
      });
    }
    else{
      confirmFunc.init({
        'title': '提示' ,
        'mes': "当前报名人数"+this.batch.realNum+"人，未达到成团条件"+this.batch.minNum+"人",
        'popType': 0 ,
        'imgType': 2 ,
      });
    }
  }
  exportPersonInfo(){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否导出所有参团人员信息？',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        let url = this.ipSetting.ip+"/soclaty/tourbatch/getTourBatchPersonExcel/"+this.batch.id;
        window.location.href = url;
      }
    });
  }
  /**验证手机号码   */
  public verifyIsTel(id: string): boolean {
    const data =  $('#' + id).val();
    if(this.verifyEmpty(id)){
      if (!String(data).match( /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/ )){
        this.addErrorClass(id, "格式不符");
        return false;
      }else {
        this.removeErrorClass(id);
        return true;
      }
    }

  }
  /** 验证身份证号码  */
  public verifyIsCard(id: string): boolean {
    const data =  $('#' + id).val();
    if(this.verifyEmpty(id)) {
      if (!String(data).match(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/)) {
        this.addErrorClass(id, '格式不符');
        return false;
      } else {
        this.removeErrorClass(id);
        return true;
      }
    }
  }
  public verifyEmpty(id){
    if (!this.isEmpty(id, '不能为空')) {
      return false;
    }
    return true;
  }
  /**非空校验*/
  public isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if(typeof (data)==="undefined"|| data === null){
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
  /** 添加错误信息class */
  public  addErrorClass(id: string, error?: string){
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
export class Person{
  lineId: string;
  batchId: string;
  id: string;
  name: string;
  type: string;
  fatherId: string;
  hrmis: string;
  deptName: string;
  deptId: string;
  age:string;
  sex: string;
  telNum: string;
  idcard: string;
  post: string;
  date: string;
  note: string;
  tourEnrolls: Array<Person>;
  createTime: string;
}
