import { Component, OnInit } from '@angular/core';
import {GlobalUserService} from "../../service/global-user/global-user.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  public nowTime;
  public userName;
  constructor(
    private globalUserService:GlobalUserService,
  ) {
  }

  ngOnInit() {
    this.userName = this.globalUserService.getVal().username;
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

}
