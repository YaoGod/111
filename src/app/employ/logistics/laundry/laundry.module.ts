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
        path: 'PlanReport',
        component: PlanLaundryReportComponent,
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
  declarations: [FacilitatorComponent, PriceComponent, PlanLaundryComponent, PlanLaundryReportComponent, LaundryComponent]
})
export class LaundryModule { }
