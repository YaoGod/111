import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";

@Component({
  selector: 'app-liaoxiuyang-approve',
  templateUrl: './liaoxiuyang-approve.component.html',
  styleUrls: ['./liaoxiuyang-approve.component.css']
})
export class LiaoxiuyangApproveComponent implements OnInit {

  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public searchInfo:any;
  public orders:any;
  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
  ) { }

  ngOnInit() {
    this.searchInfoList();
  }
  searchInfoList(){
    let url = '/soclaty/tourenroll/getPendingCheck';
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        // this.batches = data.data.infos;
        console.log(data.data);
      }
    });
  }

}
