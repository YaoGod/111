import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffWelfareComponent } from './staff-welfare.component';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { StaffWelfareMangComponent } from './staff-welfare-mang/staff-welfare-mang.component';
import { StaffWelfareSearchComponent } from './staff-welfare-search/staff-welfare-search.component';
import { StaffWelfareStatisticsComponent } from './staff-welfare-statistics/staff-welfare-statistics.component';
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
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: [StaffWelfareComponent, StaffWelfareMangComponent, StaffWelfareSearchComponent, StaffWelfareStatisticsComponent]
})
export class StaffWelfareModule { }
