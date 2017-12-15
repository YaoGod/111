import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IpSettingService } from '../../../service/ip-setting/ip-setting.service';
import { Discount } from '../../../mode/discount/discount.service';
import { Welfare } from '../../../mode/welfare/Welfare.service';
import { GlobalCatalogService } from '../../../service/global-catalog/global-catalog.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { DiscountEmployeeService } from '../../../service/discount-employee/discount-employee.service';
import { WelfareEmployeeService } from '../../../service/welfare-employee/welfare-employee.service';
declare var confirmFunc:any;
declare var $: any;
@Component({
  selector: 'app-index-welfare',
  templateUrl: './index-welfare.component.html',
  styleUrls: ['./index-welfare.component.css'],
  providers: [IpSettingService,DiscountEmployeeService,WelfareEmployeeService]
})
export class IndexWelfareComponent implements OnInit {

  public  discounts: Array<Discount>;
  public  welfares: Array<Welfare>;
  public  ip: string;
  constructor(
    private router: Router,
    public IpSetting:IpSettingService,
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private discountEmployeeService:DiscountEmployeeService,
    private welfareEmployeeService:WelfareEmployeeService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("员工服务/福利专区");
    this.getDiscount("",1,6);
    this.getWelfare("",1,6);
  }
  getDiscount(search,pageNo,pageSize) {
    this.discountEmployeeService.getDiscountList(search,pageNo,pageSize)
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          this.discounts = data.data.infos;
        }
      });
  }
  getWelfare(search,pageNo,pageSize) {
    this.welfareEmployeeService.getWelfareList(search,pageNo,pageSize)
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          this.welfares = data.data.infos;
        }
      });
  }
  linkDiscount(id){
    this.router.navigate(['/hzportal/employ/welfare/discount/detail',id]);
  }
  linkDiscountMag(){
    this.router.navigate(['/hzportal/employ/welfare/discount/manage']);
  }
  linkWelfare(id){
    this.router.navigate(['/hzportal/employ/welfare/staffWelfare/detail',id]);
  }
  linkWelfareMag(){
    this.router.navigate(['/hzportal/employ/welfare/staffWelfare/manage']);
  }
}
