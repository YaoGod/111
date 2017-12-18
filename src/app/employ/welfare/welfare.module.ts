import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelfareComponent } from './welfare.component';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { IndexWelfareComponent } from './index-welfare/index-welfare.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: WelfareComponent,
    children: [
      {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full'
      },
      {
        path: 'index',
        component: IndexWelfareComponent
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
  declarations: [WelfareComponent, IndexWelfareComponent]
})
export class WelfareModule { }
