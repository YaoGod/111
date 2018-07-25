import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-sign-my',
  templateUrl: './sign-my.component.html',
  styleUrls: ['./sign-my.component.css']
})
export class SignMyComponent implements OnInit {
  public batches:any;
  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.batchSearch();
  }

  /*获取已报名批次*/
  batchSearch(){
    let url = '/soclaty/tourenroll/getMyBatch';
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        this.batches = data.data;
      }
    });
  }
  delete(id){
    let url = '/soclaty/tourenroll/deleteTourEnroll/'+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示',
          'mes': data.msg,
          'popType': 2,
          'imgType': 1,
        });
        this.batchSearch();
      }
    });
  }
}
