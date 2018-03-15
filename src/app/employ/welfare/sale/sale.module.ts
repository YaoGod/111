import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { SaleComponent } from './sale.component';
import {ImgurlModule} from "../../../pipe/imgurl/imgurl.module";
import { SaleListComponent } from './sale-list/sale-list.component';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
import { SaleMangComponent } from './sale-mang/sale-mang.component';
import { SaleStatisticsComponent } from './sale-statistics/sale-statistics.component';
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
import {SaleProductEmployeeService} from "../../../service/sale-product-employee/sale-product-employee.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import { SaleMyorderComponent } from './sale-myorder/sale-myorder.component';
import {PrintBarModule} from "../../../component/print-bar/print-bar.module";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: SaleComponent,
    children: [
      {
        path: '',
        redirectTo: 'manage',
        pathMatch: 'full'
      },
      {
        path: 'manage',
        component: SaleMangComponent
      },
      {
        path: 'detail/:id',
        component: SaleDetailComponent
      },
      {
        path: 'list',
        component: SaleListComponent
      },
      {
        path: 'myorder',
        component: SaleMyorderComponent
      },
      {
        path: 'myorder/:id',
        component: SaleMyorderComponent
      },
      {
        path: 'statistics/:id',
        component: SaleStatisticsComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TurnBarModule,
    ImgurlModule,
    PrintBarModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers:[SaleProductEmployeeService,ErrorResponseService],
  declarations: [SaleComponent, SaleListComponent, SaleDetailComponent, SaleMangComponent, SaleStatisticsComponent, SaleMyorderComponent]
})
export class SaleModule { }
