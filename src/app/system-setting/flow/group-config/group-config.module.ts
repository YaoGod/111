import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";
import {GroupConfigComponent} from "./group-config.component";
import {FormsModule} from "@angular/forms";
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";


const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: GroupConfigComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TurnBarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GroupConfigComponent]
})
export class GroupConfigModule { }
