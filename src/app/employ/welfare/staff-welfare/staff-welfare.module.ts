import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from '../../../pipe/textarea/textarea.module';
import { StaffWelfareComponent } from './staff-welfare.component';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { StaffWelfareMangComponent } from './staff-welfare-mang/staff-welfare-mang.component';
import { StaffWelfareSearchComponent } from './staff-welfare-search/staff-welfare-search.component';
import { StaffWelfareStatisticsComponent } from './staff-welfare-statistics/staff-welfare-statistics.component';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { WelfareEmployeeService } from '../../../service/welfare-employee/welfare-employee.service';
import { StaffWelfareDetailComponent } from './staff-welfare-detail/staff-welfare-detail.component';
import { SraffWelfareListComponent } from './sraff-welfare-list/sraff-welfare-list.component';
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
import {ImgurlModule} from "../../../pipe/imgurl/imgurl.module";
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
        path: 'detail/:id',
        component: StaffWelfareDetailComponent
      },
      {
        path: 'search',
        component: StaffWelfareSearchComponent
      },
      {
        path: 'list',
        component: SraffWelfareListComponent
      },
      {
        path: 'statistics/:id',
        component: StaffWelfareStatisticsComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TextareaModule,
    TurnBarModule,
    ImgurlModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [ErrorResponseService,WelfareEmployeeService],
  declarations: [
    StaffWelfareComponent,
    StaffWelfareMangComponent,
    StaffWelfareSearchComponent,
    StaffWelfareStatisticsComponent,
    StaffWelfareDetailComponent,
    SraffWelfareListComponent]
})
export class StaffWelfareModule { }
