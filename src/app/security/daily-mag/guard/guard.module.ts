import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms"
import { GuardComponent } from './guard.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";


const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: GuardComponent,
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
  declarations: [GuardComponent]
})
 /*大楼保安管理*/
export class GuardModule { }
