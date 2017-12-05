import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelfareComponent } from './welfare.component';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: WelfareComponent,
    children: []
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
