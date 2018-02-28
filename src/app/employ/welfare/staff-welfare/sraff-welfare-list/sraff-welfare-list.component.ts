import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IpSettingService } from '../../../../service/ip-setting/ip-setting.service';
import { Welfare } from '../../../../mode/welfare/welfare.service';
import { GlobalCatalogService } from '../../../../service/global-catalog/global-catalog.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import { DiscountEmployeeService } from '../../../../service/discount-employee/discount-employee.service';
import { WelfareEmployeeService } from '../../../../service/welfare-employee/welfare-employee.service';
declare var confirmFunc:any;
declare var $: any;
@Component({
  selector: 'app-sraff-welfare-list',
  templateUrl: './sraff-welfare-list.component.html',
  styleUrls: ['./sraff-welfare-list.component.css'],
  providers: [IpSettingService,DiscountEmployeeService,WelfareEmployeeService]
})
export class SraffWelfareListComponent implements OnInit {

  public rule;
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
    this.globalCatalogService.setTitle("员工服务/惊喜专区/爱统计信息");
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
        this.rule = this.globalCatalogService.getRole("employ/welfare");
      }
    );
    this.pageNo = 1;
    this.pageNoW = 1;
    this.pageSize = 20;
    this.welfares = [];
    this.search = "";
    this.getWelfare("",this.pageNo,this.pageSize);
  }
  getWelfare(search,pageNo,pageSize) {
    this.welfareEmployeeService.getWelfareList(search,pageNo,pageSize)
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          for(let i= 0;i< data.data.infos.length;i++){
            this.welfares.push(data.data.infos[i]);
          }
          this.maxPageNo = Math.ceil(data.data.total / this.pageSize);
        }
      });
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
  scrollMore(){
    this.pageNo++;
    this.getWelfare(this.search,this.pageNo,this.pageSize)
  }
  searchDiscount(){
    this.pageNo = 1;
    this.welfares = [];
    this.getWelfare(this.search,this.pageNo,this.pageSize);
  }
}

