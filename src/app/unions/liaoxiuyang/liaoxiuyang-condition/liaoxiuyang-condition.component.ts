import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
  import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
  import {UtilBuildingService} from "../../../service/util-building/util-building.service";
import {Http} from "@angular/http";
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-liaoxiuyang-condition',
  templateUrl: './liaoxiuyang-condition.component.html',
  styleUrls: ['./liaoxiuyang-condition.component.css'],
  providers: [UtilBuildingService]
})
export class LiaoxiuyangConditionComponent implements OnInit {

  public pageSize = 15;
  public pageNo = 1;
  public total = 0;
  public searchInfo = {
    searchName:'',
    searchHrmis:'',
    deptId:'',
    searchTime:'2016-2018',
    userStatus:"pass",
  };
  public deptList:any;
  public orders:any;
  constructor(
    public http:Http,
    private router: Router,
    private route: ActivatedRoute,
    private errorVoid:ErrorResponseService,
    public ipSetting:IpSettingService,
    private utilBuildingService:UtilBuildingService,
  ) { }

  ngOnInit() {
    this.getRepairDept();
    this.searchInfoList(1);
  }
  /*获取部门列表*/
  getRepairDept(){
    let url = '/portal/user/getDeptList';
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.deptList = data.data;
        console.log(this.deptList);
      }
    });
  };
  searchInfoList(num){
    let url = "/soclaty/tourenroll/getUserList/"+num+"/"+this.pageSize+"/list?userName="+
      this.searchInfo.searchName+"&&userId="+this.searchInfo.searchHrmis+"&&deptId="+this.searchInfo.deptId
      +"&&userStatus="+this.searchInfo.userStatus+"&&searchTime="+this.searchInfo.searchTime;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        this.orders = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  /*点击导入按钮*/
  inductionDialog() {
    $('#induction').fadeIn();
  }
  /*关闭导入对话框*/
  closeInductionDialog()  {
    $('#induction').fadeOut();
  }
  /*文件上传*/
  prese_upload2(files) {
    var xhr = this.utilBuildingService.importTemplateInfo(files[0]);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorVoid.errorMsg(data)) {
          if(data.status === 0 ){/*&& data.data.result==='success'*/
            if(data.data.result==='fail'){
              confirmFunc.init({
                'title': '提示',
                'mes': '导入失败，是否下载错误信息？',
                'popType': 1,
                'imgType': 3,
                "callback": () => {
                  window.location.href = this.ipSetting.ip+'/common/file/downErrorExcel/'+data.data.fileName;
                }
              })
            }else{
              confirmFunc.init({
                'title': '提示' ,
                'mes': '导入成功',
                'popType': 0 ,
                'imgType': 1,
              });
            }

          }
          $('#prese2').val('');
          $('#induction').hide();
          this.searchInfoList(1);
        }else{
          $('#prese2').val('');
        }
      }else if (xhr.readyState === 4 && xhr.status === 413){
        confirmFunc.init({
          'title': '提示' ,
          'mes': '文件太大',
          'popType': 0 ,
          'imgType': 2,
        });
        $('#prese2').val('');
      }
    };
  }
  /*导出数据下载*/
  downDeriving(){
    let InductURL = this.ipSetting.ip + "/soclaty/tourenroll/getUserList/1/999999/excel?userName="+
      this.searchInfo.searchName+"&&userId="+this.searchInfo.searchHrmis+"&&deptId="+this.searchInfo.deptId
      +"&&userStatus="+this.searchInfo.userStatus+"&&searchTime="+this.searchInfo.searchTime;
    window.location.href =  InductURL;
  }
}
