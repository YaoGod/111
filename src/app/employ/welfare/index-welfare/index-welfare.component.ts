import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IpSettingService } from '../../../service/ip-setting/ip-setting.service';
import { Discount } from '../../../mode/discount/discount.service';
import { Welfare } from '../../../mode/welfare/welfare.service';
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
  public catas;
  public rule;
  public rule1;
  public rule2;
  public  discounts: Array<Discount>;
  public  welfares: Array<Welfare>;
  public  ip: string;
  public pageSize:number;
  public pageNoD: number;
  public maxPageNoD: number;
  public pageNoW: number;
  public maxPageNoW: number;
  constructor(
    private router: Router,
    public IpSetting:IpSettingService,
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private discountEmployeeService:DiscountEmployeeService,
    private welfareEmployeeService:WelfareEmployeeService
  ) {
    this.rule = this.globalCatalogService.getRole("employ/welfare");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("员工服务/惊喜专区");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("employ/welfare");
      }
    );
    this.getRule();
    this.pageNoD = 1;
    this.pageNoW = 1;
    this.pageSize = 6;
    this.discounts = [];
    this.welfares = [];
    this.getDiscount("",this.pageNoD,this.pageSize);
    this.getWelfare("",this.pageNoW,this.pageSize);
  }
  getRule(){
    this.globalCatalogService.getCata(-1,'group','employ/welfare')
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.catas = data.data;
          for(let i = 0;i<this.catas.length;i++){
            if(this.catas[i].routeUrl === "employ/welfare/discount/manage"){
              this.rule1 = this.catas[i];
            }
            if(this.catas[i].routeUrl === "employ/welfare/staffWelfare/manage"){
              this.rule2 = this.catas[i];
            }
          }
        }
      })
  }
  getDiscount(search,pageNo,pageSize) {
    this.discountEmployeeService.getDiscountList('execute',search,pageNo,pageSize)
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          this.discounts = data.data.infos;
          this.maxPageNoD = data.data.total;
        }
      });
  }
  getWelfare(search,pageNo,pageSize) {
    this.welfareEmployeeService.getWelfareList(search,pageNo,pageSize)
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          this.welfares = data.data.infos;
          this.maxPageNoW = data.data.total;
        }
      });
  }
  linkDiscount(id){
    this.router.navigate(['/hzportal/employ/welfare/discount/detail',id]);
  }
  linkDiscountMag(){
    this.router.navigate(['/hzportal/employ/welfare/discount/manage']);
  }
  linkDiscountList(){
    this.router.navigate(['/hzportal/employ/welfare/discount/list']);
  }
  linkWelfare(id){
    this.router.navigate(['/hzportal/employ/welfare/staffWelfare/detail',id]);
  }
  linkWelfareMag(){
    this.router.navigate(['/hzportal/employ/welfare/staffWelfare/manage']);
  }
  linkWelfareList(){
    this.router.navigate(['/hzportal/employ/welfare/staffWelfare/list']);
  }
  rand(pageNo,total):number{
    if(total === 0) {
      return 1;
    }
    let pages = Math.ceil(total/6);
    if(pages === 1){
      return 1;
    }
    let tempNo =  Math.ceil(Math.random()*pages);
    while(tempNo === pageNo){
      tempNo =  Math.ceil(Math.random()*pages);
    }
    return tempNo;
  }
  randGetDiscount(){
    this.pageNoD = this.rand(this.pageNoD,this.maxPageNoD);
    this.getDiscount("",this.pageNoD,this.pageSize);
  }
  randGetWelfare(){
    this.pageNoW = this.rand(this.pageNoW,this.maxPageNoW);
    this.getWelfare("",this.pageNoW,this.pageSize);
  }
}
