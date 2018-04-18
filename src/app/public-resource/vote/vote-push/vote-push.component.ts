import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import {Vote,Option} from "../../../mode/vote/vote.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {Department} from "../../../employ/share/share-new-product/share-new-product.component";
import {PublicresourceVoteService} from "../../../service/publicresource-vote/publicresource-vote.service";
import {GlobalUserService} from "../../../service/global-user/global-user.service";
import {Params, Router, ActivatedRoute} from "@angular/router";
import 'rxjs/add/operator/switchMap';
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-vote-push',
  templateUrl: './vote-push.component.html',
  styleUrls: ['./vote-push.component.css'],
  animations: [
    trigger('diamond', [
      state('upper', style({
        height: 0,
        opacity: 0
      })),
      state('lower', style({
        height: 76,
        opacity: 1
      })),
      state('none', style({
        transform: 'translate3d(300%,0,0)',
        opacity: 0
      })),
      state('show',style({
        transform:'translate3d(0,0,0)',
        opacity: 1
      })),
      state('active',style({
        opacity: 1
      })),
      transition('lower => upper', animate('500ms ease-in', keyframes([
        style({ transform: 'translate3d(300%,0,0)' })
      ]))),
      transition('upper => lower', animate('500ms ease-in')),
      transition('none <=> show', animate('500ms')),
      transition('* => active', animate('500ms', keyframes([
        style({opacity: 0, transform: 'translateY(-20%)', offset: 0}),
        style({opacity: 1, transform: 'translateY(15px)',  offset: 0.3}),
        style({opacity: 1, transform: 'translateY(0)',     offset: 1.0})
      ]))),
      transition('active => *', animate('500ms', keyframes([
        style({ transform: 'translate3d(300%,0,0)' })
      ])))
    ])
  ]
})
export class VotePushComponent implements OnInit {

  public copyVote  : Vote;
  public deptList  : Array<Department>;
  public isMyDept  : boolean;
  public isAllDept : boolean;
  public user;
  constructor(
    private publicresourceVoteService:PublicresourceVoteService,
    private errorResponseService:ErrorResponseService,
    private globalUserService: GlobalUserService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.copyVote = new Vote();
    this.copyVote.title = "";
    this.copyVote.content = "";
    this.copyVote.targetId = [];
    this.copyVote.targetName = [];
    this.copyVote.options = [];
    this.copyVote.options[0] = new Option();
    this.copyVote.options[0].imgPath = "";
    this.copyVote.options[0].imgContent = "";
    this.copyVote.options[0].title = "";
    this.copyVote.options[0].content = "";
    this.copyVote.status = "";
    this.getDeptList();
    this.user =this.globalUserService.getVal();
    if(typeof (this.route.params['_value']['id']) !== "undefined"){
      let tempid = 0;
      this.route.params
        .switchMap((params: Params) => this.copyVote.id  = params['id'])
        .subscribe(() => {
          if (tempid === 0) {
            this.getVoteInfo(this.copyVote.id);
            tempid++;
          }
        });
    }
  }
  /*获取投票信息*/
  getVoteInfo(id){
    this.publicresourceVoteService.getVoteInfo(id)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.copyVote = data.data;
          if(this.copyVote.type === "double"){
            if(this.copyVote.maxResult>this.copyVote.minResult){
              this.copyVote.resultType = "range";
            }else{
              this.copyVote.resultType = "number";
            }
          }
          this.copyVote.targetId = data.data.targetId.split('|').slice(1,-1);
          this.copyVote.targetName = data.data.targetName.split('|').slice(1,-1);
        }
      })
  }
  /*获取所有部门列表*/
  getDeptList(){
    this.publicresourceVoteService.getDeptList()
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          this.deptList = data.data;
          for(let i = 0;i<this.deptList.length;i++){
            this.deptList[i].choose = false;
          }
        }
      });
  }
  /*打开部门选择框*/
  openChooseWin(){
    if(this.copyVote.status!=="release"){
      $('#deptSltWin').show();
      for(let i = 0;i<this.deptList.length;i++){
        this.deptList[i].choose = false;
      }
      for(let i = 0;i<this.deptList.length;i++){
        for(let j = 0 ;j<this.copyVote.targetId.length;j++){
          if(this.deptList[i].DEPT_ID === this.copyVote.targetId[j]){
            this.deptList[i].choose = true;
          }
          if(this.copyVote.targetId[j] === 'all'){
            this.isAllDept = true;
          }
          if(this.copyVote.targetId[j] === this.user.deptId){
            this.isMyDept = true;
          }
        }
      }
    }
  }
  /*选取部门*/
  chooseDept(){
    this.isAllDept = false;
    this.isMyDept = false;
    this.copyVote.targetId = [];
    this.copyVote.targetName = [];
    for(let i = 0;i<this.deptList.length;i++){
      if(this.deptList[i].choose){
        this.copyVote.targetId.push(this.deptList[i].DEPT_ID);
        this.copyVote.targetName.push(this.deptList[i].DEPT_NAME);
      }
    }
    if(this.copyVote.targetId.length === 0){

      this.isAllDept = false;
    }
  }
  /*选择本部门*/
  setMyDept(id){
    for (let i = 0; i < this.deptList.length; i++) {
      this.deptList[i].choose = false;
    }
    this.isAllDept = false;
    this.isMyDept = true;
    this.copyVote.targetId = [id];
    this.copyVote.targetName = ['本部门'];
  }
  /*全选*/
  chooseAll() {
    this.isAllDept = true;
    this.copyVote.targetId = ['all'];
    this.copyVote.targetName = ['全公司'];
    for (let i = 0; i < this.deptList.length; i++) {
      this.deptList[i].choose = false;
    }
    this.isMyDept = false;
  }
  clearResult(){
    this.copyVote.minResult = null;
    this.copyVote.maxResult = null;
    this.removeErrorClass("numberLabel");
    this.removeErrorClass("minRange");
    this.removeErrorClass("maxRange");
  }
  /*文件图片上传*/
  prese_upload(files,index){
    let xhr = this.publicresourceVoteService.uploadImg(files[0],"voteOption");
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorResponseService.errorMsg(data)){
          this.copyVote.options[index].imgPath=data.msg;
          this.copyVote.options[index].imgContent = window.URL.createObjectURL(files[0]);
        }
        $('.dropify').val('');
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
  /*添加选项*/
  addNewOption(){
    this.copyVote.options.push(new Option());
    this.copyVote.options[this.copyVote.options.length-1].imgContent = "";
    this.copyVote.options[this.copyVote.options.length-1].imgPath = "";
    this.copyVote.options[this.copyVote.options.length-1].title = "";
    this.copyVote.options[this.copyVote.options.length-1].content = "";
  }
  /*删除选项*/
  delOption(index){
    let temp = [];
    for(let i = 0;i<this.copyVote.options.length;i++){
      if(i!== index){
        temp.push(this.copyVote.options[i]);
      }
    }
    this.copyVote.options = temp;
  }
  /*提交*/
  submit(){
    this.verifyEmpty(this.copyVote.title,'title');
    if(this.copyVote.title.length>100){
      this.addErrorClass('title','最大输入100个字符');
    }
    this.verifyEmpty(this.copyVote.content,'content');
    if(this.copyVote.title.length>500){
      this.addErrorClass('content','最大输入500个字符');
    }
    this.verifyEmpty(this.copyVote.eTime,'eTime');
    this.verifyEmptyArray(this.copyVote.targetName,'deptName');
    this.verifyEmpty(this.copyVote.type,'double');
    if(this.copyVote.type === 'single'){
      this.copyVote.maxResult = 1;
      this.copyVote.minResult = 1;
    }
    if(this.copyVote.type === 'double'){
      this.verifyEmpty(this.copyVote.resultType,'number');
      this.verifyEmpty(this.copyVote.resultType,'range');
      if(this.copyVote.resultType === 'number'){
        this.verifyEmpty(this.copyVote.maxResult,'numberLabel','请填写指定的个数');
        this.copyVote.minResult = this.copyVote.maxResult;
      }else{
        this.verifyEmpty(this.copyVote.minResult,'minRange','请填写最小选择数');
        this.verifyNumberRange(this.copyVote.minResult,'minRange',1,this.copyVote.maxResult?this.copyVote.maxResult-1:null)
        this.verifyEmpty(this.copyVote.maxResult,'maxRange','请填写最大选择数');
        this.verifyNumberRange(this.copyVote.maxResult,'maxRange',this.copyVote.minResult?this.copyVote.minResult+1:null)
      }
    }
    if($('.red').length === 0) {
      let postdata = JSON.parse(JSON.stringify(this.copyVote));
      for(let i = 0;i<postdata.options.length;i++){
        delete postdata.options[i].imgContent;
      }
      if(typeof (postdata.id) === "undefined" || postdata.id === null) {
        this.publicresourceVoteService.addVoteInfo(postdata)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                "callback": () => {
                  history.go(-1);
                },
                "cancel": () => {
                  history.go(-1);
                }
              });
            }
          });
      }else{
        this.publicresourceVoteService.updateVoteInfo(postdata)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
                "callback": () => {
                  history.go(-1);
                },
                "cancel": () => {
                  history.go(-1);
                }
              });
            }
          });
      }
    }
  }
  /*数字范围判断*/
  verifyNumberRange(value, id?,min?,max?){
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id,'该值不能为空');
      return false;
    }
    else if(typeof (min) !== "undefined" && min !== null && min !== ''&&value < min) {
        this.addErrorClass(id, '该值不能小于' + min);
        return false;
    }
    else if(typeof (max) !== "undefined" && max !== null && max !== ''&&value > max) {
        this.addErrorClass(id, '该值不能大于' + max);
        return false;
    }
    else{
      this.removeErrorClass(id);
      return true;
    }
  }
  /*数组非空验证*/
  verifyEmptyArray( value, id,msg?){
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id,'该值不能为空');
      return false;
    }if(value.length === 0){
      let error = msg?msg:"请选择";
      this.addErrorClass(id,error);
      return false;
    }else{
      this.removeErrorClass(id);
      return true;
    }
  }
  /*非空验证*/
  verifyEmpty( value, id?,msg?){
    let error = msg?msg:'该值不能为空';
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id,error);
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
  /*模板导出*/
  exportModeOut(){
    this.publicresourceVoteService.exportTemplate();
  }
  importDataIn(files){
    let xhr = this.publicresourceVoteService.importData(files[0]);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        let data:any = JSON.parse(xhr.responseText);
        if(this.errorResponseService.errorMsg(data)){
          this.copyVote.targetName = [files[0].name];
          this.copyVote.hrmis = data.msg;
          this.isAllDept = false;
          this.isMyDept = false;
          for (let i = 0; i < this.deptList.length; i++) {
            this.deptList[i].choose = false;
          }
        }
        $('.file-mode').val('');
      }else if(xhr.readyState === 4 && xhr.status === 413 ){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件大小超出限制',
          'popType': 1 ,
          'imgType': 2 ,
        });
      }
    };
  }
}
