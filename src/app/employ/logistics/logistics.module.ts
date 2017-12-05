import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogisticsComponent } from './logistics.component';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: LogisticsComponent,
    children: []
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: [LogisticsComponent]
})
export class LogisticsModule { }
