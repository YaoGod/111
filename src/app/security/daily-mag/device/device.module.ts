import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceComponent } from './device.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
import {FormsModule} from "@angular/forms";
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: DeviceComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TurnBarModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [DeviceComponent]
})
 /*大楼设备管理*/
export class DeviceModule { }
