import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Discount, Other } from '../../../../mode/discount/discount.service';
import { GlobalCatalogService } from '../../../../service/global-catalog/global-catalog.service';
import { ErrorResponseService } from '../../../../service/error-response/error-response.service';
import { DiscountEmployeeService } from '../../../../service/discount-employee/discount-employee.service';

@Component({
  selector: 'app-discount-info-detail',
  templateUrl: './discount-info-detail.component.html',
  styleUrls: ['./discount-info-detail.component.css']
})
export class DiscountInfoDetailComponent implements OnInit {

  public discount :Discount;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalCatalogService: GlobalCatalogService,
    private errorResponseService:ErrorResponseService,
    private discountEmployeeService:DiscountEmployeeService
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
          this.discount = data.data.infos;
        }
      })
  }
}
