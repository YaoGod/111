import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Welfare } from '../../../../mode/welfare/welfare.service';
import { GlobalCatalogService } from '../../../../service/global-catalog/global-catalog.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import { WelfareEmployeeService } from '../../../../service/welfare-employee/welfare-employee.service';
declare var confirmFunc:any;
declare var $:any;
@Component({
  selector: 'app-staff-welfare-detail',
  templateUrl: './staff-welfare-detail.component.html',
  styleUrls: ['./staff-welfare-detail.component.css']
})
export class StaffWelfareDetailComponent implements OnInit {

  public rule;
  public welfare :Welfare;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private welfareEmployeeService:WelfareEmployeeService
  ) {
    this.rule = this.globalCatalogService.getRole("employ/welfare");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("员工服务/福利专区/福利信息");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("employ/welfare");
      }
    );
    this.welfare = new Welfare();
    this.route.params.subscribe(data => {
      this.welfare.id = data.id;
      this.getWelfare(data.id);
    });
  }
  getWelfare(id){
    this.welfareEmployeeService.getWelfare(id)
      .subscribe(data=> {
        if(this.errorResponseService.errorMsg(data)){
          this.welfare = data.data;
          if(this.welfare.imgPathList.length>0){
            this.welfare.imgPath = this.welfare.imgPathList[0];
          }
          if(this.welfare.feedBack === "是"){
            for(let i= 0;i<this.welfare.feedBackMsg.length;i++){
              this.welfare.feedBackMsg[i].list = this.welfare.feedBackMsg[i].list.split('|');
            }
          }
        }
      })
  }
  submitFeedbackMsg(){
    let error = 0;
    for(let i = 0;i<this.welfare.feedBackMsg.length;i++){
      if(typeof (this.welfare.feedBackMsg[i].value)==="undefined"||
        this.welfare.feedBackMsg[i].value === null||
        this.welfare.feedBackMsg[i].value===""){
        error++;
        confirmFunc.init({
          'title': '提示',
          'mes': '请完善您的反馈信息！',
          'popType': 0,
          'imgType': 2,
        });
        break;
      }
    }
    if(error === 0){
      this.welfareEmployeeService.updateWelfareFeed(this.welfare)
        .subscribe(data=> {
          if(this.errorResponseService.errorMsg(data)){
            confirmFunc.init({
              'title': '提示' ,
              'mes': data.msg,
              'popType': 2 ,
              'imgType': 1 ,
              "callback": ()=>{
                $('#forms').fadeOut();
                this.getWelfare(this.welfare.id);
              },
              "cancel": ()=>{
                $('#forms').fadeOut();
                this.getWelfare(this.welfare.id);
              }
            });

          }
        })
    }
  }
  /*打开反馈浮层*/
  showFeedbackWin(){
    for(let i = 0;i<this.welfare.feedBackMsg.length;i++){
      this.welfare.feedBackMsg[i].value = "";
    }
    if(this.welfare.details&&this.welfare.details.length>0){
      for(let i = 0;i<this.welfare.feedBackMsg.length;i++){
        if(typeof (this.welfare.details[i])!=="undefined"){
          this.welfare.feedBackMsg[i].value = this.welfare.details[i].value;
        }
      }
    }
    $('#forms').show();
  }
  /*关闭反馈浮层*/
  closeFeedbackMsg(){
    $('#forms').fadeOut();
  }
  linkDiscountStatistics(){
      this.router.navigate(['../../statistics',this.welfare.id],{relativeTo:this.route});
  }
  back(){
    history.go(-1);
  }
  /*判断textarea的行数自适应*/
  definedRows(){
    let length = $("#content").val().split(/\r?\n/).length;
    return length+1;
  }
  /*查看图片*/
  chooseImg(i){
    this.welfare.imgPath = this.welfare.imgPathList[i];
  }
}
