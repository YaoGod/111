import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelfareComponent } from './welfare.component';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
import {} from './staff-welfare/staff-welfare.module'
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: WelfareComponent,
    children: [
      {
        path: '',
        redirectTo: 'discount',
        pathMatch: 'full'
      },
      {
        path: 'discount',
        loadChildren: './discount/discount.module#DiscountModule'
      },
      {
        path: 'staffWelfare',
        loadChildren: './staff-welfare/staff-welfare.module#StaffWelfareModule'
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
  declarations: [WelfareComponent]
})
export class WelfareModule { }
