import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IpSettingService } from '../../../../service/ip-setting/ip-setting.service';
import { Discount } from '../../../../mode/discount/discount.service';
import { Welfare } from '../../../../mode/welfare/welfare.service';
import { GlobalCatalogService } from '../../../../service/global-catalog/global-catalog.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import { DiscountEmployeeService } from '../../../../service/discount-employee/discount-employee.service';
import { WelfareEmployeeService } from '../../../../service/welfare-employee/welfare-employee.service';
declare var confirmFunc:any;
declare var $: any;
@Component({
  selector: 'app-discount-info-list',
  templateUrl: './discount-info-list.component.html',
  styleUrls: ['./discount-info-list.component.css'],
  providers: [IpSettingService,DiscountEmployeeService,WelfareEmployeeService]
})
export class DiscountInfoListComponent implements OnInit {

  public rule;
  public  discounts: Array<Discount>;
  public  welfares: Array<Welfare>;
  public  ip: string;
  public pageSize:number;
  public pageNo: number;
  public maxPageNo: number;
  public pageNoW: number;
  public maxPageNoW: number;
  public search: string;
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
    this.globalCatalogService.setTitle("员工服务/福利专区/优惠商品");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("employ/welfare");
      }
    );
    this.pageNo = 1;
    this.pageNoW = 1;
    this.pageSize = 20;
    this.discounts = [];
    this.welfares = [];
    this.search = "";
    this.getDiscount("",this.pageNo,this.pageSize);
  }
  getDiscount(search,pageNo,pageSize) {
    this.discountEmployeeService.getDiscountList('execute',search,pageNo,pageSize)
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          for(let i= 0;i< data.data.infos.length;i++){
            this.discounts.push(data.data.infos[i]);
          }
          console.log(this.discounts);
          /*this.discounts = this.discounts.concat(data.data.infos);*/
          this.maxPageNo = Math.ceil(data.data.total / this.pageSize);
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
  scrollMore(){
    this.pageNo++;
    this.getDiscount(this.search,this.pageNo,this.pageSize)
  }
  searchDiscount(){
    this.pageNo = 1;
    this.discounts = [];
    this.getDiscount(this.search,this.pageNo,this.pageSize);
  }
  back(){
    history.go(-1);
  }
}

