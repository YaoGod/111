import { Component, OnInit } from '@angular/core';
import {GlobalUserService} from "../../service/global-user/global-user.service";
import {IpSettingService} from "../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  public nowTime;
  public userName;
  public flowNum:number;
  public workNum:number;
  constructor(
    private globalUserService:GlobalUserService,
    public ipSetting:IpSettingService,
    private errorResponseService:ErrorResponseService,
  ) {
  }

  ngOnInit() {
    this.userName = this.globalUserService.getVal().username;
    this.sayHello();
    this.getWorkFlowList();
    this.getHandlingOrder();
  }
  /*打招呼*/
  sayHello(){
    let hour = new Date().getHours();
    if(hour>=5&&hour<=10){
      this.nowTime = "早上";
    }else if(hour>=11&&hour<=13){
      this.nowTime = "中午";
    }else if(hour>=14&&hour<=18){
      this.nowTime = "下午";
    }else if(hour>=19&&hour<=23){
      this.nowTime = "晚上";
    }else if(hour>=24&&hour<=4){
      this.nowTime = "午夜";
    }
  }

  getWorkFlowList(){
    let url = '/workflow/review/getReviewNum';
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorResponseService.errorMsg(data)) {
        this.flowNum = data.data;
      }
    });
  }
  getHandlingOrder(){
    let url = '/employee/mydesk/getHandlingOrder';
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorResponseService.errorMsg(data)) {
        this.workNum = data.data[0].value;
      }
    });
  }

}
