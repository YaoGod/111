import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-liaoxiuyang-line',
  templateUrl: './liaoxiuyang-line.component.html',
  styleUrls: ['./liaoxiuyang-line.component.css']
})
export class LiaoxiuyangLineComponent implements OnInit {

  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public searchInfo:Option;
  public record:any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private errorResponseService:ErrorResponseService,
    public ipSetting:IpSettingService
  ) { }

  ngOnInit() {
    this.searchInfo = new Option();
    this.searchInfoList(1);
  }
  searchInfoList(number){
    let url = "/soclaty/tourline/getTourLineList/"+number+"/"+this.pageSize;
    this.ipSetting.sendPost(url,this.searchInfo).subscribe(data => {
      if(this.errorResponseService.errorMsg(data)) {
        this.record = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  grounding(id){
    let url = '/soclaty/tourline/updateTourLineStatus';
    let inner = '';
    for(let i=0;i<this.record.length;i++){
      if(this.record[i].id === id){
        inner = this.record[i].status;
      }
    }
    let postData = {
      id:id,
      status : inner==="上架"?"sitdown":"going",
    };
    this.ipSetting.sendPost(url,postData).subscribe(data => {
      if(this.errorResponseService.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': data.msg,
          'popType': 0 ,
          'imgType': 1,
        });
        this.searchInfoList(this.pageNo);
      }
    });
  }
  /*删除路线*/
  delete(id){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除该条投票信息?',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        let url = "/soclaty/tourline/deleteTourLine/"+id;
        this.ipSetting.sendGet(url).subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
              });
              this.searchInfoList(1);
            }
          });
      }
    })
  }
}
export class Option{
  name      : string;
}
