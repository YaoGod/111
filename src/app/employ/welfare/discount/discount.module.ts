import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiscountComponent } from './discount.component';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { DiscountInfoMangComponent } from './discount-info-mang/discount-info-mang.component';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { DiscountEmployeeService } from '../../../service/discount-employee/discount-employee.service';
import { DiscountInfoDetailComponent } from './discount-info-detail/discount-info-detail.component';
import { DiscountInfoListComponent } from './discount-info-list/discount-info-list.component';
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
import {ImgurlModule} from "../../../pipe/imgurl/imgurl.module";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: DiscountComponent,
    children: [
      {
        path: '',
        redirectTo: 'manage',
        pathMatch: 'full'
      },
      {
        path: 'manage',
        component: DiscountInfoMangComponent
      },
      {
        path: 'detail/:id',
        component: DiscountInfoDetailComponent
      },
      {
        path: 'list',
        component: DiscountInfoListComponent
      },
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TurnBarModule,
    ImgurlModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [ErrorResponseService,DiscountEmployeeService],
  declarations: [DiscountComponent, DiscountInfoMangComponent, DiscountInfoDetailComponent, DiscountInfoListComponent]
})
export class DiscountModule { }
