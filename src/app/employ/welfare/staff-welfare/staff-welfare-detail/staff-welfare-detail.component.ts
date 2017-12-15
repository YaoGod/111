import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Welfare } from '../../../../mode/welfare/Welfare.service';
import { GlobalCatalogService } from '../../../../service/global-catalog/global-catalog.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import { WelfareEmployeeService } from '../../../../service/welfare-employee/welfare-employee.service';

@Component({
  selector: 'app-staff-welfare-detail',
  templateUrl: './staff-welfare-detail.component.html',
  styleUrls: ['./staff-welfare-detail.component.css']
})
export class StaffWelfareDetailComponent implements OnInit {

  public welfare :Welfare;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private welfareEmployeeService:WelfareEmployeeService
  ) { }

  ngOnInit() {
    this.welfare = new Welfare();
    this.route.params.subscribe(data => {
      this.getDiscount(data.id);
    });
  }
  getDiscount(id){
    this.welfareEmployeeService.getWelfare(id)
      .subscribe(data=> {
        if(this.errorResponseService.errorMsg(data)){
          console.log(data.data);
          this.welfare = data.data;
        }
      })
  }

}
