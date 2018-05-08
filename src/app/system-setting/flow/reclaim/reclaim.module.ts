import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ReclaimComponent} from "./reclaim.component";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";
import {FormsModule} from "@angular/forms";
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";


const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: ReclaimComponent,
  }
];
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    TurnBarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReclaimComponent]
})
export class ReclaimModule { }
