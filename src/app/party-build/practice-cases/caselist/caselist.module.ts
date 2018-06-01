import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaselistComponent } from './caselist.component';
import {RouterModule, Routes} from "@angular/router";
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
import {FormsModule} from "@angular/forms";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: CaselistComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TurnBarModule,
    RouterModule.forChild(routes),
  ],
  declarations: [CaselistComponent]
})
export class CaselistModule { }
