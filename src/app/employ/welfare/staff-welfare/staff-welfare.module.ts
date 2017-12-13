import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffWelfareComponent } from './staff-welfare.component';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { StaffWelfareMangComponent } from './staff-welfare-mang/staff-welfare-mang.component';
import { StaffWelfareSearchComponent } from './staff-welfare-search/staff-welfare-search.component';
import { StaffWelfareStatisticsComponent } from './staff-welfare-statistics/staff-welfare-statistics.component';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { WelfareEmployeeService } from '../../../service/welfare-employee/welfare-employee.service';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: StaffWelfareComponent,
    children: [
      {
        path: '',
        redirectTo: 'manage',
        pathMatch: 'full'
      },
      {
        path: 'manage',
        component: StaffWelfareMangComponent
      },
      {
        path: 'search',
        component: StaffWelfareSearchComponent
      },
      {
        path: 'statistics',
        component: StaffWelfareStatisticsComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [ErrorResponseService,WelfareEmployeeService],
  declarations: [StaffWelfareComponent, StaffWelfareMangComponent, StaffWelfareSearchComponent, StaffWelfareStatisticsComponent]
})
export class StaffWelfareModule { }
