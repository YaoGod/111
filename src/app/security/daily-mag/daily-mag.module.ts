import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyMagComponent } from './daily-mag.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: DailyMagComponent,
    children:[
      {
        path: '',
        redirectTo: 'repair',
        pathMatch: 'full'
      },
      {
        path: 'repair',
        loadChildren:'./repair/repair.module#RepairModule'
      },
      {
        path: 'fitment',
        loadChildren:'./fitment/fitment.module#FitmentModule'
      },
      {
        path: 'guard',
        loadChildren:'./guard/guard.module#GuardModule'
      },
      {
        path: 'device',
        loadChildren:'./device/device.module#DeviceModule'
      },
      {
        path: 'clean',
        loadChildren:'./clean/clean.module#CleanModule'
      },
      {
        path: 'energy',
        loadChildren:'./energy/energy.module#EnergyModule'
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [DailyMagComponent]
})
export class DailyMagModule { }
