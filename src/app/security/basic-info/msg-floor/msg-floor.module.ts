import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MsgFloorComponent } from './msg-floor.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
import {ImgurlModule} from "../../../pipe/imgurl/imgurl.module";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: MsgFloorComponent,
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
  exports: [RouterModule],
  declarations: [MsgFloorComponent]
})
export class MsgFloorModule { }
