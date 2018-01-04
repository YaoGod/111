import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilitatorComponent } from './facilitator/facilitator.component';
import { PriceComponent } from './price/price.component';
import { PlanLaundryComponent } from './plan-laundry/plan-laundry.component';
import { PlanLaundryReportComponent } from './plan-laundry-report/plan-laundry-report.component';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { LaundryComponent } from './laundry.component';
import {FormsModule} from "@angular/forms";
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
import { LaundryAdminComponent } from './laundry-admin/laundry-admin.component';
import { LaundryOrderComponent } from './laundry-order/laundry-order.component';
import { ServeTimeComponent } from './serve-time/serve-time.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: LaundryComponent,
    children: [
      {
        path: '',
        redirectTo: 'facilitator',
        pathMatch: 'full'
      },
      {
        path: 'facilitator',
        component: FacilitatorComponent,
      },
      {
        path: 'price',
        component: PriceComponent,
      },
      {
        path: 'planLaundry',
        component: PlanLaundryComponent,
      },
      {
        path: 'laundryOrder',
        component: LaundryOrderComponent,
      },
      {
        path: 'laundryAdmin',
        component: LaundryAdminComponent,
      },
      {
        path: 'planReport',
        component: PlanLaundryReportComponent,
      },{
        path: 'serveTime',
        component: ServeTimeComponent,
      },
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TurnBarModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: [FacilitatorComponent, PriceComponent, PlanLaundryComponent, PlanLaundryReportComponent, LaundryComponent,
    LaundryAdminComponent, LaundryOrderComponent, ServeTimeComponent]
})
export class LaundryModule { }
