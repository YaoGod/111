import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermitComponent } from './permit.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
import {ImgurlModule} from "../../../pipe/imgurl/imgurl.module";
import {FormsModule} from "@angular/forms";

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: PermitComponent,
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
  declarations: [PermitComponent]
})

export class PermitModule { }
