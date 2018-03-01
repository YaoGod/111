import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Discount } from '../../../../mode/discount/discount.service';
import { GlobalCatalogService } from '../../../../service/global-catalog/global-catalog.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import { DiscountEmployeeService } from '../../../../service/discount-employee/discount-employee.service';
import {IpSettingService} from "../../../../service/ip-setting/ip-setting.service";
declare var $:any;
@Component({
  selector: 'app-discount-info-detail',
  templateUrl: './discount-info-detail.component.html',
  styleUrls: ['./discount-info-detail.component.css']
})
export class DiscountInfoDetailComponent implements OnInit {

  public discount :Discount;
  public time: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private discountEmployeeService:DiscountEmployeeService,
    public ipSetting:IpSettingService
  ) { }

  ngOnInit() {
    this.discount = new Discount();
    this.route.params.subscribe(data => {
      this.getDiscount(data.id);
    });
  }
  getDiscount(id){
    this.discountEmployeeService.getDiscount(id)
      .subscribe(data=> {
        if(this.errorResponseService.errorMsg(data)){
          this.discount = data.data;
          if(this.discount.imgPathList.length>0){
            this.discount.imgPath = this.discount.imgPathList[0];
          }
          this.timeDjs(this.discount.effectBtime,this.discount.effectEtime);
        }
      })
  }
  timeDjs(bDate,eDate){
    let BeginTime = Date.parse(bDate);
    let EndTime  = Date.parse(eDate);
    let nowTime = Date.parse(new Date().toString());
    if(BeginTime>nowTime){
      this.time = "活动暂未开始，敬请期待。";
    }else{
      let leftTime = EndTime+86400000 - nowTime;
      if(leftTime>0){
        this.time = this.readTime(leftTime);
        setInterval(()=>{
          leftTime  = leftTime -1000;
          this.time = this.readTime(leftTime);
        },1000);
      }else{
        this.time = "活动已结束";
      }
    }
  }
  readTime(leftTime){
    let days = parseInt((leftTime / 1000 / 60 / 60 / 24).toString(), 10);  /*计算剩余的天数*/
    let hours = parseInt((leftTime / 1000 / 60 / 60 % 24).toString(), 10); /*计算剩余的小时*/
    let minutes = parseInt((leftTime / 1000 / 60 % 60 ).toString(), 10);     /*计算剩余的分钟*/
    let seconds = parseInt((leftTime / 1000 % 60 ).toString(), 10);          /*计算剩余的秒数*/
    days = this.checkTime(days);
    hours = this.checkTime(hours);
    minutes = this.checkTime(minutes);
    seconds = this.checkTime(seconds);
    return days+"天"+hours+"小时"+minutes+"分钟"+seconds+"秒";
  }
  /*将0-9的数字前面加上0，例1变为01*/
  checkTime(i){
    if(i<10)
    {
      i = "0" + i;
    }
    return i;
  }
  /*判断textarea的行数自适应*/
  definedRows(){
    let length = $("#summary").val().split(/\r?\n/).length;
    return length+1;
  }
  /*查看图片*/
  chooseImg(i){
    this.discount.imgPath = this.discount.imgPathList[i];
  }
}
