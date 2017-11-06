import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnergyComponent } from './energy.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: EnergyComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [EnergyComponent]
})
 /*大楼能耗管理*/
export class EnergyModule { }
