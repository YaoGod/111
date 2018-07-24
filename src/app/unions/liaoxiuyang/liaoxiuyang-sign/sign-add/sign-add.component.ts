import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {UtilBuildingService} from "../../../../service/util-building/util-building.service";
import {animate, keyframes, state, style, transition, trigger} from "@angular/animations";
declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-sign-add',
  templateUrl: './sign-add.component.html',
  styleUrls: ['./sign-add.component.css'],
  providers:[UtilBuildingService],
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
export class SignAddComponent implements OnInit {
  public copyVote  : Vote;
  public hotel  = [];
  public hotelSub  = [];
  public user;
  public lineName:string;
  public hrmis = localStorage.getItem("username");
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private errorResponseService:ErrorResponseService,
    public ipSetting:IpSettingService,
    private utilBuildingService:UtilBuildingService,
  ) { }

  ngOnInit() {
    this.copyVote = new Vote();
    this.copyVote.hrmis = localStorage.getItem("username");
    this.copyVote.tourEnrolls = [];
    this.copyVote.isFamily = '否';
    this.copyVote.tourEnrolls[0] = new Option();
    this.copyVote.tourEnrolls[0].name = "";
    this.copyVote.tourEnrolls[0].idcard = "";
    this.copyVote.tourEnrolls[0].sex = "";
    this.copyVote.tourEnrolls[0].age = "";
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
    this.getUserName(this.copyVote.hrmis);
  }
  /*获取编辑信息*/
  getVoteInfo(id){
    let url = '/soclaty/tourbatch/getTourBatchInfo/'+id;
    this.ipSetting.sendGet(url).subscribe(data=>{
      if(this.errorResponseService.errorMsg(data)){
        this.copyVote.batchId = data.data.id;
        this.copyVote.lineId = data.data.lineId;
        this.lineName = data.data.tourLine.name;

      }
    })
  }
  /*根据员工号获取信息*/
  getUserName(value) {
      let url = "/portal/user/getUserInfo/" + value;
      this.ipSetting.sendGet(url).subscribe(data => {
        if (this.errorResponseService.errorMsg(data)) {
          this.copyVote.deptId = data.data.deptId;
          this.copyVote.sex = data.data.sex;
          this.copyVote.telNum = data.data.teleNum;
          this.copyVote.name = data.data.username;
        }
      });
  }
  /*添加家属信息*/
  addNewOption(){
    this.copyVote.tourEnrolls.push(new Option());
    this.copyVote.tourEnrolls[this.copyVote.tourEnrolls.length-1].name = "";
    this.copyVote.tourEnrolls[this.copyVote.tourEnrolls.length-1].idcard = "";
    this.copyVote.tourEnrolls[this.copyVote.tourEnrolls.length-1].sex = "";
    this.copyVote.tourEnrolls[this.copyVote.tourEnrolls.length-1].age = "";
  }
  /*删除家属信息*/
  delOption(index){
    let temp = [];
    for(let i = 0;i<this.copyVote.tourEnrolls.length;i++){
      if(i!== index){
        temp.push(this.copyVote.tourEnrolls[i]);
      }
    }
    this.copyVote.tourEnrolls = temp;
  }
  /*切换携带家属*/
  changePer(value){
    if(value === '是'){
      this.copyVote.tourEnrolls = [];
      this.copyVote.tourEnrolls[0] = new Option();
      this.copyVote.tourEnrolls[0].name = "";
      this.copyVote.tourEnrolls[0].idcard = "";
      this.copyVote.tourEnrolls[0].sex = "";
      this.copyVote.tourEnrolls[0].age = "";
    }else if(value === '否'){
      this.copyVote.tourEnrolls = [];
      this.copyVote.tourEnrolls[0] = new Option();
    }
  }
  /*删除附件*/
  /*delFile(index) {
    this.copyVote.filePath.splice(index,1);
    this.copyVote.fileName.splice(index,1);
  }*/

  /*提交*/
  submit(){
    this.verifyEmpty(this.copyVote.name,'name');
    this.verifyEmpty(this.copyVote.post,'post');
    this.verifyEmpty(this.copyVote.idcard,'idcard');
     /*this.verifyEmpty(this.copyVote.price,'price');
    this.verifyEmpty(this.copyVote.minNum,'minNum');
    this.verifyEmpty(this.copyVote.priceForm,'priceForm');*/
    //  this.verifyEmpty(this.copyVote.content,'content');

    if($('.red').length === 0) {
      let postdata = JSON.parse(JSON.stringify(this.copyVote));
      let list = document.getElementsByClassName("hotel");
      this.hotelSub = [];
      for(let i = 0;i<list.length;i++){
        this.hotelSub.push(list[i]['value']);
      }
      if(postdata.isFamily==='是'){
        for(let i = 0;i<postdata.length;i++){
          if(postdata[i].name===''||postdata[i].sex===''||postdata[i].age===''||postdata[i].idcard===''){
            confirmFunc.init({
              'title': '提示',
              'mes': '要携带家属,则家属信息不能为空',
              'popType': 0,
              'imgType': 2
            });
            return false;
          }
        }
      }
      // if(typeof (postdata.id) === "undefined" || postdata.id === null) {
        let url = '/soclaty/tourenroll/addTourEnroll';
        this.ipSetting.sendPost(url,postdata).subscribe(data => {
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
      /*}else{
        let url = '/soclaty/tourline/updateTourLine';
        this.ipSetting.sendPost(url,postdata).subscribe(data => {
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
      }*/
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
}
export class Vote {

  id         : number;
  name       : string;  // 姓名
  hrmis      : string;  // HRMIS号
  idcard     : string;  // 身份证号
  age        : string;  // 年龄
  deptId     : string;  // 部门
  post       : string;  // 岗位
  isFamily   : string;  // 是否带家属
  batchId    : string;  // 批次号ID
  checkId    : string;  //
  tourEnrolls: Array<Option>;  // 家属信息
  telNum     : string;  // 电话
  sex        : string;  // 性别
  personNum  : string;  // 家属人数
  lineId     : string;  // 线路ID
  maxNum     : string;  // 人数上限
  note       : string;  // 备注
}

export class Option{
  name      : string;
  idcard    : string;
  sex       : string;
  age       : string;
  fatherId  : string;
}
