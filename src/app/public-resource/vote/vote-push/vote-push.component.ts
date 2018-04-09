import { Component, OnInit } from '@angular/core';
import {Vote,Option} from "../../../mode/vote/vote.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {Department} from "../../../employ/share/share-new-product/share-new-product.component";
import {PublicresourceVoteService} from "../../../service/publicresource-vote/publicresource-vote.service";
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-vote-push',
  templateUrl: './vote-push.component.html',
  styleUrls: ['./vote-push.component.css'],
})
export class VotePushComponent implements OnInit {

  public copyVote : Vote;
  public deptList: Array<Department>;
  public isAllDept:boolean;
  constructor(
    private publicresourceVoteService:PublicresourceVoteService,
    private errorResponseService:ErrorResponseService
  ) { }

  ngOnInit() {
    this.copyVote = new Vote();
    this.copyVote.targetId = [];
    this.copyVote.targetName = [];
    this.copyVote.options = [];
    this.copyVote.options[0] = new Option();
    this.getDeptList();
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
      }
    }
  }
  /*选取部门*/
  chooseDept(){
    this.isAllDept = false;
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
  /*全选*/
  chooseAll() {
    this.isAllDept = true;
    this.copyVote.targetId = ['all'];
    this.copyVote.targetName = ['所有人员'];
    for (let i = 0; i < this.deptList.length; i++) {
      this.deptList[i].choose = false;
    }
  }
  clearResult(){
    this.copyVote.minResult = null;
    this.copyVote.maxResult = null;
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
    this.verifyEmpty(this.copyVote.content,'content');
    this.verifyEmpty(this.copyVote.eTime,'eTime');
    this.verifyEmpty(this.copyVote.targetName,'deptName');
    if(this.copyVote.type === 'single'){
      this.copyVote.maxResult = 1;
      this.copyVote.minResult = 1;
    }
    if(this.copyVote.type === 'double'){
      if(this.copyVote.resultType === 'number'){
        this.copyVote.minResult = this.copyVote.maxResult;
      }
    }
    if($('.red').length === 0) {
      let postdata = JSON.parse(JSON.stringify(this.copyVote));
      if(typeof (postdata.id) === "undefined" || postdata.id === null) {
        console.log(postdata);
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
  /*非空验证*/
  verifyEmpty( value, id?){
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
