import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FitmentComponent } from './fitment.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: FitmentComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [FitmentComponent]
})
 /*大楼装修管理*/
export class FitmentModule { }
