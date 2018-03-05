import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyMagComponent } from './daily-mag.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
import {HttpModule} from "@angular/http";
import {NavTitleModule} from "../../component/nav-title/nav-title.module";
import {GlobalFooterModule} from "../../component/global-footer/global-footer.module";
import {TurnBarModule} from "../../component/turn-bar/turn-bar.module";
import {ImgurlModule} from "../../pipe/imgurl/imgurl.module";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: DailyMagComponent,
    children: [
      {
        path: '',
        redirectTo: "repair",
        pathMatch: 'full'
      },
      {
        path: 'repair',
        loadChildren: './repair/repair.module#RepairModule'
      },
      {
        path: 'fitment',
        loadChildren: './fitment/fitment.module#FitmentModule'
      },
      {
        path: 'guard',
        loadChildren: './guard/guard.module#GuardModule'
      },
      {
        path: 'device',
        loadChildren: './device/device.module#DeviceModule'
      },
      {
        path: 'device/:id',
        loadChildren: './device/device.module#DeviceModule'
      },
      {
        path: 'energy',
        loadChildren: './energy/energy.module#EnergyModule'
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NavTitleModule,
    TurnBarModule,
    ImgurlModule,
    GlobalFooterModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [DailyMagComponent]
})
export class DailyMagModule { }
