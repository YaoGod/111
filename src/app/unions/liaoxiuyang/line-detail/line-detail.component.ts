import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";

@Component({
  selector: 'app-line-detail',
  templateUrl: './line-detail.component.html',
  styleUrls: ['./line-detail.component.css']
})
export class LineDetailComponent implements OnInit {
  public copyVote  : Vote;
  public hotel  = [];
  constructor(
    private router: Router,
    private route    : ActivatedRoute,
    public ipSetting  : IpSettingService,
    private errorResponseService:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.copyVote = new Vote();
    this.route.params.subscribe(data => {
      this.getVoteInfo(data.id);
    });
  }
  /*获取编辑信息*/
  getVoteInfo(id){
    let url = '/soclaty/tourline/getTourLineInfo/'+id;
    this.ipSetting.sendGet(url).subscribe(data=>{
      if(this.errorResponseService.errorMsg(data)){
        this.copyVote = data.data;
        this.hotel = this.copyVote.hotel;
      }
    });
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
  fileContract :any;
}
export class Option{
  title      : string;
  text       : string;
}
