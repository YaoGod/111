import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Welfare } from '../../../../mode/welfare/Welfare.service';
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
      this.getWelfare(data.id);
    });
  }
  getWelfare(id){
    this.welfareEmployeeService.getWelfare(id)
      .subscribe(data=> {
        if(this.errorResponseService.errorMsg(data)){
          this.welfare = data.data;
        }
      })
  }
  submitFeedbackMsg(){
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
  showFeedbackWin(){
    if(this.welfare.details&&this.welfare.details.length>0){
      for(let i = 0;i<this.welfare.feedBackMsg.length;i++){
        if(typeof (this.welfare.details[i])!=="undefined"){
          this.welfare.feedBackMsg[i].value = this.welfare.details[i].value;
        }
      }
    }
    $('#forms').show();
  }
  closeFeedbackMsg(){
    for(let i = 0;i<this.welfare.feedBackMsg.length;i++){
      this.welfare.feedBackMsg[i].value = "";
    }
    $('#forms').fadeOut();
  }
  linkDiscountStatistics(){
      this.router.navigate(['/hzportal/employ/welfare/staffWelfare/statistics/',this.welfare.id]);
  }
}