import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleInfoComponent } from './vehicle-info.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";
import {FormsModule} from "@angular/forms";
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
import {ImgurlModule} from "../../../pipe/imgurl/imgurl.module";

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: VehicleInfoComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TurnBarModule,
    ImgurlModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VehicleInfoComponent]
})
export class VehicleInfoModule { }
