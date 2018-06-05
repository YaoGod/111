import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {CardInfo} from "../dangwei-list/dangwei-list.component";

@Component({
  selector: 'app-dangwei-detail',
  templateUrl: './dangwei-detail.component.html',
  styleUrls: ['./dangwei-detail.component.css']
})
export class DangweiDetailComponent implements OnInit {
  public ID:string;
  public eTime:string;
  public newCard:  CardInfo;
  public history:any;
  constructor(
    public ipSetting:IpSettingService,
    private route: ActivatedRoute,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("党建管理/党委委员调研党支部信息");
    this.newCard = new CardInfo();
    this.newCard.fileName = [];
    this.newCard.filePath = [];
    this.route.params.subscribe(data => {
      this.getWelfare(data.id);
    });
  }
  /*获取当前id的会议内容*/
  getWelfare(id){
    this.ipSetting.sendGet("/party/report/detail/"+id)
      .subscribe(data=>{
        if(this.errorVoid.errorMsg(data)) {
          this.newCard = data.data;
          this.newCard.fileName = [];
          this.newCard.filePath = [];
          for(let i = 0;i<this.newCard.fileContract.length;i++){
            this.newCard.filePath.push(this.newCard.fileContract[i].filePath);
            this.newCard.fileName.push(this.newCard.fileContract[i].fileName);
          }
        }
      })
  }

}

