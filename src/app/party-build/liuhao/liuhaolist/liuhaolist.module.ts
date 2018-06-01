import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiuhaolistComponent } from './liuhaolist.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";
import {FormsModule} from "@angular/forms";
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: LiuhaolistComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TurnBarModule,
    RouterModule.forChild(routes),
  ],
  declarations: [LiuhaolistComponent]
})
export class LiuhaolistModule { }
