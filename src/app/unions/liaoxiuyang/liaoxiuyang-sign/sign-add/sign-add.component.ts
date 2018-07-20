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
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private errorResponseService:ErrorResponseService,
    public ipSetting:IpSettingService,
    private utilBuildingService:UtilBuildingService,
  ) { }

  ngOnInit() {
    this.copyVote = new Vote();
    this.copyVote.content = [];
    this.copyVote.content[0] = new Option();
    this.copyVote.content[0].text = "";
    this.copyVote.status = "";
    this.hotel  = [''];
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
  /*获取编辑信息*/
  getVoteInfo(id){
    let url = '/soclaty/tourbatch/getTourBatchInfo/'+id;
    this.ipSetting.sendGet(url).subscribe(data=>{
      if(this.errorResponseService.errorMsg(data)){
        this.copyVote = data.data;
        this.hotel = this.copyVote.hotel;
        this.lineName = data.data.tourLine.name;
      }
    })
  }
  /*添加选项*/
  addNewOption(){
    this.copyVote.content.push(new Option());
    this.copyVote.content[this.copyVote.content.length-1].text = "";
  }
  /*删除行程*/
  delOption(index){
    let temp = [];
    for(let i = 0;i<this.copyVote.content.length;i++){
      if(i!== index){
        temp.push(this.copyVote.content[i]);
      }
    }
    this.copyVote.content = temp;
  }
  addHotel(){
    this.hotel.push('');
  }
  /*删除酒店*/
  delHotel(index){
    let temp = [];
    for(let i = 0;i<this.hotel.length;i++){
      if(i!== index){
        temp.push(this.hotel[i]);
      }
    }
    this.hotel = temp;
  }
  /*删除附件*/
  delFile(index) {
    this.copyVote.filePath.splice(index,1);
    this.copyVote.fileName.splice(index,1);
  }
  /*附件上传*/
  prese_upload(files) {
    var xhr = this.utilBuildingService.uploadFileTourLine(files[0],'tourLine',-1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorResponseService.errorMsg(data)){
          this.copyVote.fileName.push(files[0].name);
          this.copyVote.filePath.push(data.data);
          confirmFunc.init({
            'title': '提示' ,
            'mes': '上传成功',
            'popType': 0 ,
            'imgType': 1,
          });
          $('#prese').val('');
        }
      }else if (xhr.readyState === 4 && xhr.status === 413){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件太大',
          'popType': 0 ,
          'imgType': 2,
        });
        $('#prese').val('');
      }
    };
  }
  /*提交*/
  submit(){
    this.verifyEmpty(this.copyVote.name,'name');
    this.verifyEmpty(this.copyVote.code,'code');
    this.verifyEmpty(this.copyVote.travel,'travel');
    this.verifyEmpty(this.copyVote.explain,'explain');
    this.verifyEmpty(this.copyVote.price,'price');
    this.verifyEmpty(this.copyVote.minNum,'minNum');
    this.verifyEmpty(this.copyVote.priceForm,'priceForm');
    //  this.verifyEmpty(this.copyVote.content,'content');

    if($('.red').length === 0) {
      let postdata = JSON.parse(JSON.stringify(this.copyVote));
      let list = document.getElementsByClassName("hotel");
      this.hotelSub = [];
      for(let i = 0;i<list.length;i++){
        this.hotelSub.push(list[i]['value']);
      }
      postdata.hotel = this.hotelSub;
      if(typeof (postdata.id) === "undefined" || postdata.id === null) {
        let url = '/soclaty/tourline/addTourLine';
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
      }else{
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
      }
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
  name       : string;  // 线路名称
  code       : string;  // 线路编号
  content    : Array<Option>;  // 行程
  travel     : string;  // 旅行社
  dayNum     : string;  // 天数
  status     : string;  //
  hotel      = [];  // 入住酒店
  minNum     : string;  // 人数下限
  maxNum     : string;  // 人数上限
  price      : number;  // 价格
  priceForm  : string;  // 价格组成
  options    : Array<string>;
  explain    : string;  // 服务标准
  note       : string;  // 备注
  filePath    = [];
  fileName    = [];
}

export class Option{
  title      : string;
  text       : string;
}
