import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";
import {BulletinlistComponent} from "./bulletinlist.component";
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
import {FormsModule} from "@angular/forms";

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: BulletinlistComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TurnBarModule,
    RouterModule.forChild(routes),
  ],
  declarations: [BulletinlistComponent]
})
export class BulletinlistModule { }
