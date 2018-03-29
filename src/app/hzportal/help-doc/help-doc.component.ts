import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "app/service/error-response/error-response.service";
import {IpSettingService} from "../../service/ip-setting/ip-setting.service";
declare var confirmFunc:any;
@Component({
  selector: 'app-help-doc',
  templateUrl: './help-doc.component.html',
  styleUrls: ['./help-doc.component.css'],
  providers: [UserPortalService]
})
export class HelpDocComponent implements OnInit {

  public doc:any;
  public rule:boolean;
  constructor(
    public ipSetting: IpSettingService,
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService: ErrorResponseService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("操作手册");
    this.doc = {
      name:'操作手册.doc',
      url: '',
    };
    this.rule = false;
    this.getDoc();
    this.getOptDocManage();
  }
  /*获取操作手册的地址及文件名*/
  getDoc(){
    this.userPortalService.getOptDoc()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          if(data.data.length > 0){
              this.doc.name = data.data[0].fileName;
              this.doc.url = data.data[0].fileAddress;
          }
        }
      })
  }
  getOptDocManage(){
    this.userPortalService.getOptDocManage()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.rule = data.data;
        }
      })
  }
  /*文件上传*/
  prese_upload(files) {
    var xhr = this.userPortalService.uploadFile(files[0], 'optDoc', 1);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorResponseService.errorMsg(data)){
          confirmFunc.init({
            'title': '提示' ,
            'mes': '上传成功',
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.getDoc();
        }
      }else if(xhr.readyState === 4 && xhr.status === 413 ){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件大小超出限制',
          'popType': 0 ,
          'imgType': 2 ,
        });
      }
    };
  }
}
